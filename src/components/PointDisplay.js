'use client';

export default function PointDisplay({ todayPoints, weekPoints, streak }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-md text-center">
        <p className="text-sm text-gray-500">Hôm nay</p>
        <p className="text-2xl font-bold text-green-600">{todayPoints}</p>
        <p className="text-xs text-gray-400">điểm</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md text-center">
        <p className="text-sm text-gray-500">Tuần này</p>
        <p className="text-2xl font-bold text-green-600">{weekPoints}</p>
        <p className="text-xs text-gray-400">điểm</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md text-center">
        <p className="text-sm text-gray-500">Chuỗi ngày</p>
        <p className="text-2xl font-bold text-green-600">{streak}</p>
        <p className="text-xs text-gray-400">ngày</p>
      </div>
    </div>
  );
}