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
  FaRobot,
  FaGift
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
    { path: '/doi-qua', label: 'Đổi quà', icon: <FaGift size={20} />},
    { divider: true },
    { path: '/cai-dat', label: 'Cài đặt', icon: <FaCog size={20} /> },
  ];
  
  // Xử lý đăng xuất
  const handleLogout = () => {
    onClose();
    logout();
  };
  
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm lg:max-w-md bg-paper h-full overflow-y-auto animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-paper border-b border-line flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-brand-wash flex items-center justify-center mr-3">
              <FaLeaf className="text-brand" size={24} />
            </div>
            <div>
              <h2 className="font-semibold text-ink">{user.name}</h2>
              <p className="text-sm text-ink-soft">{points.total} điểm</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <FaTimes className="text-ink-soft" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          {menuItems.map((item, index) =>
            item.divider ? (
              <div key={index} className="border-t border-line my-2"></div>
            ) : (
              <Link
                key={index}
                href={item.path}
                onClick={onClose}
                className="flex items-center px-6 py-3 hover:bg-canvas transition-colors"
              >
                <div className="w-6 text-ink-soft">
                  {item.icon}
                </div>
                <span className="ml-4 text-ink">{item.label}</span>
              </Link>
            )
          )}

          {/* Nút đăng xuất */}
          <button
            onClick={handleLogout}
            className="flex items-center px-6 py-3 w-full text-left hover:bg-red-50 transition-colors"
          >
            <div className="w-6 text-red-600">
              <FaSignOutAlt size={20} />
            </div>
            <span className="ml-4 text-red-600 font-medium">Đăng xuất</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-auto p-6 border-t border-line bg-canvas">
          <div className="text-xs text-ink-faint mb-2 font-medium">
            Phiên bản 1.0.0
          </div>
          <p className="text-xs text-ink-faint leading-relaxed">
            © 2025 Ứng dụng Sống Xanh
          </p>
        </div>
      </div>
    </div>
  );
}