'use client';

import { useState } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaShareAlt, FaTimes } from 'react-icons/fa';
import { useAppContext } from '@/context/AppContext';

export default function ShareAchievement({ onClose }) {
  const { user, points, getEarnedBadges } = useAppContext();
  const [message, setMessage] = useState(`Tôi đã đạt ${points.total} điểm xanh và đã thực hiện ${points.streak} ngày liên tiếp! #SongXanh #BaoVeMoiTruong`);
  
  const badges = getEarnedBadges();
  const latestBadge = badges.length > 0 ? badges[badges.length - 1] : null;
  
  const generateShareImage = () => {
    // Trong thực tế, đây là nơi bạn sẽ tạo hình ảnh để chia sẻ
    // Ví dụ sử dụng canvas hoặc thư viện như html-to-image
    console.log('Tạo hình ảnh chia sẻ');
    return true;
  };
  
  const handleShare = (platform) => {
    generateShareImage();
    
    // Thực tế sẽ cần API chính thức của từng nền tảng
    const shareUrl = `https://song-xanh.vn/share/${user.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
    
    switch(platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${encodeURIComponent(message)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${shareUrl}`, '_blank');
        break;
      case 'instagram':
        alert('Để chia sẻ lên Instagram, hãy lưu hình ảnh và đăng trực tiếp qua ứng dụng Instagram');
        break;
      default:
        if (navigator.share) {
          navigator.share({
            title: 'Thành tích Sống Xanh của tôi',
            text: message,
            url: shareUrl,
          });
        } else {
          alert(`Link chia sẻ: ${shareUrl}`);
        }
    }
    
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <FaTimes size={20} />
        </button>
        
        <h2 className="text-xl font-bold text-green-800 mb-4">Chia sẻ thành tích</h2>
        
        <div className="bg-green-50 p-4 rounded-lg mb-4 text-center">
          <div className="font-bold text-green-800 text-lg mb-1">Điểm xanh: {points.total}</div>
          <div className="text-green-700">Chuỗi ngày: {points.streak} ngày liên tiếp</div>
          
          {latestBadge && (
            <div className="mt-2">
              <div className="text-sm text-gray-600">Huy hiệu mới nhất</div>
              <div className="font-semibold text-green-700">{latestBadge.title}</div>
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lời nhắn chia sẻ
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            rows="3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-4 gap-2 mb-4">
          <button 
            onClick={() => handleShare('facebook')}
            className="flex flex-col items-center justify-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FaFacebook size={24} />
            <span className="text-xs mt-1">Facebook</span>
          </button>
          
          <button 
            onClick={() => handleShare('twitter')}
            className="flex flex-col items-center justify-center p-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500"
          >
            <FaTwitter size={24} />
            <span className="text-xs mt-1">Twitter</span>
          </button>
          
          <button 
            onClick={() => handleShare('instagram')}
            className="flex flex-col items-center justify-center p-3 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-lg hover:opacity-90"
          >
            <FaInstagram size={24} />
            <span className="text-xs mt-1">Instagram</span>
          </button>
          
          <button 
            onClick={() => handleShare('other')}
            className="flex flex-col items-center justify-center p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <FaShareAlt size={24} />
            <span className="text-xs mt-1">Khác</span>
          </button>
        </div>
        
        <button 
          onClick={() => handleShare('other')}
          className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
        >
          Chia sẻ ngay
        </button>
      </div>
    </div>
  );
}