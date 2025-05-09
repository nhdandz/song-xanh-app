'use client';

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import GreenChart from '@/components/GreenChart';
import ShareAchievement from '@/components/ShareAchievement';
import { FaShareAlt } from 'react-icons/fa';

export default function Statistics() {
  const { history, points } = useAppContext();
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Lấy dữ liệu của 7 ngày gần nhất
  const recentHistory = [...history].slice(-7);
  
  // Tính tổng số hành vi xanh đã ghi nhận
  const totalGreenActions = points.total;
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">
          Thống kê xanh
        </h1>
        <p className="text-gray-600 mt-1">
          Theo dõi tiến trình sống xanh của bạn
        </p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-green-700 mb-4">
          Điểm xanh 7 ngày gần nhất
        </h2>
        <div className="h-64">
          <GreenChart data={recentHistory} />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <p className="text-sm text-gray-500">Ngày liên tiếp</p>
          <p className="text-3xl font-bold text-green-600">{points.streak}</p>
          <p className="text-xs text-gray-400">ngày sống xanh</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <p className="text-sm text-gray-500">Tổng số</p>
          <p className="text-3xl font-bold text-green-600">{totalGreenActions}</p>
          <p className="text-xs text-gray-400">hành vi xanh</p>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-green-700 mb-3">
          Tác động môi trường
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Tương đương trồng</span>
            <span className="font-semibold">{Math.floor(totalGreenActions / 10)} cây xanh</span>
          </div>
          <div className="flex justify-between">
            <span>Giảm rác thải nhựa</span>
            <span className="font-semibold">{totalGreenActions * 2} món</span>
          </div>
          <div className="flex justify-between">
            <span>Tiết kiệm điện</span>
            <span className="font-semibold">{totalGreenActions * 0.5} kWh</span>
          </div>
        </div>
      </div>
      
      <button
        onClick={() => setShowShareModal(true)}
        className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center"
      >
        <FaShareAlt className="mr-2" />
        Chia sẻ thành tích
      </button>
      
      {showShareModal && (
        <ShareAchievement onClose={() => setShowShareModal(false)} />
      )}
    </div>
  );
}