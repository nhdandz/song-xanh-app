'use client';

import { useState, useEffect, useContext, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
  FaBarcode,
  FaCamera,
  FaLeaf,
  FaTrash,
  FaRecycle,
  FaExclamationTriangle,
  FaHistory,
  FaSearch,
  FaArrowLeft,
  FaTimes,
  FaWater,
  FaSmog
} from 'react-icons/fa';
import { AppContext } from '@/context/AppContext';

// Dữ liệu mẫu cho sản phẩm (fallback nếu không tìm thấy trong database)
const SAMPLE_PRODUCTS = [
  {
    barcode: '8938507968047',
    name: 'Nước khoáng Lavie 500ml',
    brand: 'Lavie',
    category: 'Đồ uống',
    packaging: 'Chai nhựa PET',
    recyclable: true,
    biodegradable: false,
    plasticFree: false,
    carbonFootprint: 0.15, // kg CO2
    waterUsage: 2.5, // lít
    recommendation: 'Tái chế vỏ chai sau khi sử dụng. Nên chuyển sang sử dụng bình nước cá nhân để giảm rác thải nhựa.',
  },
  {
    barcode: '8934563138165',
    name: 'Ống hút giấy ECO 100 cái',
    brand: 'ECO',
    category: 'Đồ dùng',
    packaging: 'Hộp giấy tái chế',
    recyclable: true,
    biodegradable: true,
    plasticFree: true,
    carbonFootprint: 0.05,
    waterUsage: 0.8,
    recommendation: 'Sản phẩm thân thiện với môi trường, thay thế hoàn hảo cho ống hút nhựa.',
  },
  {
    barcode: '8938506547828',
    name: 'Túi ni lông đen 1kg',
    brand: 'Nhựa Hoàng Long',
    category: 'Đồ dùng',
    packaging: 'Túi nhựa PE',
    recyclable: false,
    biodegradable: false,
    plasticFree: false,
    carbonFootprint: 6.5,
    waterUsage: 1.2,
    recommendation: 'Sản phẩm không thân thiện với môi trường. Nên thay thế bằng túi vải, túi giấy hoặc túi sinh học.',
  },
  {
    barcode: '8936036021578',
    name: 'Bình nước thủy tinh 1L',
    brand: 'Lock&Lock',
    category: 'Đồ dùng',
    packaging: 'Hộp giấy',
    recyclable: true,
    biodegradable: false,
    plasticFree: true,
    carbonFootprint: 0.8,
    waterUsage: 3.0,
    recommendation: 'Sản phẩm bền vững, có thể sử dụng lâu dài. Thủy tinh là vật liệu an toàn và tái chế được hoàn toàn.',
  },
  {
    barcode: '8936099460019',
    name: 'Túi vải canvas tái chế',
    brand: 'EcoLife',
    category: 'Đồ dùng',
    packaging: 'Không bao bì',
    recyclable: true,
    biodegradable: true,
    plasticFree: true,
    carbonFootprint: 0.3,
    waterUsage: 5.0,
    recommendation: 'Sản phẩm tuyệt vời cho môi trường! Có thể sử dụng hàng ngàn lần, giảm đáng kể rác thải nhựa.',
  },
];

export default function BarcodeScan() {
  const { user } = useContext(AppContext);
  const [viewMode, setViewMode] = useState('scan'); // 'scan', 'result', 'history', 'camera'
  const [searchTerm, setSearchTerm] = useState('');
  const [scannedProduct, setScannedProduct] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scannerActive, setScannerActive] = useState(false);
  const scannerRef = useRef(null);

  // Tải lịch sử quét khi component mount
  useEffect(() => {
    if (user?.id) {
      loadScanHistory();
    }
  }, [user]);

  // Cleanup scanner khi unmount hoặc chuyển view
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error(err));
      }
    };
  }, []);

  // Tải lịch sử quét từ API
  const loadScanHistory = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/scan-history?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setScanHistory(data);
      }
    } catch (error) {
      console.error('Error loading scan history:', error);
    }
  };

  // Tính điểm xanh
  const calculateGreenScore = (product) => {
    let score = 5; // Điểm cơ bản

    // Tái chế (+2 điểm)
    if (product.recyclable) score += 2;

    // Phân hủy sinh học (+2.5 điểm)
    if (product.biodegradable) score += 2.5;

    // Không nhựa (+1.5 điểm)
    if (product.plasticFree) score += 1.5;

    // Bao bì thân thiện (+1 điểm)
    if (product.packaging && (
      product.packaging.toLowerCase().includes('giấy') ||
      product.packaging.toLowerCase().includes('tre') ||
      product.packaging.toLowerCase().includes('gỗ') ||
      product.packaging.toLowerCase().includes('thủy tinh')
    )) {
      score += 1;
    }

    // Giảm điểm dựa trên carbon footprint
    if (product.carbonFootprint > 5) score -= 2;
    else if (product.carbonFootprint > 2) score -= 1;
    else if (product.carbonFootprint > 1) score -= 0.5;

    // Giảm điểm dựa trên water usage
    if (product.waterUsage > 10) score -= 1.5;
    else if (product.waterUsage > 5) score -= 0.5;

    return Math.max(0, Math.min(10, score));
  };

  // Tìm hoặc tạo sản phẩm
  const findOrCreateProduct = async (barcode) => {
    setLoading(true);
    setError(null);

    try {
      // Tìm trong database
      let response = await fetch(`/api/products?barcode=${barcode}`);

      if (response.ok) {
        const product = await response.json();
        return product;
      }

      // Nếu không tìm thấy, tìm trong dữ liệu mẫu
      const sampleProduct = SAMPLE_PRODUCTS.find(p => p.barcode === barcode);

      if (sampleProduct) {
        // Tính điểm xanh
        const greenScore = calculateGreenScore(sampleProduct);

        // Tạo sản phẩm mới trong database
        response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...sampleProduct,
            greenScore
          }),
        });

        if (response.ok) {
          const newProduct = await response.json();
          return newProduct;
        }
      }

      // Không tìm thấy
      setError('Không tìm thấy thông tin sản phẩm. Vui lòng thử lại với mã vạch khác.');
      return null;
    } catch (err) {
      console.error('Error finding/creating product:', err);
      setError('Đã xảy ra lỗi khi tìm kiếm sản phẩm.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Lưu lịch sử quét
  const saveScanHistory = async (productId) => {
    if (!user?.id || !productId) return;

    try {
      await fetch('/api/scan-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          productId
        }),
      });

      // Tải lại lịch sử
      loadScanHistory();
    } catch (error) {
      console.error('Error saving scan history:', error);
    }
  };

  // Xử lý quét mã vạch
  const handleScan = async (barcode) => {
    const product = await findOrCreateProduct(barcode);

    if (product) {
      setScannedProduct(product);
      setViewMode('result');

      // Lưu lịch sử quét
      await saveScanHistory(product.id);

      // Dừng scanner nếu đang chạy
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error(err));
        setScannerActive(false);
      }
    }
  };

  // Xử lý tìm kiếm
  const handleSearch = () => {
    if (searchTerm.length >= 8) {
      handleScan(searchTerm);
      setSearchTerm('');
    } else {
      setError('Mã vạch phải có ít nhất 8 ký tự.');
    }
  };

  // Khởi tạo camera scanner
  const initializeScanner = () => {
    setViewMode('camera');
    setScannerActive(true);
    setError(null);

    setTimeout(() => {
      const scanner = new Html5QrcodeScanner(
        'reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          supportedScanTypes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
        },
        false
      );

      scanner.render(
        (decodedText) => {
          handleScan(decodedText);
        },
        (errorMessage) => {
          // Không cần log lỗi quét liên tục
        }
      );

      scannerRef.current = scanner;
    }, 100);
  };

  // Đóng camera
  const closeCamera = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(err => console.error(err));
      scannerRef.current = null;
    }
    setScannerActive(false);
    setViewMode('scan');
  };

  // Xóa lịch sử
  const clearHistory = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/scan-history?userId=${user.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setScanHistory([]);
      }
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  // Helper - lấy màu dựa vào điểm số
  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreColorClass = (score) => {
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getScoreBgColor = (score) => {
    if (score >= 8) return 'bg-green-50';
    if (score >= 5) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  const getScoreLabel = (score) => {
    if (score >= 8) return 'Rất tốt';
    if (score >= 6) return 'Tốt';
    if (score >= 4) return 'Trung bình';
    return 'Kém';
  };

  // Render màn hình quét
  const renderScanView = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">
          Quét mã sản phẩm
        </h1>
        <p className="text-gray-600 mt-1">
          Kiểm tra mức độ thân thiện với môi trường
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <FaBarcode className="text-green-600 text-3xl" />
          </div>

          <p className="text-center text-gray-600 mb-4">
            Quét mã vạch sản phẩm để xem đánh giá môi trường và gợi ý thay thế xanh hơn.
          </p>

          <button
            onClick={initializeScanner}
            disabled={loading}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center disabled:opacity-50"
          >
            <FaCamera className="mr-2" />
            {loading ? 'Đang xử lý...' : 'Mở máy ảnh để quét'}
          </button>
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Hoặc nhập mã vạch sản phẩm..."
          className="w-full pl-10 pr-16 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <div className="absolute left-3 top-2.5 text-gray-400">
          <FaSearch />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="absolute right-2 top-2 text-green-600 font-medium disabled:opacity-50"
        >
          Tìm
        </button>
      </div>

      {scanHistory.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-gray-700 flex items-center">
              <FaHistory className="mr-2 text-gray-500" />
              Quét gần đây
            </h2>
            <button
              onClick={() => setViewMode('history')}
              className="text-sm text-green-600"
            >
              Xem tất cả
            </button>
          </div>

          <div className="space-y-2">
            {scanHistory.slice(0, 3).map((item, index) => (
              <div
                key={index}
                className="flex items-center p-2 bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setScannedProduct(item.product);
                  setViewMode('result');
                }}
              >
                <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                  <FaBarcode className="text-gray-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 text-sm">{item.product.name}</h3>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">
                      {new Date(item.scannedAt).toLocaleDateString('vi-VN')}
                    </span>
                    <div className={`px-2 py-0.5 rounded-full ${getScoreColorClass(item.product.greenScore)}`}>
                      {item.product.greenScore.toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">💡 Mẹo mua sắm xanh</h3>
        <ul className="text-sm text-blue-700 space-y-1 pl-5 list-disc">
          <li>Chọn sản phẩm có điểm xanh cao (≥ 7/10)</li>
          <li>Ưu tiên bao bì có thể tái chế</li>
          <li>Giảm sử dụng sản phẩm nhựa dùng một lần</li>
          <li>Mang túi riêng khi đi mua sắm</li>
          <li>Chú ý lượng phát thải CO2 và tiêu thụ nước</li>
        </ul>
      </div>
    </div>
  );

  // Render màn hình camera
  const renderCameraView = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-green-800">
          Quét mã vạch
        </h1>
        <button
          onClick={closeCamera}
          className="text-gray-600 hover:text-gray-800"
        >
          <FaTimes className="text-2xl" />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div id="reader" className="rounded-lg overflow-hidden"></div>

      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-700">
          Đặt mã vạch trong khung hình để quét. Đảm bảo ánh sáng đủ và camera ổn định.
        </p>
      </div>
    </div>
  );

  // Render màn hình kết quả quét
  const renderResultView = () => {
    if (!scannedProduct) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => setViewMode('scan')}
            className="mr-3 text-gray-600 hover:text-gray-800"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-xl font-bold text-green-800">
            Kết quả đánh giá
          </h1>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-start mb-4">
            <div className="w-16 h-16 mr-3 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
              <FaLeaf className="text-green-500 text-2xl" />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-gray-800">{scannedProduct.name}</h2>
              <p className="text-sm text-gray-500">{scannedProduct.brand}</p>
              <div className="flex items-center mt-1">
                <FaBarcode className="text-gray-400 mr-1 flex-shrink-0" />
                <span className="text-xs text-gray-500 truncate">{scannedProduct.barcode}</span>
              </div>
            </div>
          </div>

          <div className={`p-4 ${getScoreBgColor(scannedProduct.greenScore)} rounded-lg mb-4`}>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Điểm môi trường</p>
              <div className={`text-4xl font-bold ${getScoreColor(scannedProduct.greenScore)}`}>
                {scannedProduct.greenScore.toFixed(1)}<span className="text-2xl">/10</span>
              </div>
              <p className={`text-sm font-medium mt-1 ${getScoreColor(scannedProduct.greenScore)}`}>
                {getScoreLabel(scannedProduct.greenScore)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Loại</p>
              <p className="font-medium text-gray-700 text-sm">{scannedProduct.category}</p>
            </div>

            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Bao bì</p>
              <p className="font-medium text-gray-700 text-sm">{scannedProduct.packaging}</p>
            </div>

            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <FaSmog className="text-gray-500 text-xs mr-1" />
                <p className="text-xs text-gray-500">Phát thải CO2</p>
              </div>
              <p className="font-medium text-gray-700 text-sm">{scannedProduct.carbonFootprint} kg</p>
            </div>

            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <FaWater className="text-gray-500 text-xs mr-1" />
                <p className="text-xs text-gray-500">Tiêu thụ nước</p>
              </div>
              <p className="font-medium text-gray-700 text-sm">{scannedProduct.waterUsage} lít</p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <h3 className="font-semibold text-gray-700 text-sm">Đặc tính môi trường</h3>

            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                scannedProduct.recyclable ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                <FaRecycle className="text-xs" />
              </div>
              <span className={scannedProduct.recyclable ? 'text-gray-800 text-sm' : 'text-gray-500 text-sm'}>
                {scannedProduct.recyclable ? 'Có thể tái chế' : 'Không thể tái chế'}
              </span>
            </div>

            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                scannedProduct.biodegradable ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                <FaLeaf className="text-xs" />
              </div>
              <span className={scannedProduct.biodegradable ? 'text-gray-800 text-sm' : 'text-gray-500 text-sm'}>
                {scannedProduct.biodegradable ? 'Phân hủy sinh học' : 'Không phân hủy sinh học'}
              </span>
            </div>

            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                scannedProduct.plasticFree ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                <FaTrash className="text-xs" />
              </div>
              <span className={scannedProduct.plasticFree ? 'text-gray-800 text-sm' : 'text-gray-500 text-sm'}>
                {scannedProduct.plasticFree ? 'Không chứa nhựa' : 'Có chứa nhựa'}
              </span>
            </div>
          </div>

          {scannedProduct.recommendation && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-start">
                <FaExclamationTriangle className="text-blue-800 mt-0.5 mr-2 shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-800 mb-1 text-sm">Gợi ý</h3>
                  <p className="text-sm text-blue-700">{scannedProduct.recommendation}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setViewMode('scan')}
          className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center"
        >
          <FaBarcode className="mr-2" />
          Quét sản phẩm khác
        </button>
      </div>
    );
  };

  // Render lịch sử quét
  const renderHistoryView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => setViewMode('scan')}
            className="mr-3 text-gray-600 hover:text-gray-800"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-xl font-bold text-green-800">
            Lịch sử quét
          </h1>
        </div>
        {scanHistory.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      <div className="space-y-3">
        {scanHistory.length > 0 ? (
          scanHistory.map((item, index) => (
            <div
              key={index}
              className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50"
              onClick={() => {
                setScannedProduct(item.product);
                setViewMode('result');
              }}
            >
              <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center mr-3 flex-shrink-0">
                <FaBarcode className="text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800">{item.product.name}</h3>
                <p className="text-xs text-gray-500">{item.product.brand} • {item.product.category}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">
                    {new Date(item.scannedAt).toLocaleDateString('vi-VN')} {new Date(item.scannedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getScoreColorClass(item.product.greenScore)}`}>
                    {item.product.greenScore.toFixed(1)}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FaHistory className="text-gray-400 text-2xl" />
            </div>
            <p className="text-gray-500">Bạn chưa quét sản phẩm nào.</p>
            <button
              onClick={() => setViewMode('scan')}
              className="mt-4 text-green-600 font-medium"
            >
              Bắt đầu quét ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Render theo chế độ xem
  const renderContent = () => {
    switch (viewMode) {
      case 'camera':
        return renderCameraView();
      case 'result':
        return renderResultView();
      case 'history':
        return renderHistoryView();
      default:
        return renderScanView();
    }
  };

  return (
    <div className="pb-16 px-4 max-w-2xl mx-auto">
      {renderContent()}
    </div>
  );
}
