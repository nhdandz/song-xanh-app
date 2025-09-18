'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import { 
  FaHome, 
  FaLeaf, 
  FaChartBar, 
  FaMedal, 
  FaUsers, 
  FaFlag,
  FaNewspaper,
  FaMapMarkedAlt,
  FaProjectDiagram,
  FaCog,
  FaGamepad,
  FaExclamationTriangle,
  FaBarcode,
  FaLightbulb,
  FaWater,
  FaTimes,
  FaSignOutAlt,
  FaRobot
} from 'react-icons/fa';

export default function DrawerMenu({ isOpen, onClose }) {
  const { user, points, logout } = useAppContext();
  
  // Vô hiệu hóa cuộn trang khi drawer mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const menuItems = [
    { path: '/', label: 'Trang chủ', icon: <FaHome size={20} /> },
    { path: '/hanh-vi-xanh', label: 'Hành vi xanh', icon: <FaLeaf size={20} /> },
    { path: '/thong-ke', label: 'Thống kê xanh', icon: <FaChartBar size={20} /> },
    { path: '/thach-thuc', label: 'Thách thức', icon: <FaFlag size={20} /> },
    { path: '/so-sanh', label: 'So sánh nhóm', icon: <FaUsers size={20} /> },
    { path: '/huy-hieu', label: 'Huy hiệu', icon: <FaMedal size={20} /> },
    { divider: true },
    { path: '/tin-tuc', label: 'Tin tức & Bài viết', icon: <FaNewspaper size={20} /> },
    { path: '/ban-do', label: 'Bản đồ xanh', icon: <FaMapMarkedAlt size={20} /> },
    { path: '/du-an', label: 'Dự án môi trường', icon: <FaProjectDiagram size={20} /> },
    { divider: true },
    { path: '/tro-choi', label: 'Trò chơi môi trường', icon: <FaGamepad size={20} /> },
    { path: '/bao-cao', label: 'Báo cáo vấn đề', icon: <FaExclamationTriangle size={20} /> },
    { path: '/quet-ma', label: 'Quét mã sản phẩm', icon: <FaBarcode size={20} /> },
    { path: '/tiet-kiem', label: 'Tiết kiệm tài nguyên', icon: <FaWater size={20} /> },
    { path: '/y-tuong', label: 'Ý tưởng xanh', icon: <FaLightbulb size={20} /> },
    { path: '/chat-bot', label: 'Chatbot AI', icon: <FaRobot size={20} />},
    { divider: true },
    { path: '/cai-dat', label: 'Cài đặt', icon: <FaCog size={20} /> },
  ];
  
  // Xử lý đăng xuất
  const handleLogout = () => {
    onClose();
    logout();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="w-4/5 bg-white h-full overflow-y-auto animate-slide-left">
        {/* Header */}
        <div className="p-4 bg-green-50 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <FaLeaf className="text-green-600" />
            </div>
            <div>
              <h2 className="font-bold text-green-800">{user.name}</h2>
              <p className="text-sm text-green-600">{points.total} điểm xanh</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center"
          >
            <FaTimes />
          </button>
        </div>
        
        {/* Menu Items */}
        <div className="py-2">
          {menuItems.map((item, index) => 
            item.divider ? (
              <div key={index} className="border-t border-gray-200 my-2"></div>
            ) : (
              <Link 
                key={index}
                href={item.path}
                onClick={onClose}
                className="flex items-center px-4 py-3 hover:bg-green-50"
              >
                <div className="w-8 text-gray-600">
                  {item.icon}
                </div>
                <span className="ml-3 text-gray-800">{item.label}</span>
              </Link>
            )
          )}
          
          {/* Nút đăng xuất */}
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-3 w-full text-left hover:bg-red-50"
          >
            <div className="w-8 text-red-600">
              <FaSignOutAlt size={20} />
            </div>
            <span className="ml-3 text-red-600 font-medium">Đăng xuất</span>
          </button>
        </div>
        
        {/* Footer */}
        <div className="mt-auto p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500 mb-2">
            Phiên bản 1.0.0
          </div>
          <p className="text-xs text-gray-500">
            © 2025 Ứng dụng Sống Xanh - Một sáng kiến của học sinh vì môi trường bền vững.
          </p>
        </div>
      </div>
    </div>
  );
}