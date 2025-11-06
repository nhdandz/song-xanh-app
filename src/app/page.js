'use client';

import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import PointDisplay from '@/components/PointDisplay';
import { useEffect, useRef } from 'react';
import { FaLeaf, FaChartBar } from 'react-icons/fa';

export default function Home() {
  const router = useRouter();
  const { user, points } = useAppContext();
  const dataLoadedRef = useRef(false);
  
  // return (
  //   <div className="space-y-6">
  //     <div className="p-6 bg-white rounded-lg shadow-md">
  //       <h1 className="text-2xl font-bold text-green-800">
  //         Xin chào, {user.name}!
  //       </h1>
  //       <p className="mt-2 text-lg text-gray-600">
  //         Hôm nay bạn đã sống xanh chưa?
  //       </p>
        
  //       <button
  //         onClick={() => router.push('/hanh-vi-xanh')}
  //         className="mt-4 w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
  //       >
  //         Thực hiện ngay
  //       </button>
  //     </div>
      
  //     <PointDisplay 
  //       todayPoints={points.today}
  //       weekPoints={points.week}
  //       streak={points.streak}
  //     />
      
  //     <div className="p-6 bg-white rounded-lg shadow-md">
  //       <h2 className="text-xl font-bold text-green-800 mb-4">Tác động của bạn</h2>
  //       <div className="space-y-3">
  //         <div className="flex justify-between items-center">
  //           <span>CO2 giảm thiểu:</span>
  //           <span className="font-semibold">{(points.total * 0.5).toFixed(1)} kg</span>
  //         </div>
  //         <div className="flex justify-between items-center">
  //           <span>Nước tiết kiệm:</span>
  //           <span className="font-semibold">{points.total * 10} lít</span>
  //         </div>
  //         <div className="flex justify-between items-center">
  //           <span>Nhựa không sử dụng:</span>
  //           <span className="font-semibold">{points.total * 2} cái</span>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
  <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 relative">
    {/* Header Section */}
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-400 opacity-10 rounded-full blur-2xl"></div>

      <div className="relative flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Xin chào, {user.name}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Hôm nay bạn đã sống xanh chưa?
          </p>
        </div>
        {/* Decorative leaf icon */}
        <div className="hidden md:block w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
          <FaLeaf className="text-green-600 text-2xl" />
        </div>
      </div>

      <button
        onClick={() => router.push('/hanh-vi-xanh')}
        className="relative w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
      >
        <span className="relative z-10">Ghi nhận hành động xanh</span>
      </button>
    </div>

    <PointDisplay
      todayPoints={points.today}
      weekPoints={points.week}
      streak={points.streak}
    />

    {/* Environmental Impact Section */}
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-emerald-400 to-green-400 opacity-5 rounded-full blur-2xl"></div>

      <div className="relative">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center mr-3">
            <FaChartBar className="text-green-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Tác động môi trường</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg bg-gradient-to-br from-white to-green-50/50 hover:shadow-md transition-shadow">
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              CO₂ giảm thiểu
            </div>
            <div className="text-2xl font-semibold text-gray-900">{(points.total * 0.5).toFixed(1)} kg</div>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg bg-gradient-to-br from-white to-blue-50/50 hover:shadow-md transition-shadow">
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Nước tiết kiệm
            </div>
            <div className="text-2xl font-semibold text-gray-900">{points.total * 10} lít</div>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg bg-gradient-to-br from-white to-amber-50/50 hover:shadow-md transition-shadow">
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
              Nhựa giảm
            </div>
            <div className="text-2xl font-semibold text-gray-900">{points.total * 2} cái</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

}