// 'use client';

// import { useState } from 'react';
// import { 
//   FaBarcode, 
//   FaCamera, 
//   FaLeaf, 
//   FaTrash,
//   FaRecycle,
//   FaExclamationTriangle,
//   FaShoppingCart,
//   FaHistory,
//   FaSearch,
//   FaArrowLeft
// } from 'react-icons/fa';

// // Dữ liệu mẫu cho sản phẩm
// const PRODUCTS = [
//   {
//     id: 1,
//     barcode: '8938507968047',
//     name: 'Nước khoáng Lavie 500ml',
//     image: '/images/product1.jpg',
//     brand: 'Lavie',
//     category: 'Đồ uống',
//     packaging: 'Chai nhựa',
//     greenScore: 6.5,
//     recyclable: true,
//     biodegradable: false,
//     plasticFree: false,
//     recommendation: 'Tái chế vỏ chai sau khi sử dụng. Hoặc thay thế bằng bình nước cá nhân.',
//   },
//   {
//     id: 2,
//     barcode: '8934563138165',
//     name: 'Ống hút giấy ECO 100 cái',
//     image: '/images/product2.jpg',
//     brand: 'ECO',
//     category: 'Đồ dùng',
//     packaging: 'Hộp giấy',
//     greenScore: 8.7,
//     recyclable: true,
//     biodegradable: true,
//     plasticFree: true,
//     recommendation: 'Sản phẩm thân thiện với môi trường, thay thế tốt cho ống hút nhựa.',
//   },
//   {
//     id: 3,
//     barcode: '8938506547828',
//     name: 'Túi ni lông đen 1kg',
//     image: '/images/product3.jpg',
//     brand: 'Nhựa Hoàng Long',
//     category: 'Đồ dùng',
//     packaging: 'Túi nhựa',
//     greenScore: 2.1,
//     recyclable: false,
//     biodegradable: false,
//     plasticFree: false,
//     recommendation: 'Nên thay thế bằng túi vải hoặc túi giấy để giảm rác thải nhựa.',
//   },
// ];

// // Lịch sử quét gần đây
// const SCAN_HISTORY = [
//   {
//     productId: 1,
//     timestamp: '09/05/2025 09:15',
//   },
//   {
//     productId: 2,
//     timestamp: '08/05/2025 14:22',
//   },
// ];

// export default function BarcodeScan() {
//   const [viewMode, setViewMode] = useState('scan'); // 'scan', 'result', 'history', 'search'
//   const [searchTerm, setSearchTerm] = useState('');
//   const [scannedProduct, setScannedProduct] = useState(null);
//   const [scanHistory, setScanHistory] = useState(SCAN_HISTORY);
  
//   // Mô phỏng quét mã vạch
//   const simulateScan = (barcode) => {
//     const product = PRODUCTS.find(p => p.barcode === barcode);
    
//     if (product) {
//       setScannedProduct(product);
//       setViewMode('result');
      
//       // Thêm vào lịch sử
//       const now = new Date();
//       const timestamp = now.toLocaleDateString('vi-VN') + ' ' + now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      
//       setScanHistory([
//         { productId: product.id, timestamp },
//         ...scanHistory.filter((_, index) => index < 9) // Giữ tối đa 10 lịch sử
//       ]);
//     }
//   };
  
//   // Xử lý tìm kiếm sản phẩm
//   const handleSearch = () => {
//     if (searchTerm.length >= 8) {
//       simulateScan(searchTerm);
//     }
//   };
  
//   // Mô phỏng chụp ảnh mã vạch
//   const handleCameraCapture = () => {
//     // Mô phỏng quét ngẫu nhiên một sản phẩm
//     const randomProduct = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
//     simulateScan(randomProduct.barcode);
//   };
  
//   // Lấy sản phẩm từ lịch sử
//   const getProductFromHistory = (historyItem) => {
//     return PRODUCTS.find(p => p.id === historyItem.productId);
//   };
  
//   // Xử lý xem sản phẩm từ lịch sử
//   const handleViewHistoryProduct = (historyItem) => {
//     const product = getProductFromHistory(historyItem);
//     if (product) {
//       setScannedProduct(product);
//       setViewMode('result');
//     }
//   };
  
//   // Render màn hình quét
//   const renderScanView = () => (
//     <div className="space-y-6">
//       <div className="text-center mb-6">
//         <h1 className="text-2xl font-bold text-green-800">
//           Quét mã sản phẩm
//         </h1>
//         <p className="text-gray-600 mt-1">
//           Kiểm tra mức độ thân thiện với môi trường
//         </p>
//       </div>
      
//       <div className="bg-white p-4 rounded-lg shadow-md">
//         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
//           <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
//             <FaBarcode className="text-green-600 text-3xl" />
//           </div>
          
//           <p className="text-center text-gray-600 mb-4">
//             Quét mã vạch sản phẩm để xem thông tin và đánh giá mức độ thân thiện với môi trường.
//           </p>
          
//           <button
//             onClick={handleCameraCapture}
//             className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center"
//           >
//             <FaCamera className="mr-2" />
//             Mở máy ảnh để quét
//           </button>
//         </div>
//       </div>
      
//       <div className="relative">
//         <input
//           type="text"
//           placeholder="Nhập mã vạch sản phẩm..."
//           className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//         />
//         <div className="absolute left-3 top-2.5 text-gray-400">
//           <FaSearch />
//         </div>
//         <button
//           onClick={handleSearch}
//           className="absolute right-2 top-2 text-green-600"
//         >
//           Tìm
//         </button>
//       </div>
      
//       {scanHistory.length > 0 && (
//         <div>
//           <div className="flex justify-between items-center mb-3">
//             <h2 className="font-semibold text-gray-700 flex items-center">
//               <FaHistory className="mr-2 text-gray-500" />
//               Quét gần đây
//             </h2>
//             <button
//               onClick={() => setViewMode('history')}
//               className="text-sm text-green-600"
//             >
//               Xem tất cả
//             </button>
//           </div>
          
//           <div className="space-y-2">
//             {scanHistory.slice(0, 2).map((item, index) => {
//               const product = getProductFromHistory(item);
//               return (
//                 <div 
//                   key={index}
//                   className="flex items-center p-2 bg-white rounded-lg shadow-sm border border-gray-200"
//                   onClick={() => handleViewHistoryProduct(item)}
//                 >
//                   <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center mr-3">
//                     <FaBarcode className="text-gray-500" />
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="font-medium text-gray-800">{product.name}</h3>
//                     <div className="flex justify-between items-center text-xs">
//                       <span className="text-gray-500">{item.timestamp}</span>
//                       <div className={`px-2 py-0.5 rounded-full ${getScoreColorClass(product.greenScore)}`}>
//                         {product.greenScore.toFixed(1)}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}
      
//       <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//         <h3 className="font-semibold text-blue-800 mb-2">Mẹo mua sắm xanh</h3>
//         <ul className="text-sm text-blue-700 space-y-1 pl-5 list-disc">
//           <li>Chọn sản phẩm có điểm xanh cao</li>
//           <li>Ưu tiên bao bì có thể tái chế</li>
//           <li>Giảm sử dụng sản phẩm nhựa dùng một lần</li>
//           <li>Mang túi riêng khi đi mua sắm</li>
//         </ul>
//       </div>
//     </div>
//   );
  
//   // Helper - lấy màu dựa vào điểm số
//   const getScoreColorClass = (score) => {
//     if (score >= 8) return 'bg-green-100 text-green-800';
//     if (score >= 5) return 'bg-yellow-100 text-yellow-800';
//     return 'bg-red-100 text-red-800';
//   };
  
//   // Render màn hình kết quả quét
//   const renderResultView = () => {
//     if (!scannedProduct) return null;
    
//     return (
//       <div className="space-y-6">
//         <div className="flex items-center mb-6">
//           <button
//             onClick={() => setViewMode('scan')}
//             className="mr-3 text-gray-600"
//           >
//             <FaArrowLeft />
//           </button>
//           <h1 className="text-xl font-bold text-green-800">
//             Kết quả đánh giá
//           </h1>
//         </div>
        
//         <div className="bg-white p-4 rounded-lg shadow-md">
//           <div className="flex items-center mb-4">
//             <div className="w-16 h-16 mr-3 bg-gray-100 rounded-md flex items-center justify-center">
//               <FaLeaf className="text-green-500 text-2xl" />
//             </div>
            
//             <div className="flex-1">
//               <h2 className="font-bold text-gray-800">{scannedProduct.name}</h2>
//               <p className="text-sm text-gray-500">{scannedProduct.brand}</p>
//               <div className="flex items-center mt-1">
//                 <FaBarcode className="text-gray-400 mr-1" />
//                 <span className="text-xs text-gray-500">{scannedProduct.barcode}</span>
//               </div>
//             </div>
//           </div>
          
//           <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-4">
//             <div className="text-center">
//               <p className="text-xs text-gray-500">Điểm xanh</p>
//               <div className={`text-xl font-bold ${
//                 scannedProduct.greenScore >= 8 
//                   ? 'text-green-600' 
//                   : scannedProduct.greenScore >= 5 
//                     ? 'text-yellow-600' 
//                     : 'text-red-600'
//               }`}>
//                 {scannedProduct.greenScore.toFixed(1)}/10
//               </div>
//             </div>
            
//             <div className="h-10 w-px bg-gray-300 mx-2"></div>
            
//             <div className="text-center">
//               <p className="text-xs text-gray-500">Loại</p>
//               <p className="font-medium text-gray-700">{scannedProduct.category}</p>
//             </div>
            
//             <div className="h-10 w-px bg-gray-300 mx-2"></div>
            
//             <div className="text-center">
//               <p className="text-xs text-gray-500">Bao bì</p>
//               <p className="font-medium text-gray-700">{scannedProduct.packaging}</p>
//             </div>
//           </div>
          
//           <div className="space-y-2 mb-4">
//             <div className="flex items-center">
//               <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
//                 scannedProduct.recyclable ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
//               }`}>
//                 <FaRecycle className="text-xs" />
//               </div>
//               <span className={scannedProduct.recyclable ? 'text-gray-800' : 'text-gray-500'}>
//                 {scannedProduct.recyclable ? 'Có thể tái chế' : 'Không thể tái chế'}
//               </span>
//             </div>
            
//             <div className="flex items-center">
//               <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
//                 scannedProduct.biodegradable ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
//               }`}>
//                 <FaLeaf className="text-xs" />
//               </div>
//               <span className={scannedProduct.biodegradable ? 'text-gray-800' : 'text-gray-500'}>
//                 {scannedProduct.biodegradable ? 'Phân hủy sinh học' : 'Không phân hủy sinh học'}
//               </span>
//             </div>
            
//             <div className="flex items-center">
//               <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
//                 scannedProduct.plasticFree ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
//               }`}>
//                 <FaTrash className="text-xs" />
//               </div>
//               <span className={scannedProduct.plasticFree ? 'text-gray-800' : 'text-gray-500'}>
//                 {scannedProduct.plasticFree ? 'Không nhựa' : 'Có chứa nhựa'}
//               </span>
//             </div>
//           </div>
          
//           <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
//             <div className="flex items-start">
//               <FaExclamationTriangle className="text-blue-800 mt-0.5 mr-2 shrink-0" />
//               <div>
//                 <h3 className="font-semibold text-blue-800 mb-1">Gợi ý</h3>
//                 <p className="text-sm text-blue-700">{scannedProduct.recommendation}</p>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         <div className="space-y-3">
//           <h3 className="font-semibold text-gray-700">Sản phẩm thay thế tốt hơn</h3>
          
//           <div className="grid grid-cols-2 gap-3">
//             {PRODUCTS.filter(p => 
//               p.id !== scannedProduct.id && 
//               p.category === scannedProduct.category &&
//               p.greenScore > scannedProduct.greenScore
//             ).slice(0, 2).map(product => (
//               <div key={product.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
//                 <div className="h-12 bg-gray-100 rounded-md flex items-center justify-center mb-2">
//                   <FaLeaf className="text-green-500" />
//                 </div>
//                 <h4 className="font-medium text-sm text-gray-800 line-clamp-1">{product.name}</h4>
//                 <div className="flex justify-between items-center mt-1">
//                   <span className="text-xs text-gray-500">{product.brand}</span>
//                   <div className="px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                     {product.greenScore.toFixed(1)}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
        
//         <button
//           onClick={() => setViewMode('scan')}
//           className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center"
//         >
//           <FaBarcode className="mr-2" />
//           Quét sản phẩm khác
//         </button>
//       </div>
//     );
//   };
  
//   // Render lịch sử quét
//   const renderHistoryView = () => (
//     <div className="space-y-6">
//       <div className="flex items-center mb-6">
//         <button
//           onClick={() => setViewMode('scan')}
//           className="mr-3 text-gray-600"
//         >
//           <FaArrowLeft />
//         </button>
//         <h1 className="text-xl font-bold text-green-800">
//           Lịch sử quét
//         </h1>
//       </div>
      
//       <div className="space-y-3">
//         {scanHistory.length > 0 ? (
//           scanHistory.map((item, index) => {
//             const product = getProductFromHistory(item);
//             return (
//               <div 
//                 key={index}
//                 className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-gray-200"
//                 onClick={() => handleViewHistoryProduct(item)}
//               >
//                 <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center mr-3">
//                   <FaBarcode className="text-gray-500" />
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="font-medium text-gray-800">{product.name}</h3>
//                   <p className="text-xs text-gray-500">{product.brand} • {product.category}</p>
//                   <div className="flex justify-between items-center mt-1">
//                     <span className="text-xs text-gray-500">{item.timestamp}</span>
//                     <div className={`px-2 py-0.5 rounded-full text-xs ${getScoreColorClass(product.greenScore)}`}>
//                       Điểm: {product.greenScore.toFixed(1)}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           <div className="text-center py-8">
//             <p className="text-gray-500">Bạn chưa quét sản phẩm nào.</p>
//           </div>
//         )}
//       </div>
      
//       {scanHistory.length > 0 && (
//         <button
//           onClick={() => setScanHistory([])}
//           className="w-full py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
//         >
//           Xóa lịch sử
//         </button>
//       )}
//     </div>
//   );
  
//   // Render theo chế độ xem
//   const renderContent = () => {
//     switch (viewMode) {
//       case 'result':
//         return renderResultView();
//       case 'history':
//         return renderHistoryView();
//       default:
//         return renderScanView();
//     }
//   };
  
//   return (
//     <div className="pb-16">
//       {renderContent()}
//     </div>
//   );
// }
'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  FaBarcode,
  FaCamera,
  FaLeaf,
  FaTrash,
  FaRecycle,
  FaExclamationTriangle,
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

const LOCAL_KEY = 'sx_scan_history_v1';

export default function BarcodeScan() {
  const [viewMode, setViewMode] = useState('scan'); // 'scan', 'result', 'history'
  const [searchTerm, setSearchTerm] = useState('');
  const [scannedProduct, setScannedProduct] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);

  // camera / scanner
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scannerAvailable, setScannerAvailable] = useState(true);
  const html5QrCodeRef = useRef(null);
  const lastScanRef = useRef({ text: null, time: 0 });

  // photo / preview
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) setScanHistory(JSON.parse(raw));
      else setScanHistory([]);
    } catch (e) {
      console.warn('Không thể đọc history từ localStorage', e);
      setScanHistory([]);
    }

    // cleanup scanner on unmount
    return () => {
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist history whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(scanHistory));
    } catch (e) {
      console.warn('Lưu history lỗi', e);
    }
  }, [scanHistory]);

  // helper get product
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

  // Called when a barcode/QR decoded from camera or file
  const onScanResult = (decodedText) => {
    // debounce duplicates for 2s
    const now = Date.now();
    if (lastScanRef.current.text === decodedText && now - lastScanRef.current.time < 2000) return;
    lastScanRef.current = { text: decodedText, time: now };

    const product = getProductByBarcode(decodedText);
    if (product) {
      setScannedProduct(product);
      pushHistory({ id: product.id, barcode: decodedText, name: product.name });
      setViewMode('result');
    } else {
      // product not found: add raw entry and show unknown result UI
      pushHistory({ barcode: decodedText, name: 'Sản phẩm không xác định' });
      setScannedProduct({
        id: null,
        barcode: decodedText,
        name: 'Sản phẩm không xác định',
        brand: '',
        category: '',
        packaging: '',
        greenScore: null,
        recyclable: false,
        biodegradable: false,
        plasticFree: false,
        recommendation: 'Chưa có dữ liệu cho mã này.'
      });
      setViewMode('result');
    }
  };

  // Prepare camera list (html5-qrcode)
  const prepareCameras = async () => {
    try {
      const mod = await import('html5-qrcode');
      const { Html5Qrcode } = mod;
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length) {
        setCameras(devices);
        setSelectedCamera(prev => prev || devices[0].id);
      }
      setScannerAvailable(true);
    } catch (e) {
      console.warn('Không thể lấy camera / load html5-qrcode', e);
      setScannerAvailable(false);
    }
  };

  // Start scanner
  const startScanner = async () => {
    if (scanning) return;
    // ensure #reader exists (Cách A đảm bảo reader luôn render, nhưng double-check)
    const readerEl = document.getElementById('reader');
    if (!readerEl) {
      alert('Phần tử hiển thị camera (#reader) chưa sẵn sàng. Hãy thử reload trang.');
      return;
    }

    try {
      const mod = await import('html5-qrcode');
      const { Html5Qrcode } = mod;

      // create instance if not exists
      if (!html5QrCodeRef.current) html5QrCodeRef.current = new Html5Qrcode('reader');
      const instance = html5QrCodeRef.current;

      // ensure camera list
      if (cameras.length === 0) {
        try {
          const devices = await Html5Qrcode.getCameras();
          if (devices && devices.length) {
            setCameras(devices);
            setSelectedCamera(prev => prev || devices[0].id);
          }
        } catch (er) {
          // ignore
        }
      }

      const cameraId = selectedCamera || (cameras[0] && cameras[0].id) || undefined;

      await instance.start(
        cameraId,
        { fps: 10, qrbox: { width: 300, height: 180 }, verbose: false },
        (decodedText, decodedResult) => {
          onScanResult(decodedText);
          // optionally stop after first successful read:
          // stopScanner();
        },
        (error) => {
          // frame decode error - ignore
        }
      );

      setScanning(true);
      setScannerAvailable(true);
    } catch (err) {
      console.error('Lỗi khi mở camera:', err);
      setScannerAvailable(false);
      const name = err?.name || 'Error';
      alert(`Không thể mở camera — ${name}: ${err?.message || String(err)}\n\nNếu bạn là dev, chạy: npm install html5-qrcode (sau đó reload).`);
    }
  };

  // Stop scanner
  const stopScanner = async () => {
    try {
      const instance = html5QrCodeRef.current;
      if (instance) {
        await instance.stop();
        try { await instance.clear(); } catch (e) { /* ignore */ }
        html5QrCodeRef.current = null;
      }
    } catch (e) {
      console.warn('Lỗi dừng scanner', e);
    } finally {
      setScanning(false);
    }
  };

  // UI action for camera button
  const handleCameraButton = async () => {
    if (scanning) {
      await stopScanner();
    } else {
      await prepareCameras();
      await startScanner();
    }
  };

  // search
  const handleSearch = () => {
    if (searchTerm.trim().length >= 6) {
      const t = searchTerm.trim();
      // if camera running, stop it
      if (scanning) stopScanner();
      onScanResult(t);
      setSearchTerm('');
    } else {
      alert('Nhập ít nhất 6 ký tự mã vạch để tìm.');
    }
  };

  // file -> scan (user selects image file)
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // show small preview (thumbnail) to user, but don't keep huge image
    const previewUrl = URL.createObjectURL(file);
    setPhotoPreviewUrl(previewUrl);

    // try Barcode Detector API first (fast, native)
    if ('BarcodeDetector' in window) {
      try {
        const formats = ['ean_13', 'ean_8', 'code_128', 'qr_code'];
        const detector = new window.BarcodeDetector({ formats });

        // create ImageBitmap with resizing if supported for performance
        let imageBitmap;
        try {
          // try to resize while creating bitmap to reduce memory
          imageBitmap = await createImageBitmap(file, { resizeWidth: 1000, resizeHeight: 1000, resizeQuality: 'high' });
        } catch (err) {
          // fallback: create without resize
          imageBitmap = await createImageBitmap(file);
        }

        const results = await detector.detect(imageBitmap);
        imageBitmap.close?.();

        if (results && results.length) {
          onScanResult(results[0].rawValue);
        } else {
          alert('Không phát hiện mã trong ảnh. Hãy thử ảnh khác hoặc dùng camera.');
        }

        // revoke preview later on user action; keep thumbnail short-lived
        setTimeout(() => URL.revokeObjectURL(previewUrl), 60000);
        e.target.value = '';
        return;
      } catch (err) {
        console.warn('BarcodeDetector lỗi:', err);
        // fallback tiếp
      }
    }

    // fallback: thử dùng html5-qrcode scanFile nếu có
    try {
      const mod = await import('html5-qrcode');
      const { Html5Qrcode } = mod;
      const tmp = new Html5Qrcode('reader-temp');
      if (typeof tmp.scanFile === 'function') {
        const result = await tmp.scanFile(file, true);
        if (result && result.length && result[0].decodedText) {
          onScanResult(result[0].decodedText);
          try { await tmp.clear(); } catch (e) {}
          e.target.value = '';
          return;
        }
        try { await tmp.clear(); } catch (e) {}
      }
    } catch (err) {
      // ignore fallback error
    }

    alert('Không thể quét từ ảnh trên trình duyệt này. Hãy dùng Chrome/Edge mới hoặc bật camera để quét trực tiếp.');
    e.target.value = '';
  };

  // capture photo from video preview but scale down (no big image)
  const capturePhoto = async (maxWidth = 1000, quality = 0.8) => {
    const reader = document.getElementById('reader');
    if (!reader) return alert('Vùng camera chưa sẵn sàng');
    const video = reader.querySelector('video');
    if (!video || video.readyState < 2) return alert('Camera chưa sẵn sàng');

    const vw = video.videoWidth || video.clientWidth;
    const vh = video.videoHeight || video.clientHeight;
    if (!vw || !vh) return alert('Không lấy được kích thước video');

    const scale = Math.min(1, maxWidth / vw);
    const cw = Math.round(vw * scale);
    const ch = Math.round(vh * scale);

    const canvas = document.createElement('canvas');
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, cw, ch);

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Không tạo được ảnh'));
        const url = URL.createObjectURL(blob);
        setPhotoPreviewUrl(url);
        // revoke later
        setTimeout(() => URL.revokeObjectURL(url), 60000);
        resolve(blob);
      }, 'image/jpeg', quality);
    });
  };

  // history helpers
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

  // ---------- Renderers ----------
  const getScoreColorClass = (score) => {
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const renderScanView = () => (
    <div className="max-w-3xl mx-auto px-4 pt-8 pb-20">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-green-700">Quét mã sản phẩm</h1>
        <p className="text-gray-600 mt-1">Kiểm tra mức độ thân thiện với môi trường</p>
      </div>

      <div className="bg-green-50 rounded-xl p-6 mb-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <FaBarcode className="text-green-600 text-3xl" />
            </div>
            <p className="text-center text-gray-600 mb-5 px-6">
              Quét mã vạch sản phẩm để xem thông tin và đánh giá mức độ thân thiện với môi trường.
            </p>

            {/* camera area - ensure #reader always exists */}
            <div className="w-full max-w-xl">
              <div className="space-y-3">
                {/* nút mở camera khi chưa quét */}
                {!scanning && (
                  <button
                    onClick={handleCameraButton}
                    className="w-full inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-md shadow justify-center"
                  >
                    <FaCamera />
                    Mở máy ảnh để quét
                  </button>
                )}

                {/* controls khi đang quét */}
                {scanning && (
                  <div className="flex items-center gap-2 mb-2">
                    <select
                      value={selectedCamera || ''}
                      onChange={(e) => setSelectedCamera(e.target.value)}
                      className="flex-1 border rounded px-2 py-1"
                    >
                      {cameras.map(c => (
                        <option key={c.id} value={c.id}>{c.label || c.id}</option>
                      ))}
                    </select>
                    <button onClick={handleCameraButton} className="px-3 py-1 bg-red-500 text-white rounded">Dừng</button>
                    <button onClick={() => capturePhoto(1000, 0.78)} className="px-3 py-1 bg-blue-600 text-white rounded">Chụp ảnh</button>
                  </div>
                )}

                {/* element #reader luôn ở đây */}
                <div id="reader" className={`w-full h-56 rounded overflow-hidden flex items-center justify-center ${scanning ? 'bg-black' : 'bg-gray-100'}`}>
                  {!scanning && (
                    <div className="text-gray-500">Khu vực camera (bấm Mở máy ảnh để bật)</div>
                  )}
                </div>

                {/* preview thumbnail */}
                {photoPreviewUrl && (
                  <div className="mt-2 flex items-center gap-3">
                    <img src={photoPreviewUrl} alt="preview" className="w-28 h-auto rounded shadow" />
                    <button onClick={() => { URL.revokeObjectURL(photoPreviewUrl); setPhotoPreviewUrl(null); }} className="text-sm text-red-500">Xóa ảnh</button>
                  </div>
                )}

                {!scannerAvailable && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                    Thư viện quét chưa sẵn sàng. Chạy <code>npm install html5-qrcode</code> (hoặc <code>yarn add html5-qrcode</code>) rồi reload.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* search + upload */}
      <div className="max-w-xl mx-auto mb-6 relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Nhập mã vạch sản phẩm..."
            className="w-full pl-12 pr-40 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <div className="absolute left-4 top-3 text-gray-400">
            <FaSearch />
          </div>

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <label className="text-sm text-green-700 cursor-pointer px-3 py-1">
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              Chọn ảnh
            </label>
            <button
              onClick={handleSearch}
              className="text-green-700 font-medium px-4 py-2"
            >
              Tìm
            </button>
          </div>
        </div>
      </div>

      {/* recent scans + tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {scanHistory.length > 0 && (
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <FaHistory className="text-gray-500" /> Quét gần đây
              </h2>
              <button className="text-sm text-green-600" onClick={() => setViewMode('history')}>Xem tất cả</button>
            </div>
          )}

          <div className="space-y-3">
            {scanHistory.length === 0 ? (
              <div className="text-gray-500">Bạn chưa quét sản phẩm nào.</div>
            ) : (
              scanHistory.slice(0, 2).map((item, idx) => {
                const product = getProductFromHistory(item);
                return (
                  <div
                    key={idx}
                    onClick={() => handleViewHistoryProduct(item)}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                      <FaBarcode className="text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="truncate">
                          <h3 className="font-medium text-gray-800 truncate">{product?.name || item.name || 'Sản phẩm'}</h3>
                          <p className="text-xs text-gray-500 truncate">{product?.brand || ''} {product ? '• ' + product.category : ''}</p>
                        </div>
                        <div className={`px-2 py-0.5 rounded-full text-sm font-medium ${getScoreColorClass(product?.greenScore ?? 0)}`}>
                          {(product?.greenScore ?? 0).toFixed(1)}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{item.timestamp}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2">Mẹo mua sắm xanh</h3>
            <ul className="text-sm text-blue-700 space-y-1 pl-4 list-disc">
              <li>Chọn sản phẩm có điểm xanh cao</li>
              <li>Ưu tiên bao bì có thể tái chế</li>
              <li>Giảm sử dụng sản phẩm nhựa dùng một lần</li>
              <li>Mang túi riêng khi đi mua sắm</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderResultView = () => {
    if (!scannedProduct) return null;

    return (
      <div className="max-w-3xl mx-auto px-4 pt-8 pb-20">
        <div className="flex items-center mb-6">
          <button onClick={() => { setViewMode('scan'); if (scanning) stopScanner(); }} className="mr-3 text-gray-600">
            <FaArrowLeft />
          </button>
          <h1 className="text-xl font-bold text-green-800">Kết quả đánh giá</h1>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 mr-3 bg-gray-100 rounded-md flex items-center justify-center">
              <FaLeaf className="text-green-500 text-2xl" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-gray-800">{scannedProduct.name}</h2>
              <p className="text-sm text-gray-500">{scannedProduct.brand}</p>
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <FaBarcode className="mr-1" /> {scannedProduct.barcode}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">Điểm xanh</p>
              <div className={`text-xl font-bold ${scannedProduct.greenScore >= 8 ? 'text-green-600' : scannedProduct.greenScore >= 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                {scannedProduct.greenScore !== null ? scannedProduct.greenScore.toFixed(1) + '/10' : 'Chưa có'}
              </div>
            </div>

            <div className="h-10 w-px bg-gray-300 mx-2"></div>

            <div className="text-center">
              <p className="text-xs text-gray-500">Loại</p>
              <p className="font-medium text-gray-700">{scannedProduct.category || '-'}</p>
            </div>

            <div className="h-10 w-px bg-gray-300 mx-2"></div>

            <div className="text-center">
              <p className="text-xs text-gray-500">Bao bì</p>
              <p className="font-medium text-gray-700">{scannedProduct.packaging || '-'}</p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${scannedProduct.recyclable ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                <FaRecycle className="text-xs" />
              </div>
              <span className={scannedProduct.recyclable ? 'text-gray-800' : 'text-gray-500'}>
                {scannedProduct.recyclable ? 'Có thể tái chế' : 'Không thể tái chế'}
              </span>
            </div>

            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${scannedProduct.biodegradable ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                <FaLeaf className="text-xs" />
              </div>
              <span className={scannedProduct.biodegradable ? 'text-gray-800' : 'text-gray-500'}>
                {scannedProduct.biodegradable ? 'Phân hủy sinh học' : 'Không phân hủy sinh học'}
              </span>
            </div>

            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${scannedProduct.plasticFree ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
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

        {/* Sản phẩm thay thế */}
        <div className="mt-6 space-y-3">
          <h3 className="font-semibold text-gray-700">Sản phẩm thay thế tốt hơn</h3>

          <div className="grid grid-cols-2 gap-3">
            {PRODUCTS.filter(p =>
              p.id !== scannedProduct.id &&
              p.category === scannedProduct.category &&
              (scannedProduct.greenScore === null ? p.greenScore >= 0 : p.greenScore > scannedProduct.greenScore)
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
          onClick={() => { setViewMode('scan'); if (scanning) stopScanner(); }}
          className="mt-6 w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center"
        >
          <FaBarcode className="mr-2" />
          Quét sản phẩm khác
        </button>
      </div>
    );
  };

  const renderHistoryView = () => (
    <div className="max-w-3xl mx-auto px-4 pt-8 pb-20">
      <div className="flex items-center mb-6">
        <button onClick={() => setViewMode('scan')} className="mr-3 text-gray-600">
          <FaArrowLeft />
        </button>
        <h1 className="text-xl font-bold text-green-800">Lịch sử quét</h1>
      </div>

      <div className="space-y-3">
        {scanHistory.length > 0 ? (
          scanHistory.map((item, index) => {
            const product = getProductFromHistory(item);
            return (
              <div
                key={index}
                className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer"
                onClick={() => handleViewHistoryProduct(item)}
              >
                <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                  <FaBarcode className="text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-800">{product?.name || item.name || 'Sản phẩm'}</h3>
                  <p className="text-xs text-gray-500">{product?.brand} {product ? '• ' + product.category : ''}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">{item.timestamp}</span>
                    <div className={`px-2 py-0.5 rounded-full text-xs ${getScoreColorClass(product?.greenScore ?? 0)}`}>
                      Điểm: {(product?.greenScore ?? 0).toFixed(1)}
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
        <div className="mt-6 space-y-2">
          <button onClick={() => setScanHistory([])} className="w-full py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">Xóa lịch sử</button>
          <button onClick={() => { localStorage.removeItem(LOCAL_KEY); setScanHistory([]); }} className="w-full py-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50">Xóa và xóa localStorage</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-green-50">
      {viewMode === 'result' && renderResultView()}
      {viewMode === 'history' && renderHistoryView()}
      {viewMode === 'scan' && renderScanView()}
    </div>
  );
}
