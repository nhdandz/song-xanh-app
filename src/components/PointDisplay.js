'use client';

import { FaStar, FaCalendarWeek, FaFire } from 'react-icons/fa';

export default function PointDisplay({ todayPoints, weekPoints, streak }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-400 opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity"></div>
        <div className="relative">
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <FaStar className="text-yellow-500 mr-1" size={12} />
            Hôm nay
          </div>
          <div className="text-2xl font-semibold text-gray-900">{todayPoints}</div>
          <div className="text-xs text-gray-500 mt-1">điểm</div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity"></div>
        <div className="relative">
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <FaCalendarWeek className="text-blue-500 mr-1" size={12} />
            Tuần này
          </div>
          <div className="text-2xl font-semibold text-gray-900">{weekPoints}</div>
          <div className="text-xs text-gray-500 mt-1">điểm</div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400 to-red-400 opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity"></div>
        <div className="relative">
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <FaFire className="text-orange-500 mr-1" size={12} />
            Chuỗi ngày
          </div>
          <div className="text-2xl font-semibold text-gray-900">{streak}</div>
          <div className="text-xs text-gray-500 mt-1">ngày</div>
        </div>
      </div>
    </div>
  );
}