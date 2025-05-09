'use client';

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function Settings() {
  const { user, setUser, settings, setSettings } = useAppContext();
  
  const [name, setName] = useState(user.name);
  const [reminderEnabled, setReminderEnabled] = useState(settings.reminder);
  const [reminderTime, setReminderTime] = useState(settings.reminderTime);
  
  const handleSave = () => {
    setUser({ ...user, name });
    setSettings({
      ...settings,
      reminder: reminderEnabled,
      reminderTime,
    });
    
    alert('Cài đặt đã được lưu thành công!');
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">
          Cài đặt
        </h1>
        <p className="text-gray-600 mt-1">
          Tùy chỉnh ứng dụng của bạn
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Tên của bạn
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-green-700 mb-4">
            Lời nhắc hằng ngày
          </h2>
          
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="reminder"
              className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              checked={reminderEnabled}
              onChange={(e) => setReminderEnabled(e.target.checked)}
            />
            <label htmlFor="reminder" className="ml-2 block text-gray-700">
              Bật lời nhắc hằng ngày
            </label>
          </div>
          
          <div className={reminderEnabled ? '' : 'opacity-50 pointer-events-none'}>
            <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700 mb-1">
              Thời gian nhắc
            </label>
            <input
              type="time"
              id="reminderTime"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              disabled={!reminderEnabled}
            />
            <p className="mt-1 text-sm text-gray-500">
              Mỗi ngày bạn sẽ nhận được lời nhắc: "Đừng quên hành động xanh hôm nay nhé!"
            </p>
          </div>
        </div>
      </div>
      
      <button
        onClick={handleSave}
        className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
      >
        Lưu thay đổi
      </button>
    </div>
  );
}