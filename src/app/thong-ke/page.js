// 'use client';

// import { useState } from 'react';
// import { useAppContext } from '@/context/AppContext';
// import GreenChart from '@/components/GreenChart';
// import ShareAchievement from '@/components/ShareAchievement';
// import { FaShareAlt, FaChartBar, FaFire, FaLeaf } from 'react-icons/fa';

// export default function Statistics() {
//   const { history, points } = useAppContext();
//   const [showShareModal, setShowShareModal] = useState(false);
  
//   // Lấy dữ liệu của 7 ngày gần nhất
//   const recentHistory = [...history].slice(-7);
  
//   // Tính tổng số hành vi xanh đã ghi nhận
//   const totalGreenActions = points.total;
  
//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
//       {/* Header */}
//       <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
//         <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-indigo-400 opacity-10 rounded-full blur-2xl"></div>
//         <div className="relative flex items-center">
//           <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center mr-4">
//             <FaChartBar className="text-purple-600 text-xl" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-900">
//               Thống kê
//             </h1>
//             <p className="text-sm text-gray-600 mt-1">
//               Theo dõi tiến độ và tác động môi trường của bạn
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Chart Section */}
//       <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
//         <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-blue-400 to-cyan-400 opacity-5 rounded-full blur-3xl"></div>
//         <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
//           <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center mr-2">
//             <FaChartBar className="text-blue-600 text-sm" />
//           </div>
//           Điểm số 7 ngày gần nhất
//         </h2>
//         <div className="h-64 relative">
//           <GreenChart data={recentHistory} />
//         </div>
//       </div>

//       {/* Statistics Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
//           <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-400 to-red-400 opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity"></div>
//           <div className="relative">
//             <div className="flex items-center text-sm text-gray-600 mb-2">
//               <FaFire className="text-orange-500 mr-2" />
//               Chuỗi ngày liên tiếp
//             </div>
//             <div className="text-3xl font-semibold text-gray-900">{points.streak}</div>
//             <div className="text-xs text-gray-500 mt-1">ngày thực hiện liên tục</div>
//           </div>
//         </div>

//         <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
//           <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-400 opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity"></div>
//           <div className="relative">
//             <div className="flex items-center text-sm text-gray-600 mb-2">
//               <FaLeaf className="text-green-500 mr-2" />
//               Tổng hành động
//             </div>
//             <div className="text-3xl font-semibold text-gray-900">{totalGreenActions}</div>
//             <div className="text-xs text-gray-500 mt-1">hành động đã thực hiện</div>
//           </div>
//         </div>
//       </div>

//       {/* Environmental Impact */}
//       <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
//         <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-green-400 to-teal-400 opacity-5 rounded-full blur-3xl"></div>
//         <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
//           <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center mr-2">
//             <FaLeaf className="text-green-600 text-sm" />
//           </div>
//           Tác động môi trường
//         </h2>
//         <div className="space-y-4">
//           <div className="flex justify-between items-center pb-3 border-b border-gray-200">
//             <span className="text-sm text-gray-700 flex items-center">
//               <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
//               Tương đương trồng cây
//             </span>
//             <span className="text-base font-medium text-gray-900">{Math.floor(totalGreenActions / 10)} cây</span>
//           </div>
//           <div className="flex justify-between items-center pb-3 border-b border-gray-200">
//             <span className="text-sm text-gray-700 flex items-center">
//               <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
//               Giảm rác thải nhựa
//             </span>
//             <span className="text-base font-medium text-gray-900">{totalGreenActions * 2} món</span>
//           </div>
//           <div className="flex justify-between items-center">
//             <span className="text-sm text-gray-700 flex items-center">
//               <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
//               Tiết kiệm điện
//             </span>
//             <span className="text-base font-medium text-gray-900">{totalGreenActions * 0.5} kWh</span>
//           </div>
//         </div>
//       </div>

      // {/* Share Button */}
      // <button
      //   onClick={() => setShowShareModal(true)}
      //   className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      // >
      //   <FaShareAlt className="mr-2" />
      //   Chia sẻ thành tích
      // </button>

      // {showShareModal && (
      //   <ShareAchievement onClose={() => setShowShareModal(false)} />
      // )}
//     </div>
//   );
// }
'use client';

import { useState, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import GreenChart from '@/components/GreenChart';
import ShareAchievement from '@/components/ShareAchievement';
import { FaShareAlt, FaChartBar, FaFire, FaLeaf } from 'react-icons/fa';

export default function ThongKePage() {
  const {
    history: recentHistory = [],
    points = {},
    totalGreenActions = 0,
  } = useAppContext();

  const [showShareModal, setShowShareModal] = useState(false);

  // formatLabel: chuyển ISO -> DD/MM
  const formatLabel = (dateStr) => {
    if (!dateStr) return '-';
    if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [yyyy, mm, dd] = dateStr.split('-');
      return `${dd}/${mm}`;
    }
    const d = new Date(dateStr);
    if (isNaN(d)) return '-';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}`;
  };

  // Tạo chartData chuẩn từ lịch sử 7 ngày gần nhất
  const chartData = useMemo(() => {
    const src = Array.isArray(recentHistory) ? recentHistory : [];
    const map = new Map();

    const toLocalISODate = (raw) => {
      if (!raw && raw !== 0) return '';
      if (raw instanceof Date && !isNaN(raw)) {
        const yyyy = raw.getFullYear();
        const mm = String(raw.getMonth() + 1).padStart(2, '0');
        const dd = String(raw.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      }
      if (typeof raw === 'number') {
        const d = new Date(raw);
        if (!isNaN(d)) {
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          return `${yyyy}-${mm}-${dd}`;
        }
        return '';
      }
      if (typeof raw === 'string') {
        if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
        const d = new Date(raw);
        if (!isNaN(d)) {
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          return `${yyyy}-${mm}-${dd}`;
        }
        return '';
      }
      return '';
    };

    src.forEach((item) => {
      const rawDate = item?.date ?? item?.dateString ?? item?.createdAt ?? item?.day ?? '';
      const iso = toLocalISODate(rawDate);
      const rawValue = item?.points ?? item?.totalPoints ?? item?.value ?? item?.score ?? 0;
      const num = Number(rawValue);
      if (iso) {
        const prev = map.get(iso) ?? 0;
        map.set(iso, prev + (Number.isFinite(num) ? num : 0));
      }
    });

    // Tạo 7 ngày gần nhất
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const dt = new Date(today);
      dt.setDate(today.getDate() - i);
      const yyyy = dt.getFullYear();
      const mm = String(dt.getMonth() + 1).padStart(2, '0');
      const dd = String(dt.getDate()).padStart(2, '0');
      const iso = `${yyyy}-${mm}-${dd}`;
      const label = `${dd}/${mm}`;
      const value = map.get(iso) ?? 0;
      days.push({ iso, label, value });
    }

    console.groupCollapsed('[DEBUG] chartData');
    console.table(days);
    console.groupEnd();

    return days;
  }, [recentHistory]);

  // ✅ mapping sang dạng GreenChart hiểu (Date object + number)
  const chartDataForGreenChart = useMemo(() => {
    const mapped = chartData.map((d) => ({
      x: new Date(d.iso),
      y: Number(d.value || 0),
      label: d.label,
    }));
    console.log('chartDataForGreenChart', mapped);
    return mapped;
  }, [chartData]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-indigo-400 opacity-10 rounded-full blur-2xl"></div>
        <div className="relative flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center mr-4">
            <FaChartBar className="text-purple-600 text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Thống kê</h1>
            <p className="text-sm text-gray-600 mt-1">
              Theo dõi tiến độ và tác động môi trường của bạn
            </p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-blue-400 to-cyan-400 opacity-5 rounded-full blur-3xl"></div>
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center mr-2">
            <FaChartBar className="text-blue-600 text-sm" />
          </div>
          Điểm số 7 ngày gần nhất
        </h2>
        <div className="h-64 relative">
          <GreenChart data={chartDataForGreenChart} />
        </div>
      </div>

       {/* Statistics Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
           <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-400 to-red-400 opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity"></div>
           <div className="relative">
             <div className="flex items-center text-sm text-gray-600 mb-2">
               <FaFire className="text-orange-500 mr-2" />
               Chuỗi ngày liên tiếp
             </div>
             <div className="text-3xl font-semibold text-gray-900">{points.streak}</div>
             <div className="text-xs text-gray-500 mt-1">ngày thực hiện liên tục</div>
           </div>
         </div>

         <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
           <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-400 opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity"></div>
           <div className="relative">
             <div className="flex items-center text-sm text-gray-600 mb-2">
               <FaLeaf className="text-green-500 mr-2" />
               Tổng hành động
             </div>
             <div className="text-3xl font-semibold text-gray-900">{totalGreenActions}</div>
             <div className="text-xs text-gray-500 mt-1">hành động đã thực hiện</div>
           </div>
         </div>
       </div>  

      {/* Share Button */}
      <button
        onClick={() => setShowShareModal(true)}
        className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
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
