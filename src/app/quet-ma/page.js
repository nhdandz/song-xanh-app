'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FaBarcode,
  FaCamera,
  FaLeaf,
  FaRecycle,
  FaExclamationTriangle,
  FaHistory,
  FaSearch,
  FaArrowLeft,
  FaImage,
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaLightbulb,
  FaMagic,
  FaKeyboard,
  FaSyncAlt
} from 'react-icons/fa';
import { compressImageToBase64 } from '@/lib/image';

// Dữ liệu mẫu cho sản phẩm
const PRODUCTS = [
  {
    id: 1,
    barcode: '8938507968047',
    name: 'Nước khoáng Lavie 500ml',
    brand: 'Lavie',
    category: 'Đồ uống',
    packaging: 'Chai nhựa',
    greenScore: 6.5,
    recyclable: true,
    biodegradable: false,
    plasticFree: false,
    recommendation: 'Tái chế vỏ chai sau khi sử dụng. Hoặc thay thế bằng bình nước cá nhân.',
  },
  {
    id: 2,
    barcode: '8934563138165',
    name: 'Ống hút giấy ECO 100 cái',
    brand: 'ECO',
    category: 'Đồ dùng',
    packaging: 'Hộp giấy',
    greenScore: 8.7,
    recyclable: true,
    biodegradable: true,
    plasticFree: true,
    recommendation: 'Sản phẩm thân thiện với môi trường, thay thế tốt cho ống hút nhựa.',
  },
  {
    id: 3,
    barcode: '8938506547828',
    name: 'Túi ni lông đen 1kg',
    brand: 'Nhựa Hoàng Long',
    category: 'Đồ dùng',
    packaging: 'Túi nhựa',
    greenScore: 2.1,
    recyclable: false,
    biodegradable: false,
    plasticFree: false,
    recommendation: 'Nên thay thế bằng túi vải hoặc túi giấy để giảm rác thải nhựa.',
  },
];

const LOCAL_KEY = 'sx_scan_history_v1';

export default function BarcodeScan() {
  const [viewMode, setViewMode] = useState('scan');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchError, setSearchError] = useState('');
  const [scannedProduct, setScannedProduct] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);

  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const codeReaderRef = useRef(null);
  const videoRef = useRef(null);
  const lastScanRef = useRef({ text: null, time: 0 });
  // Bộ điều khiển do zxing trả về; đây mới là cách dừng quét đúng của
  // @zxing/browser 0.1.x (BrowserMultiFormatReader không có hàm reset).
  const controlsRef = useRef(null);
  // Dùng ref song song với state để các hàm async không đọc phải giá trị cũ
  const scanningRef = useRef(false);

  // Tắt camera cho bằng được: dừng vòng quét của zxing rồi tắt nốt mọi
  // track của luồng video. Thiếu bước này là đèn camera vẫn sáng sau khi
  // đã quét xong.
  const stopScanner = useCallback(async () => {
    try {
      controlsRef.current?.stop();
    } catch (e) {
      console.warn('Không dừng được vòng quét', e);
    }
    controlsRef.current = null;

    try {
      const video = videoRef.current;
      const stream = video?.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        video.srcObject = null;
      }
    } catch (e) {
      console.warn('Không dọn được video', e);
    }

    scanningRef.current = false;
    setScanning(false);
  }, []);

  const [evaluating, setEvaluating] = useState(false);
  const [processingImage, setProcessingImage] = useState(false);
  // Luồng nhận diện sản phẩm từ ảnh bằng mô hình thị giác - ngôn ngữ.
  const [recognizing, setRecognizing] = useState(false);

  // Danh mục sản phẩm lấy từ database để quản trị viên thêm ở /admin/san-pham
  // là hiện được ngay. Mảng PRODUCTS cắm cứng bên trên chỉ là dự phòng.
  const [products, setProducts] = useState(PRODUCTS);

  useEffect(() => {
    let huy = false;

    fetch('/api/products')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!huy && d?.products?.length) setProducts(d.products);
      })
      .catch((err) => console.warn('Không tải được danh mục sản phẩm:', err));

    return () => { huy = true; };
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) setScanHistory(JSON.parse(raw));
      else setScanHistory([]);
    } catch (e) {
      console.warn('Không thể đọc history', e);
      setScanHistory([]);
    }
    // stopScanner là useCallback không phụ thuộc gì nên không đổi giữa
    // các lần render; để nó trong deps cho đúng quy tắc hook.
    return () => stopScanner();
  }, [stopScanner]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(scanHistory));
    } catch (e) {
      console.warn('Lưu history lỗi', e);
    }
  }, [scanHistory]);

  const getProductByBarcode = (barcode) => products.find(p => p.barcode === barcode);

  const pushHistory = (productOrRaw) => {
    const entry = {
      productId: productOrRaw.id || null,
      name: productOrRaw.name || null,
      barcode: productOrRaw.barcode,
      timestamp: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
    setScanHistory(prev => [entry, ...prev].slice(0, 50));
  };

  const evaluateProductWithAI = async (barcode, productName = null) => {
    setEvaluating(true);
    try {
      const response = await fetch('/api/evaluate-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barcode,
          productName: productName || `Sản phẩm mã ${barcode}`,
          category: '',
          packaging: ''
        })
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const result = await response.json();

      return {
        id: null,
        barcode: result.barcode || barcode,
        name: result.name || productName || 'Sản phẩm không xác định',
        brand: result.brand || '',
        category: result.category || 'Chưa xác định',
        packaging: result.packaging || 'Chưa xác định',
        greenScore: result.greenScore || 5.0,
        recyclable: result.recyclable || false,
        biodegradable: result.biodegradable || false,
        plasticFree: result.plasticFree || false,
        recommendation: result.recommendation || 'Không có gợi ý',
        analysis: result.analysis || ''
      };
    } catch (error) {
      console.error('Error evaluating product:', error);
      return {
        id: null,
        barcode,
        name: productName || 'Sản phẩm không xác định',
        brand: '',
        category: 'Chưa xác định',
        packaging: 'Chưa xác định',
        greenScore: null,
        recyclable: false,
        biodegradable: false,
        plasticFree: false,
        recommendation: 'Không thể đánh giá sản phẩm. Vui lòng thử lại.',
        aiError: error.message
      };
    } finally {
      setEvaluating(false);
    }
  };

  // Gửi ảnh cho mô hình thị giác - ngôn ngữ để nhận ra sản phẩm rồi chấm độ
  // xanh. Dùng khi sản phẩm không có mã vạch, hoặc mã bị che, mờ, rách.
  const recognizeProductFromImage = async (file) => {
    setRecognizing(true);
    setViewMode('result');
    setScannedProduct({
      id: null,
      barcode: null,
      name: 'Đang nhận diện ảnh...',
      brand: '',
      category: '',
      packaging: '',
      greenScore: null,
      recyclable: false,
      biodegradable: false,
      plasticFree: false,
      recommendation: 'Mô hình đang đọc ảnh sản phẩm, chờ một chút nhé.'
    });

    try {
      const { base64, mimeType } = await compressImageToBase64(file);

      const response = await fetch('/api/nhan-dien-san-pham', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result?.error || `API trả lỗi ${response.status}`);

      setScannedProduct({ id: null, ...result });

      if (result.detected) {
        pushHistory({ id: null, barcode: null, name: result.name });
      }
    } catch (err) {
      console.error('Lỗi nhận diện ảnh:', err);
      setScannedProduct({
        id: null,
        barcode: null,
        name: 'Không nhận diện được',
        brand: '',
        category: 'Chưa xác định',
        packaging: 'Chưa xác định',
        greenScore: null,
        recyclable: false,
        biodegradable: false,
        plasticFree: false,
        recommendation: 'Hãy thử chụp lại gần hơn, đủ sáng và thấy rõ bao bì sản phẩm.',
        aiError: err.message
      });
    } finally {
      setRecognizing(false);
    }
  };

  const handleRecognizeFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh hợp lệ (JPG, PNG, v.v.)');
      return;
    }

    await stopScanner();
    await recognizeProductFromImage(file);
  };

  const onScanResult = async (decodedText) => {
    const now = Date.now();
    if (lastScanRef.current.text === decodedText && now - lastScanRef.current.time < 2000) return;
    lastScanRef.current = { text: decodedText, time: now };

    // Quét xong là tắt camera ngay, không để đèn camera sáng suốt lúc
    // người dùng đang xem kết quả.
    await stopScanner();

    const product = getProductByBarcode(decodedText);

    if (product) {
      setScannedProduct(product);
      pushHistory({ id: product.id, barcode: decodedText, name: product.name });
      setViewMode('result');
    } else {
      setViewMode('result');
      setScannedProduct({
        id: null,
        barcode: decodedText,
        name: 'Đang phân tích...',
        brand: '',
        category: '',
        packaging: '',
        greenScore: null,
        recyclable: false,
        biodegradable: false,
        plasticFree: false,
        recommendation: 'Đang sử dụng AI để đánh giá sản phẩm...'
      });

      const evaluatedProduct = await evaluateProductWithAI(decodedText);
      setScannedProduct(evaluatedProduct);
      pushHistory({ id: null, barcode: decodedText, name: evaluatedProduct.name });
    }
  };


  const startScanner = async (deviceId = selectedCamera) => {
    if (scanningRef.current) return;

    scanningRef.current = true;
    setScanning(true);
    setCameraError('');

    try {
      const { BrowserMultiFormatReader } = await import('@zxing/browser');
      if (!codeReaderRef.current) {
        codeReaderRef.current = new BrowserMultiFormatReader();
      }

      // Thẻ video luôn nằm sẵn trong DOM nên không cần chờ render
      const video = videoRef.current;
      if (!video) throw new Error('Không tìm thấy khung xem camera');

      // Chưa chọn camera cụ thể thì ưu tiên camera sau của điện thoại,
      // nếu không trình duyệt hay mở nhầm camera trước.
      const constraints = deviceId
        ? { video: { deviceId: { exact: deviceId } } }
        : { video: { facingMode: { ideal: 'environment' } } };

      controlsRef.current = await codeReaderRef.current.decodeFromConstraints(
        constraints,
        video,
        (result) => {
          if (result) onScanResult(result.getText());
        }
      );

      // Chỉ sau khi được cấp quyền thì enumerateDevices mới có nhãn camera
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((d) => d.kind === 'videoinput');
        setCameras(videoDevices);
        if (!deviceId && videoDevices.length) {
          const dangDung = video.srcObject?.getVideoTracks?.()[0]?.getSettings?.().deviceId;
          setSelectedCamera(dangDung || videoDevices[0].deviceId);
        }
      } catch (e) {
        console.warn('Không liệt kê được camera', e);
      }
    } catch (err) {
      console.error('Lỗi khi mở camera:', err);
      await stopScanner();
      setCameraError(
        err?.name === 'NotAllowedError'
          ? 'Trình duyệt chưa được cấp quyền dùng camera. Hãy bật quyền camera cho trang này rồi thử lại.'
          : `Không mở được camera: ${err?.message || String(err)}`
      );
    }
  };

  const handleCameraButton = async () => {
    if (scanningRef.current) {
      await stopScanner();
    } else {
      await startScanner();
    }
  };

  const handleDoiCamera = async (deviceId) => {
    setSelectedCamera(deviceId);
    await stopScanner();
    await startScanner(deviceId);
  };

  const handleSearch = () => {
    const t = searchTerm.trim();
    if (t.length < 6) {
      setSearchError('Mã vạch phải có ít nhất 6 chữ số.');
      return;
    }
    setSearchError('');
    onScanResult(t);
    setSearchTerm('');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra file type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh hợp lệ (JPG, PNG, v.v.)');
      e.target.value = '';
      return;
    }

    setProcessingImage(true);
    let detectionSuccess = false;

    // Thử phương pháp 1: BarcodeDetector API (nếu có)
    if ('BarcodeDetector' in window) {
      try {
        const formats = ['ean_13', 'ean_8', 'code_128', 'qr_code', 'code_39', 'code_93', 'codabar', 'itf', 'upc_a', 'upc_e'];
        const detector = new window.BarcodeDetector({ formats });

        let imageBitmap;
        try {
          imageBitmap = await createImageBitmap(file);
        } catch (bitmapErr) {
          console.warn('Không thể tạo imageBitmap:', bitmapErr);
          throw bitmapErr;
        }

        const results = await detector.detect(imageBitmap);
        imageBitmap.close?.();

        if (results && results.length > 0) {
          await stopScanner();
          onScanResult(results[0].rawValue);
          e.target.value = '';
          setProcessingImage(false);
          detectionSuccess = true;
          return;
        }
      } catch (err) {
        console.warn('BarcodeDetector không hoạt động:', err);
      }
    }

    // Thử phương pháp 2: ZXing library
    if (!detectionSuccess) {
      try {
        const { BrowserMultiFormatReader } = await import('@zxing/browser');
        const reader = new BrowserMultiFormatReader();

        // Đọc file thành URL
        const imageUrl = URL.createObjectURL(file);

        try {
          const result = await reader.decodeFromImageUrl(imageUrl);
          URL.revokeObjectURL(imageUrl);

          if (result) {
            await stopScanner();
            onScanResult(result.getText());
            e.target.value = '';
            setProcessingImage(false);
            detectionSuccess = true;
            return;
          }
        } catch (decodeErr) {
          URL.revokeObjectURL(imageUrl);
          console.warn('ZXing không thể decode:', decodeErr);
        }
      } catch (err) {
        console.warn('ZXing import error:', err);
      }
    }

    // Không đọc được mã vạch thì chuyển sang nhận diện bằng mô hình thị
    // giác: nhiều sản phẩm không có mã, hoặc mã bị che, mờ, rách.
    setProcessingImage(false);
    e.target.value = '';

    if (!detectionSuccess) {
      await recognizeProductFromImage(file);
    }
  };

  const getProductFromHistory = (historyItem) => {
    if (historyItem.productId) return products.find(p => p.id === historyItem.productId) || null;
    return null;
  };

  const handleViewHistoryProduct = (historyItem) => {
    const prod = getProductFromHistory(historyItem);
    if (prod) setScannedProduct(prod);
    else setScannedProduct({
      id: null,
      barcode: historyItem.barcode,
      name: historyItem.name || 'Sản phẩm không xác định',
      brand: '', category: '', packaging: '', greenScore: null,
      recyclable: false, biodegradable: false, plasticFree: false,
      recommendation: 'Chưa có dữ liệu cho mã này.'
    });
    setViewMode('result');
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-brand';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 8) return 'bg-brand-wash';
    if (score >= 5) return 'bg-sun-wash';
    return 'bg-red-50';
  };

  // ========== RENDER VIEWS ==========
  const renderScanView = () => (
    <div className="space-y-5">
      {/* ---------- Tiêu đề ---------- */}
      <header className="sx-enter">
        <span className="sx-chip bg-sky-wash text-sky">
          <FaBarcode size={11} />
          Mua sắm xanh
        </span>
        <h1 className="text-2xl sm:text-3xl text-ink mt-2.5">Quét sản phẩm</h1>
        <p className="text-ink-soft mt-1">
          Xem sản phẩm thân thiện với môi trường tới đâu trước khi mua.
        </p>
      </header>

      {/* ---------- Cách 1: camera (cách chính) ---------- */}
      <section className="sx-card sx-enter p-4 sm:p-5" style={{ animationDelay: '60ms' }}>
        <div className="relative rounded-2xl overflow-hidden bg-ink aspect-[4/3] sm:aspect-[16/9]">
          {/* Thẻ video luôn có trong DOM: trước đây chỉ render khi đang quét
              nên lần mở camera thứ hai hay báo "không tìm thấy video". */}
          <video
            ref={videoRef}
            playsInline
            muted
            className={`w-full h-full object-cover ${scanning ? '' : 'invisible'}`}
          />

          {!scanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <span className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-3">
                <FaCamera className="text-white/80" size={22} />
              </span>
              <p className="text-white/85 font-bold">Hướng camera vào mã vạch</p>
              <p className="text-white/50 text-sm mt-1 max-w-xs">
                Giữ mã nằm gọn trong khung và đủ sáng, máy sẽ tự đọc.
              </p>
            </div>
          )}

          {scanning && (
            <>
              {/* Khung ngắm cho biết nên đặt mã vạch ở đâu */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div
                  className="w-4/5 h-2/5 rounded-xl border-2 border-brand-bright"
                  style={{ boxShadow: '0 0 0 9999px rgba(0,0,0,0.35)' }}
                />
              </div>
              <span className="absolute top-3 left-3 sx-chip bg-black/60 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Đang quét…
              </span>
            </>
          )}
        </div>

        <button
          onClick={handleCameraButton}
          className={`sx-btn w-full mt-4 ${
            scanning ? 'bg-red-500 text-white hover:bg-red-600' : 'sx-btn-primary'
          }`}
        >
          {scanning ? <FaTimes /> : <FaCamera />}
          {scanning ? 'Dừng camera' : 'Quét bằng camera'}
        </button>

        {scanning && cameras.length > 1 && (
          <div className="mt-3 flex items-center gap-2">
            <FaSyncAlt className="text-ink-faint shrink-0" size={13} />
            <select
              value={selectedCamera || ''}
              onChange={(e) => handleDoiCamera(e.target.value)}
              className="flex-1 min-w-0 border border-line rounded-lg px-2.5 py-2 text-sm bg-paper text-ink-soft"
              aria-label="Đổi camera"
            >
              {cameras.map((c, i) => (
                <option key={c.deviceId} value={c.deviceId}>
                  {c.label || `Camera ${i + 1}`}
                </option>
              ))}
            </select>
          </div>
        )}

        {cameraError && (
          <p
            role="alert"
            className="mt-3 p-3 rounded-xl bg-sun-wash text-sun text-sm font-medium"
          >
            {cameraError} Bạn vẫn có thể dùng ảnh hoặc nhập mã bên dưới.
          </p>
        )}
      </section>

      {/* ---------- Cách 2 và 3: dùng ảnh ---------- */}
      <section
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 sx-enter"
        style={{ animationDelay: '120ms' }}
      >
        <label className={processingImage ? 'cursor-not-allowed' : 'cursor-pointer'}>
          <div
            className={`sx-card sx-tap h-full p-4 flex items-start gap-3.5 ${
              processingImage ? 'opacity-60' : ''
            }`}
          >
            <span className="w-11 h-11 rounded-xl bg-sky-wash text-sky flex items-center justify-center shrink-0">
              {processingImage ? (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
                  <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              ) : (
                <FaImage size={18} />
              )}
            </span>
            <span className="min-w-0">
              <span className="block font-bold text-ink leading-tight">
                {processingImage ? 'Đang đọc ảnh…' : 'Ảnh có mã vạch'}
              </span>
              <span className="block text-xs text-ink-faint mt-0.5 leading-snug">
                Chọn ảnh chụp sẵn, máy tìm mã vạch trong ảnh.
              </span>
            </span>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={processingImage}
          />
        </label>

        <label className={recognizing ? 'cursor-not-allowed' : 'cursor-pointer'}>
          <div
            className={`sx-card sx-tap h-full p-4 flex items-start gap-3.5 ${
              recognizing ? 'opacity-60' : ''
            }`}
          >
            <span className="w-11 h-11 rounded-xl bg-grape-wash text-grape flex items-center justify-center shrink-0">
              {recognizing ? (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
                  <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              ) : (
                <FaMagic size={18} />
              )}
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-2">
                <span className="font-bold text-ink leading-tight">
                  {recognizing ? 'AI đang nhận diện…' : 'Ảnh sản phẩm'}
                </span>
                {!recognizing && <span className="sx-chip bg-grape-wash text-grape">AI</span>}
              </span>
              <span className="block text-xs text-ink-faint mt-0.5 leading-snug">
                Sản phẩm không có mã vạch? Để AI nhìn bao bì rồi chấm điểm.
              </span>
            </span>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleRecognizeFileChange}
            className="hidden"
            disabled={recognizing}
          />
        </label>
      </section>

      {/* ---------- Cách 4: gõ tay ---------- */}
      <section className="sx-card sx-enter p-4" style={{ animationDelay: '180ms' }}>
        <label
          htmlFor="ma-vach-tay"
          className="flex items-center gap-2 text-sm font-bold text-ink-soft mb-2.5"
        >
          <FaKeyboard className="text-ink-faint" size={14} />
          Hoặc nhập dãy số dưới mã vạch
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" size={13} />
            <input
              id="ma-vach-tay"
              type="text"
              inputMode="numeric"
              placeholder="Ví dụ: 8938507968047"
              className="w-full pl-9 pr-3 py-2.5 border border-line rounded-xl bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:bg-paper"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button onClick={handleSearch} className="sx-btn sx-btn-outline shrink-0 px-5">
            Tìm
          </button>
        </div>
        {searchError && (
          <p role="alert" className="mt-2 text-sm text-red-600 font-medium">
            {searchError}
          </p>
        )}
      </section>

      {/* ---------- Lịch sử quét ---------- */}
      {scanHistory.length > 0 && (
        <section className="sx-card sx-enter p-4 sm:p-5" style={{ animationDelay: '240ms' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-ink flex items-center gap-2">
              <FaHistory className="text-ink-faint" size={14} />
              Quét gần đây
            </h2>
            <button
              onClick={() => setViewMode('history')}
              className="text-sm font-bold text-brand hover:underline"
            >
              Xem tất cả
            </button>
          </div>

          <div className="space-y-2">
            {scanHistory.slice(0, 3).map((item, idx) => {
              const product = getProductFromHistory(item);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleViewHistoryProduct(item)}
                  className="w-full flex items-center gap-3 p-3 bg-canvas rounded-xl hover:bg-brand-wash transition-colors text-left"
                >
                  <span className="w-10 h-10 bg-brand-wash rounded-lg flex items-center justify-center shrink-0">
                    <FaBarcode className="text-brand" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-semibold text-ink truncate text-sm">
                      {product?.name || item.name || 'Sản phẩm'}
                    </span>
                    <span className="block text-xs text-ink-faint">{item.timestamp}</span>
                  </span>
                  {product && (
                    <span className={`font-extrabold text-sm shrink-0 ${getScoreColor(product.greenScore)}`}>
                      {product.greenScore.toFixed(1)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ---------- Mẹo ---------- */}
      <section
        className="sx-card sx-enter p-4 sm:p-5 bg-sky-wash"
        style={{ animationDelay: '300ms' }}
      >
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 rounded-xl bg-white/70 text-sky flex items-center justify-center shrink-0">
            <FaLightbulb size={17} />
          </span>
          <div className="min-w-0">
            <h2 className="font-bold text-sky">Mẹo mua sắm xanh</h2>
            <ul className="text-sm text-sky/90 space-y-1 mt-1.5">
              <li>• Chọn sản phẩm có điểm xanh từ 8.0 trở lên</li>
              <li>• Ưu tiên bao bì có thể tái chế</li>
              <li>• Giảm sản phẩm nhựa dùng một lần</li>
              <li>• Mang túi vải khi đi mua sắm</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );

  const renderResultView = () => {
    if (!scannedProduct) return null;

    return (
      <div className="space-y-6 pb-20">
        <div className="flex items-center mb-4">
          <button
            onClick={() => { setViewMode('scan'); stopScanner(); }}
            className="mr-3 text-ink-soft hover:text-ink"
          >
            <FaArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-ink">Kết quả đánh giá</h1>
          {evaluating && (
            <div className="ml-auto flex items-center gap-2 text-xs text-sky">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
                <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <span>AI đang phân tích...</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="bg-paper rounded-card overflow-hidden">
          <div className={`p-4 ${getScoreBg(scannedProduct.greenScore || 0)}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-lg font-bold text-ink">{scannedProduct.name}</h2>
                {scannedProduct.brand && <p className="text-sm text-ink-soft">{scannedProduct.brand}</p>}
                <div className="flex items-center gap-2 text-xs text-ink-faint mt-1">
                  <FaBarcode />
                  <span>{scannedProduct.barcode}</span>
                </div>
              </div>
              <div className="text-center ml-3">
                <p className="text-xs text-ink-faint">Điểm xanh</p>
                <p className={`text-3xl font-bold ${getScoreColor(scannedProduct.greenScore || 0)}`}>
                  {scannedProduct.greenScore !== null ? scannedProduct.greenScore.toFixed(1) : '?'}
                </p>
                <p className="text-xs text-ink-faint">/ 10</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Category & Packaging */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-canvas rounded-lg">
                <p className="text-xs text-ink-faint">Danh mục</p>
                <p className="font-semibold text-sm text-ink">{scannedProduct.category || '-'}</p>
              </div>
              <div className="text-center p-3 bg-canvas rounded-lg">
                <p className="text-xs text-ink-faint">Bao bì</p>
                <p className="font-semibold text-sm text-ink">{scannedProduct.packaging || '-'}</p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <div className={`flex items-center gap-3 p-3 rounded-lg ${scannedProduct.recyclable ? 'bg-brand-wash' : 'bg-canvas'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${scannedProduct.recyclable ? 'bg-brand-bright' : 'bg-gray-300'}`}>
                  <FaRecycle className="text-white text-sm" />
                </div>
                <span className={`text-sm font-medium ${scannedProduct.recyclable ? 'text-ink' : 'text-ink-soft'}`}>
                  {scannedProduct.recyclable ? 'Có thể tái chế' : 'Không thể tái chế'}
                </span>
              </div>

              <div className={`flex items-center gap-3 p-3 rounded-lg ${scannedProduct.biodegradable ? 'bg-brand-wash' : 'bg-canvas'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${scannedProduct.biodegradable ? 'bg-brand-bright' : 'bg-gray-300'}`}>
                  <FaLeaf className="text-white text-sm" />
                </div>
                <span className={`text-sm font-medium ${scannedProduct.biodegradable ? 'text-ink' : 'text-ink-soft'}`}>
                  {scannedProduct.biodegradable ? 'Phân hủy sinh học' : 'Không phân hủy sinh học'}
                </span>
              </div>

              <div className={`flex items-center gap-3 p-3 rounded-lg ${scannedProduct.plasticFree ? 'bg-brand-wash' : 'bg-canvas'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${scannedProduct.plasticFree ? 'bg-brand-bright' : 'bg-gray-300'}`}>
                  {scannedProduct.plasticFree ? <FaCheckCircle className="text-white text-sm" /> : <FaTimesCircle className="text-white text-sm" />}
                </div>
                <span className={`text-sm font-medium ${scannedProduct.plasticFree ? 'text-ink' : 'text-ink-soft'}`}>
                  {scannedProduct.plasticFree ? 'Không chứa nhựa' : 'Có chứa nhựa'}
                </span>
              </div>
            </div>

            {/* Recommendation */}
            <div className="p-4 bg-sky-wash rounded-xl border border-line">
              <div className="flex items-start gap-2">
                <FaExclamationTriangle className="text-sky mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sky text-sm mb-1">Gợi ý</h3>
                  <p className="text-sm text-sky">{scannedProduct.recommendation}</p>
                </div>
              </div>
            </div>

            {/* AI Analysis */}
            {scannedProduct.analysis && (
              <div className="p-4 bg-brand-wash rounded-lg border border-line">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-brand rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink text-sm mb-1">Phân tích AI</h3>
                    <p className="text-sm text-brand whitespace-pre-wrap">{scannedProduct.analysis}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Thông tin riêng của luồng nhận diện bằng ảnh */}
            {scannedProduct.source === 'image' && (
              <div className="p-3 bg-brand-wash rounded-lg border border-brand/20 space-y-2">
                <p className="text-sm font-semibold text-brand flex items-center gap-2">
                  <FaImage />
                  Nhận diện từ ảnh bằng AI
                  {typeof scannedProduct.confidence === 'number' && (
                    <span className="ml-auto text-xs font-normal text-ink-faint">
                      độ chắc chắn {Math.round(scannedProduct.confidence * 100)}%
                    </span>
                  )}
                </p>

                {scannedProduct.materials?.length > 0 && (
                  <p className="text-sm text-ink-soft">
                    <span className="font-medium">Chất liệu nhìn thấy: </span>
                    {scannedProduct.materials.join(', ')}
                  </p>
                )}

                {scannedProduct.alternatives?.length > 0 && (
                  <div className="text-sm text-ink-soft">
                    <span className="font-medium">Thay thế xanh hơn:</span>
                    <ul className="list-disc list-inside mt-1 space-y-0.5">
                      {scannedProduct.alternatives.map((alt, i) => (
                        <li key={i}>{alt}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Error */}
            {scannedProduct.aiError && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-700 flex items-center gap-2">
                  <FaTimesCircle />
                  Lỗi AI: {scannedProduct.aiError}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Alternative Products */}
        {products.filter(p =>
          p.id !== scannedProduct.id &&
          p.category === scannedProduct.category &&
          (scannedProduct.greenScore === null ? p.greenScore >= 0 : p.greenScore > scannedProduct.greenScore)
        ).length > 0 && (
          <div className="bg-paper p-4 rounded-card">
            <h3 className="font-semibold text-ink-soft mb-3 flex items-center gap-2">
              <FaLeaf className="text-brand" />
              Sản phẩm thay thế tốt hơn
            </h3>
            <div className="space-y-2">
              {products.filter(p =>
                p.id !== scannedProduct.id &&
                p.category === scannedProduct.category &&
                (scannedProduct.greenScore === null ? p.greenScore >= 0 : p.greenScore > scannedProduct.greenScore)
              ).slice(0, 3).map(product => (
                <div key={product.id} className="flex items-center gap-3 p-3 bg-canvas rounded-lg">
                  <div className="w-10 h-10 bg-brand-wash rounded-lg flex items-center justify-center">
                    <FaLeaf className="text-brand" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-ink truncate">{product.name}</h4>
                    <p className="text-xs text-ink-faint">{product.brand}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-bold ${getScoreColor(product.greenScore)}`}>
                    {product.greenScore.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action */}
        <button
          onClick={() => { setViewMode('scan'); stopScanner(); }}
          className="sx-btn sx-btn-primary w-full"
        >
          <FaBarcode />
          Quét sản phẩm khác
        </button>
      </div>
    );
  };

  const renderHistoryView = () => (
    <div className="space-y-6 pb-20">
      <div className="flex items-center mb-4">
        <button
          onClick={() => setViewMode('scan')}
          className="mr-3 text-ink-soft hover:text-ink"
        >
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-ink">Lịch sử quét</h1>
      </div>

      <div className="bg-paper p-4 rounded-card">
        {scanHistory.length > 0 ? (
          <>
            <div className="space-y-2 mb-4">
              {scanHistory.map((item, index) => {
                const product = getProductFromHistory(item);
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-canvas rounded-lg hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleViewHistoryProduct(item)}
                  >
                    <div className="w-10 h-10 bg-brand-wash rounded-lg flex items-center justify-center">
                      <FaBarcode className="text-brand" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-ink truncate">
                        {product?.name || item.name || 'Sản phẩm'}
                      </h3>
                      <p className="text-xs text-ink-faint">
                        {product?.brand} {product && '•'} {item.timestamp}
                      </p>
                    </div>
                    {product && (
                      <div className={`px-2 py-1 rounded text-xs font-bold ${getScoreColor(product.greenScore)}`}>
                        {product.greenScore.toFixed(1)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => {
                if (confirm('Bạn có chắc muốn xóa toàn bộ lịch sử?')) {
                  setScanHistory([]);
                }
              }}
              className="w-full py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
            >
              Xóa toàn bộ lịch sử
            </button>
          </>
        ) : (
          <div className="text-center py-12">
            <FaHistory className="text-gray-300 text-5xl mx-auto mb-4" />
            <p className="text-ink-faint mb-4">Chưa có lịch sử quét</p>
            <button
              onClick={() => setViewMode('scan')}
              className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand"
            >
              Bắt đầu quét
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-24">
      {viewMode === 'result' && renderResultView()}
      {viewMode === 'history' && renderHistoryView()}
      {viewMode === 'scan' && renderScanView()}
    </div>
  );
}
