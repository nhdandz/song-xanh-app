'use client';

import { useState } from 'react';
import { 
  FaMapMarkerAlt, 
  FaRecycle, 
  FaLeaf,
  FaStore, 
  FaFilter, 
  FaDirections,
  FaStar,
  FaRegStar,
  FaClock,
  FaPhoneAlt
} from 'react-icons/fa';

// Dữ liệu mẫu cho các điểm trên bản đồ
const MAP_POINTS = [
  {
    id: 1,
    name: 'Điểm thu gom rác tái chế Xanh',
    type: 'recycle',
    address: '15 Nguyễn Trãi, Thanh Xuân, Hà Nội',
    materials: ['Giấy', 'Nhựa', 'Kim loại'],
    openHours: '8:00 - 17:00',
    phone: '024.1234.5678',
    distance: '1.2 km',
    favorite: true,
    rating: 4.5,
    reviews: 38,
  },
  {
    id: 2,
    name: 'Công viên Thống Nhất',
    type: 'green',
    address: 'Đường Trần Nhân Tông, Hai Bà Trưng, Hà Nội',
    activities: ['Cây xanh', 'Thể thao', 'Giải trí'],
    openHours: '5:00 - 22:00',
    distance: '2.8 km',
    favorite: false,
    rating: 4.7,
    reviews: 125,
  },
  {
    id: 3,
    name: 'Cửa hàng Eco-friendly',
    type: 'shop',
    address: '88 Láng Hạ, Ba Đình, Hà Nội',
    products: ['Đồ dùng sinh học', 'Thực phẩm hữu cơ', 'Mỹ phẩm thiên nhiên'],
    openHours: '9:00 - 21:00',
    phone: '024.8765.4321',
    distance: '3.5 km',
    favorite: true,
    rating: 4.2,
    reviews: 56,
  },
  {
    id: 4,
    name: 'Vườn thực phẩm cộng đồng',
    type: 'green',
    address: 'Khu đô thị Ecopark, Văn Giang, Hưng Yên',
    activities: ['Vườn rau', 'Học tập', 'Cộng đồng'],
    openHours: '6:00 - 18:00',
    distance: '15 km',
    favorite: false,
    rating: 4.8,
    reviews: 42,
  },
];

// Danh mục
const CATEGORIES = [
  { id: 'all', label: 'Tất cả', icon: <FaMapMarkerAlt /> },
  { id: 'recycle', label: 'Điểm tái chế', icon: <FaRecycle /> },
  { id: 'green', label: 'Không gian xanh', icon: <FaLeaf /> },
  { id: 'shop', label: 'Cửa hàng xanh', icon: <FaStore /> },
];

export default function GreenMap() {
  const [mapPoints, setMapPoints] = useState(MAP_POINTS);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  
  // Lọc điểm theo danh mục
  const filteredPoints = activeCategory === 'all' 
    ? mapPoints 
    : mapPoints.filter(point => point.type === activeCategory);
  
  // Xử lý thêm/xóa điểm yêu thích
  const toggleFavorite = (id) => {
    setMapPoints(mapPoints.map(point => 
      point.id === id ? { ...point, favorite: !point.favorite } : point
    ));
  };
  
  // Xử lý hiển thị chi tiết điểm
  const handlePointClick = (point) => {
    setSelectedPoint(point);
  };
  
  // Đóng chi tiết điểm
  const closePointDetails = () => {
    setSelectedPoint(null);
  };
  
  // Render icon theo loại điểm
  const renderTypeIcon = (type) => {
    switch(type) {
      case 'recycle':
        return <FaRecycle className="text-blue-500" />;
      case 'green':
        return <FaLeaf className="text-green-500" />;
      case 'shop':
        return <FaStore className="text-purple-500" />;
      default:
        return <FaMapMarkerAlt className="text-red-500" />;
    }
  };
  
  return (
    <div className="pb-16 relative h-screen flex flex-col">
      {/* Tiêu đề */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-green-800">
          Bản đồ xanh
        </h1>
        <p className="text-gray-600 mt-1">
          Tìm điểm tái chế và không gian xanh gần bạn
        </p>
      </div>
      
      {/* Vùng bản đồ */}
      <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden relative">
        {/* Giả lập vùng bản đồ */}
        <div className="h-full w-full bg-green-50 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <FaMapMarkerAlt className="mx-auto text-4xl mb-2 text-green-500" />
            <p>Bản đồ sẽ hiển thị ở đây</p>
          </div>
        </div>
        
        {/* Nút lọc và chọn loại */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white p-3 rounded-full shadow-lg"
          >
            <FaFilter className="text-gray-600" />
          </button>
        </div>
        
        {/* Danh mục */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-4 divide-x divide-gray-200">
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                className={`p-3 flex flex-col items-center ${
                  activeCategory === category.id
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                <div className="mb-1">{category.icon}</div>
                <span className="text-xs">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Danh sách điểm */}
      <div className="mt-4">
        <h2 className="font-bold text-green-800 mb-3 flex items-center">
          <FaMapMarkerAlt className="mr-2" />
          Điểm gần bạn ({filteredPoints.length})
        </h2>
        
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {filteredPoints.map(point => (
            <div 
              key={point.id} 
              className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex items-center"
              onClick={() => handlePointClick(point)}
            >
              <div className="mr-3 p-2 rounded-full bg-gray-100">
                {renderTypeIcon(point.type)}
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold">{point.name}</h3>
                <p className="text-xs text-gray-500 flex items-center">
                  <FaMapMarkerAlt className="mr-1" size={10} />
                  {point.address}
                </p>
                <div className="flex items-center mt-1">
                  <div className="flex items-center text-yellow-500 text-xs mr-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{point.rating} ({point.reviews})</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="text-sm text-green-600 font-medium">{point.distance}</span>
                <button 
                  className="mt-1 p-1" 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(point.id);
                  }}
                >
                  {point.favorite ? (
                    <FaStar className="text-yellow-500" />
                  ) : (
                    <FaRegStar className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Chi tiết điểm */}
      {selectedPoint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white rounded-t-xl w-full p-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="font-bold text-xl">{selectedPoint.name}</h2>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <div className="mr-2">{renderTypeIcon(selectedPoint.type)}</div>
                  <span>
                    {selectedPoint.type === 'recycle' && 'Điểm tái chế'}
                    {selectedPoint.type === 'green' && 'Không gian xanh'}
                    {selectedPoint.type === 'shop' && 'Cửa hàng xanh'}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(selectedPoint.id);
                }}
                className="p-2"
              >
                {selectedPoint.favorite ? (
                  <FaStar className="text-yellow-500 text-xl" />
                ) : (
                  <FaRegStar className="text-gray-400 text-xl" />
                )}
              </button>
            </div>
            
            <div className="h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
              <FaMapMarkerAlt className="text-green-500 text-4xl" />
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-gray-400 mt-1 mr-3" />
                <div>
                  <div className="text-gray-800">{selectedPoint.address}</div>
                  <div className="text-sm text-gray-500">{selectedPoint.distance} từ vị trí của bạn</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <FaClock className="text-gray-400 mt-1 mr-3" />
                <div>
                  <div className="text-gray-800">Giờ mở cửa</div>
                  <div className="text-sm text-gray-500">{selectedPoint.openHours}</div>
                </div>
              </div>
              
              {selectedPoint.phone && (
                <div className="flex items-start">
                  <FaPhoneAlt className="text-gray-400 mt-1 mr-3" />
                  <div className="text-gray-800">{selectedPoint.phone}</div>
                </div>
              )}
              
              {selectedPoint.materials && (
                <div className="flex items-start">
                  <FaRecycle className="text-gray-400 mt-1 mr-3" />
                  <div>
                    <div className="text-gray-800">Vật liệu nhận</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedPoint.materials.map((material, index) => (
                        <span 
                          key={index}
                          className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded"
                        >
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {selectedPoint.activities && (
                <div className="flex items-start">
                  <FaLeaf className="text-gray-400 mt-1 mr-3" />
                  <div>
                    <div className="text-gray-800">Hoạt động</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedPoint.activities.map((activity, index) => (
                        <span 
                          key={index}
                          className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {selectedPoint.products && (
                <div className="flex items-start">
                  <FaStore className="text-gray-400 mt-1 mr-3" />
                  <div>
                    <div className="text-gray-800">Sản phẩm</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedPoint.products.map((product, index) => (
                        <span 
                          key={index}
                          className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded"
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                className="py-2 bg-gray-100 rounded-lg font-semibold text-gray-700 flex items-center justify-center"
                onClick={closePointDetails}
              >
                Đóng
              </button>
              
              <button className="py-2 bg-green-600 text-white rounded-lg font-semibold flex items-center justify-center">
                <FaDirections className="mr-2" />
                Chỉ đường
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}