'use client';

import { useEffect, useState } from 'react';
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

/* === Dữ liệu mẫu (có lat/lng) ===
   Thay lat/lng cho chính xác nếu cần (lấy từ Google Maps) */
const MAP_POINTS_INIT = [
  {
    id: 1,
    name: 'Điểm thu gom rác tái chế Xanh',
    type: 'recycle',
    address: '15 Nguyễn Trãi, Thanh Xuân, Hà Nội',
    lat: 21.0009,
    lng: 105.8120,
    materials: ['Giấy', 'Nhựa', 'Kim loại'],
    openHours: '8:00 - 17:00',
    phone: '024.1234.5678',
    favorite: true,
    rating: 4.5,
    reviews: 38,
  },
  {
    id: 2,
    name: 'Công viên Thống Nhất',
    type: 'green',
    address: 'Đường Trần Nhân Tông, Hai Bà Trưng, Hà Nội',
    lat: 21.0090,
    lng: 105.8462,
    activities: ['Cây xanh', 'Thể thao', 'Giải trí'],
    openHours: '5:00 - 22:00',
    favorite: false,
    rating: 4.7,
    reviews: 125,
  },
  {
    id: 3,
    name: 'Cửa hàng Eco-friendly',
    type: 'shop',
    address: '88 Láng Hạ, Ba Đình, Hà Nội',
    lat: 21.0105,
    lng: 105.8137,
    products: ['Đồ dùng sinh học', 'Thực phẩm hữu cơ', 'Mỹ phẩm thiên nhiên'],
    openHours: '9:00 - 21:00',
    phone: '024.8765.4321',
    favorite: true,
    rating: 4.2,
    reviews: 56,
  },
  {
    id: 4,
    name: 'Vườn thực phẩm cộng đồng',
    type: 'green',
    address: 'Khu đô thị Ecopark, Văn Giang, Hưng Yên',
    lat: 20.9680,
    lng: 105.9215,
    activities: ['Vườn rau', 'Học tập', 'Cộng đồng'],
    openHours: '6:00 - 18:00',
    favorite: false,
    rating: 4.8,
    reviews: 42,
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Tất cả', icon: <FaMapMarkerAlt /> },
  { id: 'recycle', label: 'Điểm tái chế', icon: <FaRecycle /> },
  { id: 'green', label: 'Không gian xanh', icon: <FaLeaf /> },
  { id: 'shop', label: 'Cửa hàng xanh', icon: <FaStore /> },
];

// Haversine: trả về khoảng cách (km, number)
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const toRad = (deg) => deg * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Format khoảng cách: <1km => m, >=1km => km 2 chữ số thập phân
function formatDistance(km) {
  if (km == null || Number.isNaN(km)) return '—';
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(2)} km`;
}

export default function GreenMap() {
  const [mapPoints, setMapPoints] = useState(MAP_POINTS_INIT);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [userLoc, setUserLoc] = useState(null); // { latitude, longitude }
  const [geoError, setGeoError] = useState(null);
  const [loadingLoc, setLoadingLoc] = useState(false);

  // Lấy vị trí khi mount
  useEffect(() => {
    fetchLocationWithRetry(2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Khi userLoc thay đổi -> cập nhật distance cho tất cả points
  useEffect(() => {
    if (!userLoc) return;
    setMapPoints(prev => prev.map(p => {
      if (typeof p.lat === 'number' && typeof p.lng === 'number') {
        const km = haversineKm(userLoc.latitude, userLoc.longitude, p.lat, p.lng);
        return { ...p, _distanceKm: km, distance: formatDistance(km) };
      }
      return { ...p, _distanceKm: null, distance: '—' };
    }));
  }, [userLoc]);

  // Hàm lấy vị trí với retry nếu TIMEOUT
  function fetchLocationWithRetry(retries = 2) {
    if (!navigator.geolocation) {
      setGeoError('Trình duyệt không hỗ trợ Geolocation');
      return;
    }

    setLoadingLoc(true);
    setGeoError(null);

    const options = {
      enableHighAccuracy: false, // false sẽ nhanh hơn, true chính xác hơn
      timeout: 20000,            // 20s
      maximumAge: 0
    };

    const attempt = (n) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLoc({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
          setLoadingLoc(false);
          setGeoError(null);
        },
        (err) => {
          // err.code: 1 PERMISSION_DENIED, 2 POSITION_UNAVAILABLE, 3 TIMEOUT
          if (err.code === 3 && n > 0) {
            // nếu TIMEOUT thì thử lại sau 1s (giảm số lần)
            setTimeout(() => attempt(n - 1), 1000);
            return;
          }
          setLoadingLoc(false);
          let msg = '';
          switch (err.code) {
            case 1: msg = 'Bạn đã từ chối quyền vị trí. Vui lòng bật lại trong cài đặt trình duyệt.'; break;
            case 2: msg = 'Không thể lấy vị trí hiện tại (thiết bị không có tín hiệu). Thử ra ngoài trời hoặc bật Wi-Fi.'; break;
            case 3: msg = 'Hết thời gian lấy vị trí. Vui lòng thử lại.'; break;
            default: msg = err.message || 'Lỗi khi lấy vị trí';
          }
          setGeoError(msg);
        },
        options
      );
    };

    attempt(retries);
  }

  // Toggle favorite
  const toggleFavorite = (id) => {
    setMapPoints(prev => prev.map(p => p.id === id ? { ...p, favorite: !p.favorite } : p));
    if (selectedPoint && selectedPoint.id === id) {
      setSelectedPoint(prev => ({ ...prev, favorite: !prev.favorite }));
    }
  };

  // Chọn điểm (lấy lại từ state mapPoints để có distance mới nhất)
  const handlePointClick = (pointId) => {
    const point = mapPoints.find(p => p.id === pointId);
    if (point) setSelectedPoint(point);
  };

  const closePointDetails = () => setSelectedPoint(null);

  // Mở Google Maps directions
  const openDirections = (point) => {
    const dest = `${point.lat},${point.lng}`;
    let url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`;
    if (userLoc) {
      const origin = `${userLoc.latitude},${userLoc.longitude}`;
      url += `&origin=${encodeURIComponent(origin)}`;
    }
    window.open(url, '_blank');
  };

  // Lọc theo danh mục
  const filteredPoints = (activeCategory === 'all'
    ? mapPoints
    : mapPoints.filter(p => p.type === activeCategory)
  );

  // Sắp xếp theo khoảng cách nếu có
  const filteredSorted = [...filteredPoints].sort((a, b) => {
    const A = (a._distanceKm == null) ? Infinity : a._distanceKm;
    const B = (b._distanceKm == null) ? Infinity : b._distanceKm;
    return A - B;
  });

  // Render icon theo type
  const renderTypeIcon = (type) => {
    switch(type) {
      case 'recycle': return <FaRecycle className="text-blue-500" />;
      case 'green': return <FaLeaf className="text-green-500" />;
      case 'shop': return <FaStore className="text-purple-500" />;
      default: return <FaMapMarkerAlt className="text-red-500" />;
    }
  };

  return (
    <div className="pb-16 relative min-h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="text-center pt-6 px-4">
        <h1 className="text-2xl font-bold text-green-800">Bản đồ xanh</h1>
        <p className="text-gray-600 mt-1">Tìm điểm tái chế và không gian xanh gần bạn</p>
      </div>

      {/* Danh mục: đặt ngoài vùng bản đồ (không che header) */}
      <div className="mx-4 mt-4 mb-3">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-3xl mx-auto">
          <div className="grid grid-cols-4 divide-x divide-gray-200">
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                className={`p-3 flex flex-col items-center w-full ${
                  activeCategory === category.id ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'
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

      {/* Vùng bản đồ (giả lập) */}
      <div className="mx-4 mb-4">
        <div className="bg-green-50 rounded-lg p-6 flex items-center justify-center" style={{ minHeight: 160 }}>
          <div className="text-center text-gray-500">
            <FaMapMarkerAlt className="mx-auto text-4xl mb-2 text-green-500" />
            <div className="mt-2 text-sm text-gray-600">
              {loadingLoc ? 'Đang xác định vị trí...' :
                geoError ? `Lỗi vị trí: ${geoError}` :
                userLoc ? `Vị trí của bạn: ${userLoc.latitude.toFixed(5)}, ${userLoc.longitude.toFixed(5)}` :
                'Chưa có vị trí'}
            </div>

            <div className="mt-3 flex items-center justify-center gap-3">
              <button
                onClick={() => fetchLocationWithRetry(2)}
                className="px-3 py-2 bg-white border rounded shadow-sm text-sm"
              >
                Lấy lại vị trí
              </button>
              <button
                onClick={() => {
                  // Demo: có thể mở Google Maps trung tâm user nếu có vị trí
                  if (userLoc) {
                    const q = `${userLoc.latitude},${userLoc.longitude}`;
                    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`, '_blank');
                  } else {
                    alert('Chưa có vị trí của bạn.');
                  }
                }}
                className="px-3 py-2 bg-green-600 text-white rounded shadow-sm text-sm"
              >
                Mở vị trí trên Maps
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách điểm */}
      <div className="mx-4 mb-8">
        <h2 className="font-bold text-green-800 mb-3 flex items-center">
          <FaMapMarkerAlt className="mr-2" /> Điểm gần bạn ({filteredSorted.length})
        </h2>

        <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1 pb-4">
          {filteredSorted.map(point => (
            <div
              key={point.id}
              className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex items-center cursor-pointer"
              onClick={() => handlePointClick(point.id)}
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
                      <span key={i} className="text-[10px]">★</span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{point.rating ?? '—'} ({point.reviews ?? 0})</span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-sm text-green-600 font-medium">{point.distance ?? '—'}</span>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(point.id); }}
                    className="p-1"
                    title={point.favorite ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
                  >
                    {point.favorite ? <FaStar className="text-yellow-500" /> : <FaRegStar className="text-gray-400" />}
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); openDirections(point); }}
                    className="p-1"
                    title="Chỉ đường"
                  >
                    <FaDirections className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredSorted.length === 0 && (
            <div className="text-gray-500 text-sm">Không có điểm phù hợp.</div>
          )}
        </div>
      </div>

      {/* Chi tiết điểm modal */}
      {selectedPoint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end" onClick={closePointDetails}>
          <div className="bg-white rounded-t-xl w-full p-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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

              <button onClick={() => toggleFavorite(selectedPoint.id)} className="p-2" title="Yêu thích">
                {selectedPoint.favorite ? <FaStar className="text-yellow-500 text-xl" /> : <FaRegStar className="text-gray-400 text-xl" />}
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
                  <div className="text-sm text-gray-500">{selectedPoint.distance ?? '—'} từ vị trí của bạn</div>
                </div>
              </div>

              {selectedPoint.openHours && (
                <div className="flex items-start">
                  <FaClock className="text-gray-400 mt-1 mr-3" />
                  <div>
                    <div className="text-gray-800">Giờ mở cửa</div>
                    <div className="text-sm text-gray-500">{selectedPoint.openHours}</div>
                  </div>
                </div>
              )}

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
                      {selectedPoint.materials.map((m, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">{m}</span>
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
                      {selectedPoint.activities.map((a, i) => (
                        <span key={i} className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded">{a}</span>
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
                      {selectedPoint.products.map((p, i) => (
                        <span key={i} className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded">{p}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="py-2 bg-gray-100 rounded-lg font-semibold text-gray-700" onClick={closePointDetails}>Đóng</button>
              <button className="py-2 bg-green-600 text-white rounded-lg font-semibold flex items-center justify-center" onClick={() => openDirections(selectedPoint)}>
                <FaDirections className="mr-2" /> Chỉ đường
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
