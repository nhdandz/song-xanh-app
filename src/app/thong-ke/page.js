'use client';

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import GreenChart from '@/components/GreenChart';
import ShareAchievement from '@/components/ShareAchievement';
import { FaShareAlt, FaChartBar, FaFire, FaLeaf } from 'react-icons/fa';

export default function Statistics() {
  const { history, points } = useAppContext();
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Lấy dữ liệu của 7 ngày gần nhất
  const recentHistory = [...history].slice(-7);
  
  // Tính tổng số hành vi xanh đã ghi nhận
  const totalGreenActions = points.total;
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-paper rounded-card border border-line p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-indigo-400 opacity-10 rounded-full blur-2xl"></div>
        <div className="relative flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center mr-4">
            <FaChartBar className="text-purple-600 text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-ink">
              Thống kê
            </h1>
            <p className="text-sm text-ink-soft mt-1">
              Theo dõi tiến độ và tác động môi trường của bạn
            </p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-paper rounded-card border border-line p-6 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-blue-400 to-cyan-400 opacity-5 rounded-full blur-3xl"></div>
        <h2 className="text-lg font-medium text-ink mb-4 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center mr-2">
            <FaChartBar className="text-sky text-sm" />
          </div>
          Điểm số 7 ngày gần nhất
        </h2>
        <div className="h-64 relative">
          <GreenChart data={recentHistory} />
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-paper rounded-card border border-line p-6 relative overflow-hidden group transition-shadow">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-400 to-red-400 opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity"></div>
          <div className="relative">
            <div className="flex items-center text-sm text-ink-soft mb-2">
              <FaFire className="text-orange-500 mr-2" />
              Chuỗi ngày liên tiếp
            </div>
            <div className="text-3xl font-semibold text-ink">{points.streak}</div>
            <div className="text-xs text-ink-faint mt-1">ngày thực hiện liên tục</div>
          </div>
        </div>

        <div className="bg-paper rounded-card border border-line p-6 relative overflow-hidden group transition-shadow">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-400 opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity"></div>
          <div className="relative">
            <div className="flex items-center text-sm text-ink-soft mb-2">
              <FaLeaf className="text-green-500 mr-2" />
              Tổng hành động
            </div>
            <div className="text-3xl font-semibold text-ink">{totalGreenActions}</div>
            <div className="text-xs text-ink-faint mt-1">hành động đã thực hiện</div>
          </div>
        </div>
      </div>

      {/* Environmental Impact */}
      <div className="bg-paper rounded-card border border-line p-6 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-green-400 to-teal-400 opacity-5 rounded-full blur-3xl"></div>
        <h2 className="text-lg font-medium text-ink mb-4 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center mr-2">
            <FaLeaf className="text-brand text-sm" />
          </div>
          Tác động môi trường
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-line">
            <span className="text-sm text-ink-soft flex items-center">
              <span className="w-2 h-2 bg-brand-bright rounded-full mr-2"></span>
              Tương đương trồng cây
            </span>
            <span className="text-base font-medium text-ink">{Math.floor(totalGreenActions / 10)} cây</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-line">
            <span className="text-sm text-ink-soft flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              Giảm rác thải nhựa
            </span>
            <span className="text-base font-medium text-ink">{totalGreenActions * 2} món</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-ink-soft flex items-center">
              <span className="w-2 h-2 bg-sun-wash0 rounded-full mr-2"></span>
              Tiết kiệm điện
            </span>
            <span className="text-base font-medium text-ink">{totalGreenActions * 0.5} kWh</span>
          </div>
        </div>
      </div>

      {/* Share Button */}
      <button
        onClick={() => setShowShareModal(true)}
        className="w-full py-3 px-4 bg-paper border border-line text-ink-soft rounded-md font-medium hover:bg-canvas transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
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