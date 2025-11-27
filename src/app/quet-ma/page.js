'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  FaInfoCircle,
  FaLightbulb
} from 'react-icons/fa';

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
  const [scannedProduct, setScannedProduct] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);

  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scannerAvailable, setScannerAvailable] = useState(true);
  const codeReaderRef = useRef(null);
  const videoRef = useRef(null);
  const lastScanRef = useRef({ text: null, time: 0 });

  const [evaluating, setEvaluating] = useState(false);
  const [processingImage, setProcessingImage] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) setScanHistory(JSON.parse(raw));
      else setScanHistory([]);
    } catch (e) {
      console.warn('Không thể đọc history', e);
      setScanHistory([]);
    }
    return () => stopScanner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(scanHistory));
    } catch (e) {
      console.warn('Lưu history lỗi', e);
    }
  }, [scanHistory]);

  const getProductByBarcode = (barcode) => PRODUCTS.find(p => p.barcode === barcode);

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

  const onScanResult = async (decodedText) => {
    const now = Date.now();
    if (lastScanRef.current.text === decodedText && now - lastScanRef.current.time < 2000) return;
    lastScanRef.current = { text: decodedText, time: now };

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

  const prepareCameras = async () => {
    try {
      // Yêu cầu quyền truy cập camera
      await navigator.mediaDevices.getUserMedia({ video: true });

      // Lấy danh sách thiết bị
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');

      if (videoDevices && videoDevices.length) {
        setCameras(videoDevices);
        setSelectedCamera(prev => prev || videoDevices[0].deviceId);
        setScannerAvailable(true);
      } else {
        throw new Error('Không tìm thấy camera nào');
      }
    } catch (e) {
      console.warn('Không thể lấy camera', e);
      setScannerAvailable(false);
      alert(`Không thể truy cập camera: ${e.message || 'Vui lòng cấp quyền truy cập camera'}`);
    }
  };

  const startScanner = async () => {
    if (scanning) return;

    try {
      // Lấy danh sách camera
      let availableCameras = cameras;
      if (availableCameras.length === 0) {
        // Lấy camera trực tiếp thay vì dùng state
        await navigator.mediaDevices.getUserMedia({ video: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        availableCameras = devices.filter(device => device.kind === 'videoinput');

        if (availableCameras.length > 0) {
          setCameras(availableCameras);
          if (!selectedCamera) {
            setSelectedCamera(availableCameras[0].deviceId);
          }
        }
      }

      const cameraId = selectedCamera || (availableCameras[0] && availableCameras[0].deviceId);
      if (!cameraId) {
        throw new Error('Không tìm thấy camera nào. Vui lòng kiểm tra quyền truy cập camera.');
      }

      // Set scanning trước để render video element
      setScanning(true);

      // Đợi một chút để DOM được render
      await new Promise(resolve => setTimeout(resolve, 100));

      // Import ZXing library
      const { BrowserMultiFormatReader } = await import('@zxing/browser');

      // Tạo reader instance
      if (!codeReaderRef.current) {
        codeReaderRef.current = new BrowserMultiFormatReader();
      }

      // Lấy video element đã được render bởi React
      const video = videoRef.current;
      if (!video) {
        throw new Error('Video element không tồn tại');
      }

      // Bắt đầu decode
      await codeReaderRef.current.decodeFromVideoDevice(
        cameraId,
        video,
        (result, error) => {
          if (result) {
            onScanResult(result.getText());
          }
          // Không log error vì nó sẽ log liên tục khi không tìm thấy mã
        }
      );

      setScannerAvailable(true);
    } catch (err) {
      console.error('Lỗi khi mở camera:', err);
      setScannerAvailable(false);
      setScanning(false);
      alert(`Không thể mở camera — ${err?.message || String(err)}`);
    }
  };

  const stopScanner = async () => {
    try {
      // Dừng ZXing reader
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }

      // Dọn dẹp video element
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        videoRef.current.srcObject = null;
      }
    } catch (e) {
      console.warn('Lỗi dừng scanner', e);
    } finally {
      // Set scanning = false để React tự xóa video element
      setScanning(false);
    }
  };

  const handleCameraButton = async () => {
    if (scanning) {
      await stopScanner();
    } else {
      await prepareCameras();
      await startScanner();
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim().length >= 6) {
      const t = searchTerm.trim();
      if (scanning) stopScanner();
      onScanResult(t);
      setSearchTerm('');
    } else {
      alert('Nhập ít nhất 6 ký tự mã vạch để tìm.');
    }
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
          if (scanning) await stopScanner();
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
            if (scanning) await stopScanner();
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

    // Nếu không tìm thấy mã nào
    if (!detectionSuccess) {
      alert('Không tìm thấy mã vạch/QR code trong ảnh này.\n\nGợi ý:\n- Đảm bảo ảnh rõ nét và mã dễ nhìn\n- Thử chụp lại với ánh sáng tốt hơn\n- Hoặc sử dụng camera để quét trực tiếp');
    }

    setProcessingImage(false);
    e.target.value = '';
  };

  const getProductFromHistory = (historyItem) => {
    if (historyItem.productId) return PRODUCTS.find(p => p.id === historyItem.productId) || null;
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
    if (score >= 8) return 'text-green-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 8) return 'bg-green-50';
    if (score >= 5) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  // ========== RENDER VIEWS ==========

  const renderScanView = () => (
    <div className="space-y-6 pb-20">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-green-800">Quét mã sản phẩm</h1>
        <p className="text-gray-600 mt-1">Kiểm tra mức độ thân thiện với môi trường</p>
      </div>

      {/* Camera Scanner */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-900">
          <div id="reader" className={`w-full ${scanning ? 'min-h-[280px]' : 'h-48'} flex items-center justify-center relative`}>
            {scanning ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                style={{ minHeight: '280px' }}
              />
            ) : (
              <div className="text-center p-6">
                <FaCamera className="text-gray-400 text-4xl mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Nhấn nút bên dưới để quét</p>
              </div>
            )}
          </div>
        </div>

        {scanning && cameras.length > 1 && (
          <div className="mt-3 flex items-center gap-2">
            <select
              value={selectedCamera || ''}
              onChange={async (e) => {
                await stopScanner();
                setSelectedCamera(e.target.value);
                setTimeout(() => startScanner(), 100);
              }}
              className="flex-1 border rounded px-2 py-1.5 text-sm"
            >
              {cameras.map(c => (
                <option key={c.deviceId} value={c.deviceId}>{c.label || `Camera ${c.deviceId.slice(0, 8)}...`}</option>
              ))}
            </select>
            <button onClick={handleCameraButton} className="px-3 py-1.5 bg-red-500 text-white rounded text-sm">
              <FaTimes />
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mt-4">
          {!scanning ? (
            <button
              onClick={handleCameraButton}
              className="col-span-2 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
            >
              <FaCamera />
              Mở camera quét
            </button>
          ) : (
            <button
              onClick={handleCameraButton}
              className="col-span-2 flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600"
            >
              <FaTimes />
              Dừng camera
            </button>
          )}

          <label className={`col-span-2 ${processingImage ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
            <div className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
              {processingImage ? (
                <>
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
                    <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Đang xử lý ảnh...
                </>
              ) : (
                <>
                  <FaImage />
                  Chọn ảnh từ máy
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={processingImage}
            />
          </label>
        </div>

        {!scannerAvailable && (
          <div className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-sm text-yellow-800">
            <strong>Lưu ý:</strong> Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập hoặc thử chọn ảnh từ máy.
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Nhập mã vạch thủ công..."
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-5 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
          >
            Tìm
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <FaLightbulb className="text-blue-600 text-xl mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">Mẹo mua sắm xanh</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Chọn sản phẩm có điểm xanh cao (từ 8.0 trở lên)</li>
              <li>• Ưu tiên bao bì có thể tái chế</li>
              <li>• Giảm sử dụng sản phẩm nhựa dùng một lần</li>
              <li>• Mang túi vải khi đi mua sắm</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recent History */}
      {scanHistory.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-700 flex items-center gap-2">
              <FaHistory className="text-gray-500" />
              Quét gần đây
            </h2>
            <button
              onClick={() => setViewMode('history')}
              className="text-sm text-green-600 hover:text-green-700"
            >
              Xem tất cả
            </button>
          </div>

          <div className="space-y-2">
            {scanHistory.slice(0, 3).map((item, idx) => {
              const product = getProductFromHistory(item);
              return (
                <div
                  key={idx}
                  onClick={() => handleViewHistoryProduct(item)}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaBarcode className="text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 truncate text-sm">
                      {product?.name || item.name || 'Sản phẩm'}
                    </h3>
                    <p className="text-xs text-gray-500">{item.timestamp}</p>
                  </div>
                  {product && (
                    <div className={`px-2 py-0.5 rounded text-xs font-semibold ${getScoreColor(product.greenScore)}`}>
                      {product.greenScore.toFixed(1)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  const renderResultView = () => {
    if (!scannedProduct) return null;

    return (
      <div className="space-y-6 pb-20">
        <div className="flex items-center mb-4">
          <button
            onClick={() => { setViewMode('scan'); if (scanning) stopScanner(); }}
            className="mr-3 text-gray-600 hover:text-gray-800"
          >
            <FaArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-green-800">Kết quả đánh giá</h1>
          {evaluating && (
            <div className="ml-auto flex items-center gap-2 text-xs text-blue-600">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
                <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <span>AI đang phân tích...</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className={`p-4 ${getScoreBg(scannedProduct.greenScore || 0)}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-800">{scannedProduct.name}</h2>
                {scannedProduct.brand && <p className="text-sm text-gray-600">{scannedProduct.brand}</p>}
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <FaBarcode />
                  <span>{scannedProduct.barcode}</span>
                </div>
              </div>
              <div className="text-center ml-3">
                <p className="text-xs text-gray-500">Điểm xanh</p>
                <p className={`text-3xl font-bold ${getScoreColor(scannedProduct.greenScore || 0)}`}>
                  {scannedProduct.greenScore !== null ? scannedProduct.greenScore.toFixed(1) : '?'}
                </p>
                <p className="text-xs text-gray-500">/ 10</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Category & Packaging */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Danh mục</p>
                <p className="font-semibold text-sm text-gray-800">{scannedProduct.category || '-'}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Bao bì</p>
                <p className="font-semibold text-sm text-gray-800">{scannedProduct.packaging || '-'}</p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <div className={`flex items-center gap-3 p-3 rounded-lg ${scannedProduct.recyclable ? 'bg-green-50' : 'bg-gray-50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${scannedProduct.recyclable ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <FaRecycle className="text-white text-sm" />
                </div>
                <span className={`text-sm font-medium ${scannedProduct.recyclable ? 'text-green-800' : 'text-gray-600'}`}>
                  {scannedProduct.recyclable ? 'Có thể tái chế' : 'Không thể tái chế'}
                </span>
              </div>

              <div className={`flex items-center gap-3 p-3 rounded-lg ${scannedProduct.biodegradable ? 'bg-green-50' : 'bg-gray-50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${scannedProduct.biodegradable ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <FaLeaf className="text-white text-sm" />
                </div>
                <span className={`text-sm font-medium ${scannedProduct.biodegradable ? 'text-green-800' : 'text-gray-600'}`}>
                  {scannedProduct.biodegradable ? 'Phân hủy sinh học' : 'Không phân hủy sinh học'}
                </span>
              </div>

              <div className={`flex items-center gap-3 p-3 rounded-lg ${scannedProduct.plasticFree ? 'bg-green-50' : 'bg-gray-50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${scannedProduct.plasticFree ? 'bg-green-500' : 'bg-gray-300'}`}>
                  {scannedProduct.plasticFree ? <FaCheckCircle className="text-white text-sm" /> : <FaTimesCircle className="text-white text-sm" />}
                </div>
                <span className={`text-sm font-medium ${scannedProduct.plasticFree ? 'text-green-800' : 'text-gray-600'}`}>
                  {scannedProduct.plasticFree ? 'Không chứa nhựa' : 'Có chứa nhựa'}
                </span>
              </div>
            </div>

            {/* Recommendation */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-start gap-2">
                <FaExclamationTriangle className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-800 text-sm mb-1">Gợi ý</h3>
                  <p className="text-sm text-blue-700">{scannedProduct.recommendation}</p>
                </div>
              </div>
            </div>

            {/* AI Analysis */}
            {scannedProduct.analysis && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-800 text-sm mb-1">Phân tích AI</h3>
                    <p className="text-sm text-green-700 whitespace-pre-wrap">{scannedProduct.analysis}</p>
                  </div>
                </div>
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
        {PRODUCTS.filter(p =>
          p.id !== scannedProduct.id &&
          p.category === scannedProduct.category &&
          (scannedProduct.greenScore === null ? p.greenScore >= 0 : p.greenScore > scannedProduct.greenScore)
        ).length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaLeaf className="text-green-600" />
              Sản phẩm thay thế tốt hơn
            </h3>
            <div className="space-y-2">
              {PRODUCTS.filter(p =>
                p.id !== scannedProduct.id &&
                p.category === scannedProduct.category &&
                (scannedProduct.greenScore === null ? p.greenScore >= 0 : p.greenScore > scannedProduct.greenScore)
              ).slice(0, 3).map(product => (
                <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaLeaf className="text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-800 truncate">{product.name}</h4>
                    <p className="text-xs text-gray-500">{product.brand}</p>
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
          onClick={() => { setViewMode('scan'); if (scanning) stopScanner(); }}
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
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
          className="mr-3 text-gray-600 hover:text-gray-800"
        >
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-green-800">Lịch sử quét</h1>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        {scanHistory.length > 0 ? (
          <>
            <div className="space-y-2 mb-4">
              {scanHistory.map((item, index) => {
                const product = getProductFromHistory(item);
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleViewHistoryProduct(item)}
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <FaBarcode className="text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-gray-800 truncate">
                        {product?.name || item.name || 'Sản phẩm'}
                      </h3>
                      <p className="text-xs text-gray-500">
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
            <p className="text-gray-500 mb-4">Chưa có lịch sử quét</p>
            <button
              onClick={() => setViewMode('scan')}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Bắt đầu quét
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 space-y-6">
      {viewMode === 'result' && renderResultView()}
      {viewMode === 'history' && renderHistoryView()}
      {viewMode === 'scan' && renderScanView()}
    </div>
  );
}
