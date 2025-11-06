'use client';

import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import ActionCard from '@/components/ActionCard';
import { useEffect, useRef } from 'react';
import { FaLeaf } from 'react-icons/fa';

export default function GreenActions() {
  const router = useRouter();
  const { todayActions, updateAction, saveActions, fetchGreenActivities, isAuthenticated } = useAppContext();
  // Thêm một ref để đảm bảo fetchGreenActivities chỉ được gọi một lần
  const activitiesFetchedRef = useRef(false);
  
  // Sửa useEffect để ngăn gọi nhiều lần
  useEffect(() => {
    // Chỉ fetch một lần khi component mount và isAuthenticated = true
    if (isAuthenticated && !activitiesFetchedRef.current) {
      console.log('Fetching green activities from page component');
      activitiesFetchedRef.current = true;
      fetchGreenActivities();
    }
  }, [isAuthenticated, fetchGreenActivities]);
  
  const handleSave = () => {
    saveActions();
    router.push('/');
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-400 opacity-10 rounded-full blur-2xl"></div>
        <div className="relative flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mr-4">
            <FaLeaf className="text-green-600 text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Hành động xanh hôm nay
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Đánh dấu những hành động bạn đã thực hiện trong ngày
            </p>
          </div>
        </div>
      </div>

      {todayActions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mb-4"></div>
            <p className="text-gray-600">Đang tải danh sách hành động...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {todayActions.map(action => (
              <ActionCard
                key={action.id}
                action={action}
                onChange={(completed) => updateAction(action.id, completed)}
              />
            ))}
          </div>

          <div className="sticky bottom-20 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4">
            <button
              onClick={handleSave}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              Lưu hành động
            </button>
          </div>
        </>
      )}
    </div>
  );
}