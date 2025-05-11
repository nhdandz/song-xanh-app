'use client';

import { useState } from 'react';
import { 
  FaBarcode, 
  FaCamera, 
  FaLeaf, 
  FaTrash,
  FaRecycle,
  FaExclamationTriangle,
  FaShoppingCart,
  FaHistory,
  FaSearch,
  FaArrowLeft
} from 'react-icons/fa';

// Dữ liệu mẫu cho sản phẩm
const PRODUCTS = [
  {
    id: 1,
    barcode: '8938507968047',
    name: 'Nước khoáng Lavie 500ml',
    image: '/images/product1.jpg',
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
    image: '/images/product2.jpg',
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
    image: '/images/product3.jpg',
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

// Lịch sử quét gần đây
const SCAN_HISTORY = [
  {
    productId: 1,
    timestamp: '09/05/2025 09:15',
  },
  {
    productId: 2,
    timestamp: '08/05/2025 14:22',
  },
];

export default function BarcodeScan() {
  const [viewMode, setViewMode] = useState('scan'); // 'scan', 'result', 'history', 'search'
  const [searchTerm, setSearchTerm] = useState('');
  const [scannedProduct, setScannedProduct] = useState(null);
  const [scanHistory, setScanHistory] = useState(SCAN_HISTORY);
  
  // Mô phỏng quét mã vạch
  const simulateScan = (barcode) => {
    const product = PRODUCTS.find(p => p.barcode === barcode);
    
    if (product) {
      setScannedProduct(product);
      setViewMode('result');
      
      // Thêm vào lịch sử
      const now = new Date();
      const timestamp = now.toLocaleDateString('vi-VN') + ' ' + now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      
      setScanHistory([
        { productId: product.id, timestamp },
        ...scanHistory.filter((_, index) => index < 9) // Giữ tối đa 10 lịch sử
      ]);
    }
  };
  
  // Xử lý tìm kiếm sản phẩm
  const handleSearch = () => {
    if (searchTerm.length >= 8) {
      simulateScan(searchTerm);
    }
  };
  
  // Mô phỏng chụp ảnh mã vạch
  const handleCameraCapture = () => {
    // Mô phỏng quét ngẫu nhiên một sản phẩm
    const randomProduct = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    simulateScan(randomProduct.barcode);
  };
  
  // Lấy sản phẩm từ lịch sử
  const getProductFromHistory = (historyItem) => {
    return PRODUCTS.find(p => p.id === historyItem.productId);
  };
  
  // Xử lý xem sản phẩm từ lịch sử
  const handleViewHistoryProduct = (historyItem) => {
    const product = getProductFromHistory(historyItem);
    if (product) {
      setScannedProduct(product);
      setViewMode('result');
    }
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
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <FaBarcode className="text-green-600 text-3xl" />
          </div>
          
          <p className="text-center text-gray-600 mb-4">
            Quét mã vạch sản phẩm để xem thông tin và đánh giá mức độ thân thiện với môi trường.
          </p>
          
          <button
            onClick={handleCameraCapture}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center"
          >
            <FaCamera className="mr-2" />
            Mở máy ảnh để quét
          </button>
        </div>
      </div>
      
      <div className="relative">
        <input
          type="text"
          placeholder="Nhập mã vạch sản phẩm..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <div className="absolute left-3 top-2.5 text-gray-400">
          <FaSearch />
        </div>
        <button
          onClick={handleSearch}
          className="absolute right-2 top-2 text-green-600"
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
            {scanHistory.slice(0, 2).map((item, index) => {
              const product = getProductFromHistory(item);
              return (
                <div 
                  key={index}
                  className="flex items-center p-2 bg-white rounded-lg shadow-sm border border-gray-200"
                  onClick={() => handleViewHistoryProduct(item)}
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                    <FaBarcode className="text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{product.name}</h3>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">{item.timestamp}</span>
                      <div className={`px-2 py-0.5 rounded-full ${getScoreColorClass(product.greenScore)}`}>
                        {product.greenScore.toFixed(1)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">Mẹo mua sắm xanh</h3>
        <ul className="text-sm text-blue-700 space-y-1 pl-5 list-disc">
          <li>Chọn sản phẩm có điểm xanh cao</li>
          <li>Ưu tiên bao bì có thể tái chế</li>
          <li>Giảm sử dụng sản phẩm nhựa dùng một lần</li>
          <li>Mang túi riêng khi đi mua sắm</li>
        </ul>
      </div>
    </div>
  );
  
  // Helper - lấy màu dựa vào điểm số
  const getScoreColorClass = (score) => {
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  
  // Render màn hình kết quả quét
  const renderResultView = () => {
    if (!scannedProduct) return null;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => setViewMode('scan')}
            className="mr-3 text-gray-600"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-xl font-bold text-green-800">
            Kết quả đánh giá
          </h1>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 mr-3 bg-gray-100 rounded-md flex items-center justify-center">
              <FaLeaf className="text-green-500 text-2xl" />
            </div>
            
            <div className="flex-1">
              <h2 className="font-bold text-gray-800">{scannedProduct.name}</h2>
              <p className="text-sm text-gray-500">{scannedProduct.brand}</p>
              <div className="flex items-center mt-1">
                <FaBarcode className="text-gray-400 mr-1" />
                <span className="text-xs text-gray-500">{scannedProduct.barcode}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">Điểm xanh</p>
              <div className={`text-xl font-bold ${
                scannedProduct.greenScore >= 8 
                  ? 'text-green-600' 
                  : scannedProduct.greenScore >= 5 
                    ? 'text-yellow-600' 
                    : 'text-red-600'
              }`}>
                {scannedProduct.greenScore.toFixed(1)}/10
              </div>
            </div>
            
            <div className="h-10 w-px bg-gray-300 mx-2"></div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">Loại</p>
              <p className="font-medium text-gray-700">{scannedProduct.category}</p>
            </div>
            
            <div className="h-10 w-px bg-gray-300 mx-2"></div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">Bao bì</p>
              <p className="font-medium text-gray-700">{scannedProduct.packaging}</p>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                scannedProduct.recyclable ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                <FaRecycle className="text-xs" />
              </div>
              <span className={scannedProduct.recyclable ? 'text-gray-800' : 'text-gray-500'}>
                {scannedProduct.recyclable ? 'Có thể tái chế' : 'Không thể tái chế'}
              </span>
            </div>
            
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                scannedProduct.biodegradable ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                <FaLeaf className="text-xs" />
              </div>
              <span className={scannedProduct.biodegradable ? 'text-gray-800' : 'text-gray-500'}>
                {scannedProduct.biodegradable ? 'Phân hủy sinh học' : 'Không phân hủy sinh học'}
              </span>
            </div>
            
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                scannedProduct.plasticFree ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                <FaTrash className="text-xs" />
              </div>
              <span className={scannedProduct.plasticFree ? 'text-gray-800' : 'text-gray-500'}>
                {scannedProduct.plasticFree ? 'Không nhựa' : 'Có chứa nhựa'}
              </span>
            </div>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-start">
              <FaExclamationTriangle className="text-blue-800 mt-0.5 mr-2 shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-1">Gợi ý</h3>
                <p className="text-sm text-blue-700">{scannedProduct.recommendation}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700">Sản phẩm thay thế tốt hơn</h3>
          
          <div className="grid grid-cols-2 gap-3">
            {PRODUCTS.filter(p => 
              p.id !== scannedProduct.id && 
              p.category === scannedProduct.category &&
              p.greenScore > scannedProduct.greenScore
            ).slice(0, 2).map(product => (
              <div key={product.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                <div className="h-12 bg-gray-100 rounded-md flex items-center justify-center mb-2">
                  <FaLeaf className="text-green-500" />
                </div>
                <h4 className="font-medium text-sm text-gray-800 line-clamp-1">{product.name}</h4>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">{product.brand}</span>
                  <div className="px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {product.greenScore.toFixed(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
      <div className="flex items-center mb-6">
        <button
          onClick={() => setViewMode('scan')}
          className="mr-3 text-gray-600"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-xl font-bold text-green-800">
          Lịch sử quét
        </h1>
      </div>
      
      <div className="space-y-3">
        {scanHistory.length > 0 ? (
          scanHistory.map((item, index) => {
            const product = getProductFromHistory(item);
            return (
              <div 
                key={index}
                className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-gray-200"
                onClick={() => handleViewHistoryProduct(item)}
              >
                <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                  <FaBarcode className="text-gray-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{product.name}</h3>
                  <p className="text-xs text-gray-500">{product.brand} • {product.category}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">{item.timestamp}</span>
                    <div className={`px-2 py-0.5 rounded-full text-xs ${getScoreColorClass(product.greenScore)}`}>
                      Điểm: {product.greenScore.toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Bạn chưa quét sản phẩm nào.</p>
          </div>
        )}
      </div>
      
      {scanHistory.length > 0 && (
        <button
          onClick={() => setScanHistory([])}
          className="w-full py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
        >
          Xóa lịch sử
        </button>
      )}
    </div>
  );
  
  // Render theo chế độ xem
  const renderContent = () => {
    switch (viewMode) {
      case 'result':
        return renderResultView();
      case 'history':
        return renderHistoryView();
      default:
        return renderScanView();
    }
  };
  
  return (
    <div className="pb-16">
      {renderContent()}
    </div>
  );
}