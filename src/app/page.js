'use client';

import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import PointDisplay from '@/components/PointDisplay';
import { useEffect, useRef } from 'react';

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
  <div className="relative min-h-screen flex items-center justify-center bg-green-50 ">
    {/* Ảnh 2 bên */}
    <img
      src="/images/earth.png"
      alt="Earth left"
      className="absolute left-[-60px] top-1/2 transform -translate-y-1/2 w-52 opacity-25 hidden md:block"
    />
    <img
      src="/images/earth.png"
      alt="Earth right"
      className="absolute right-[-60px] top-1/2 transform -translate-y-1/2 w-52 opacity-25 hidden md:block"
    />

    {/* Nội dung chính */}
    <div className="relative z-10 max-w-2xl w-full px-4 space-y-6">
      <div className="p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-green-800">
          Xin chào, {user.name}!
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Hôm nay bạn đã sống xanh chưa?
        </p>

        <button
          onClick={() => router.push('/hanh-vi-xanh')}
          className="mt-4 w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Thực hiện ngay
        </button>
      </div>

      <PointDisplay
        todayPoints={points.today}
        weekPoints={points.week}
        streak={points.streak}
      />

      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-green-800 mb-4">Tác động của bạn</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>CO2 giảm thiểu:</span>
            <span className="font-semibold">{(points.total * 0.5).toFixed(1)} kg</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Nước tiết kiệm:</span>
            <span className="font-semibold">{points.total * 10} lít</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Nhựa không sử dụng:</span>
            <span className="font-semibold">{points.total * 2} cái</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

}