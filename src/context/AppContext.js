'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Danh sách hành vi xanh mặc định
const DEFAULT_GREEN_ACTIONS = [
  { id: 1, text: 'Mang chai nước cá nhân', completed: false },
  { id: 2, text: 'Tắt điện khi ra khỏi phòng', completed: false },
  { id: 3, text: 'Phân loại rác đúng cách', completed: false },
  { id: 4, text: 'Không dùng ống hút nhựa', completed: false },
  { id: 5, text: 'Đi học bằng xe đạp/đi bộ', completed: false },
];

// Badge levels
const BADGES = [
  { id: 1, title: 'Người khởi đầu xanh', points: 10, image: '/images/badges/beginner.svg' },
  { id: 2, title: 'Nhà môi trường nhỏ', points: 30, image: '/images/badges/environment.svg' },
  { id: 3, title: 'Chiến binh xanh', points: 50, image: '/images/badges/warrior.svg' },
];

const AppContext = createContext();

export function AppProvider({ children }) {
  // State cho người dùng
  const [user, setUser] = useState({ name: 'Học Sinh' });
  
  // State cho các hành vi xanh hôm nay
  const [todayActions, setTodayActions] = useState(DEFAULT_GREEN_ACTIONS);
  
  // State cho điểm số
  const [points, setPoints] = useState({
    today: 0,
    week: 0,
    total: 0,
    streak: 0,
  });
  
  // State cho lịch sử điểm
  const [history, setHistory] = useState([]);
  
  // State cho cài đặt
  const [settings, setSettings] = useState({
    reminder: true,
    reminderTime: '18:00',
  });

  // Cập nhật hành vi xanh
  const updateAction = (id, completed) => {
    const newActions = todayActions.map(action => 
      action.id === id ? { ...action, completed } : action
    );
    
    setTodayActions(newActions);
    
    // Cập nhật điểm
    const completedCount = newActions.filter(a => a.completed).length;
    setPoints(prev => ({
      ...prev,
      today: completedCount
    }));
  };
  
  // Lưu lại hành vi xanh
  const saveActions = () => {
    const completedCount = todayActions.filter(a => a.completed).length;
    
    // Cập nhật tổng điểm và tuần
    setPoints(prev => ({
      ...prev,
      week: prev.week + completedCount,
      total: prev.total + completedCount,
      streak: completedCount > 0 ? prev.streak + 1 : 0,
    }));
    
    // Cập nhật lịch sử
    const today = new Date().toISOString().split('T')[0];
    setHistory(prev => [...prev, { date: today, points: completedCount }]);
    
    // Reset hành vi cho ngày mới
    setTodayActions(DEFAULT_GREEN_ACTIONS);
  };
  
  // Kiểm tra huy hiệu
  const getEarnedBadges = () => {
    return BADGES.filter(badge => points.total >= badge.points);
  };
  
  // Load dữ liệu từ localStorage khi khởi động
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('greenUser');
      const savedPoints = localStorage.getItem('greenPoints');
      const savedHistory = localStorage.getItem('greenHistory');
      const savedSettings = localStorage.getItem('greenSettings');
      
      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedPoints) setPoints(JSON.parse(savedPoints));
      if (savedHistory) setHistory(JSON.parse(savedHistory));
      if (savedSettings) setSettings(JSON.parse(savedSettings));
    }
  }, []);
  
  // Lưu dữ liệu vào localStorage khi có thay đổi
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('greenUser', JSON.stringify(user));
      localStorage.setItem('greenPoints', JSON.stringify(points));
      localStorage.setItem('greenHistory', JSON.stringify(history));
      localStorage.setItem('greenSettings', JSON.stringify(settings));
    }
  }, [user, points, history, settings]);
  
  const value = {
    user,
    setUser,
    todayActions,
    setTodayActions,
    updateAction,
    points,
    history,
    settings,
    setSettings,
    saveActions,
    getEarnedBadges,
    BADGES,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}