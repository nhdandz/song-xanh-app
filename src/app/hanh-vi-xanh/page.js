'use client';

import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import ActionCard from '@/components/ActionCard';

export default function GreenActions() {
  const router = useRouter();
  const { todayActions, updateAction, saveActions } = useAppContext();
  
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
    </div>
  );
}