'use client';

import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import ActionCard from '@/components/ActionCard';
import { useEffect } from 'react';

export default function GreenActions() {
  const router = useRouter();
  const { todayActions, updateAction, saveActions, fetchGreenActivities, isAuthenticated } = useAppContext();
  
  // Thêm useEffect để lấy danh sách hành động xanh khi component được load
  useEffect(() => {
    if (isAuthenticated) {
      fetchGreenActivities();
    }
  }, [isAuthenticated, fetchGreenActivities]);
  
  const handleSave = () => {
    saveActions();
    router.push('/');
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">
          Hành vi xanh hôm nay
        </h1>
        <p className="text-gray-600 mt-1">
          Hãy tích chọn những hành vi bạn đã thực hiện
        </p>
      </div>
      
      {todayActions.length === 0 ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách hành động...</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {todayActions.map(action => (
              <ActionCard
                key={action.id}
                action={action}
                onChange={(completed) => updateAction(action.id, completed)}
              />
            ))}
          </div>
          
          <button
            onClick={handleSave}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Lưu lại
          </button>
        </>
      )}
    </div>
  );
}