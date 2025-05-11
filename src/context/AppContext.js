'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Danh sách hành vi xanh mặc định (dùng làm fallback khi không thể kết nối API)
const DEFAULT_GREEN_ACTIONS = [
  { id: '1', text: 'Mang chai nước cá nhân', completed: false },
  { id: '2', text: 'Tắt điện khi ra khỏi phòng', completed: false },
  { id: '3', text: 'Phân loại rác đúng cách', completed: false },
  { id: '4', text: 'Không dùng ống hút nhựa', completed: false },
  { id: '5', text: 'Đi học bằng xe đạp/đi bộ', completed: false },
];

// Badge levels
const BADGES = [
  { id: '1', title: 'Người khởi đầu xanh', points: 10, image: '/images/badges/beginner.svg' },
  { id: '2', title: 'Nhà môi trường nhỏ', points: 30, image: '/images/badges/environment.svg' },
  { id: '3', title: 'Chiến binh xanh', points: 50, image: '/images/badges/warrior.svg' },
];

const AppContext = createContext();

export function AppProvider({ children }) {
  const router = useRouter();
  const activitiesLoadedRef = useRef(false);
  const isRedirecting = useRef(false);
  const authCheckedRef = useRef(false);
  
  // State cho người dùng
  const [user, setUser] = useState({ name: 'Học Sinh' });
  
  // State cho các hành vi xanh hôm nay
  const [todayActions, setTodayActions] = useState([]);
  
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
  
  // State cho trạng thái loading
  const [isLoading, setIsLoading] = useState(false);
  
  // State cho ID người dùng
  const [userId, setUserId] = useState(null);
  
  // State cho trạng thái đăng nhập
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Hàm lấy danh sách hoạt động xanh từ API
  const fetchGreenActivities = async () => {
    // Kiểm tra để tránh gọi lại API nhiều lần
    if (activitiesLoadedRef.current) {
      console.log('Activities already loaded, skipping fetch');
      return;
    }
    
    // Kiểm tra userId
    if (!userId) {
      console.log('Cannot fetch activities, no userId available');
      return;
    }
    
    try {
      console.log('Fetching green activities...');
      
      // Đánh dấu đã bắt đầu tải để tránh gọi lại khi đang trong quá trình tải
      activitiesLoadedRef.current = true;
      
      // Truyền userId vào URL để lấy trạng thái đã hoàn thành
      const response = await fetch(`/api/activities?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch green activities');
      }
      
      const activities = await response.json();
      
      // Chuyển đổi dữ liệu về định dạng todayActions
      // Giữ lại trạng thái completed từ server nếu có
      const formattedActivities = activities.map(activity => ({
        id: activity.id,
        text: activity.name,
        completed: Boolean(activity.completed)
      }));
      
      setTodayActions(formattedActivities);
      
      // Cập nhật điểm của ngày hôm nay dựa trên số lượng hoạt động đã hoàn thành
      const completedCount = formattedActivities.filter(a => a.completed).length;
      if (completedCount > 0) {
        setPoints(prev => ({
          ...prev,
          today: completedCount
        }));
      }
      
      console.log('Green activities loaded successfully.');
    } catch (error) {
      console.error('Error fetching green activities:', error);
      // Fallback to default actions if fetch fails
      setTodayActions(DEFAULT_GREEN_ACTIONS);
      // Đặt lại flag để cho phép tải lại nếu có lỗi
      activitiesLoadedRef.current = false;
    }
  };
  // Xóa một hoạt động đã hoàn thành trong ngày
  const deleteActivity = async (activityId) => {
    if (!userId || !activityId) return false;
    
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/user-activities?userId=${userId}&activityId=${activityId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete activity');
      }
      
      const result = await response.json();
      
      // Cập nhật lại điểm
      setPoints(prev => ({
        ...prev,
        total: result.newTotalPoints,
        today: Math.max(0, prev.today - 1) // Giảm số hoạt động hoàn thành ngày hôm nay
      }));
      
      // Cập nhật danh sách hoạt động
      const newActions = todayActions.map(action => 
        action.id === activityId ? { ...action, completed: false } : action
      );
      setTodayActions(newActions);
      
      // Tải lại lịch sử hoạt động
      await fetchUserActivityHistory(userId);
      
      return true;
    } catch (error) {
      console.error('Error deleting activity:', error);
      alert('Có lỗi xảy ra khi xóa hoạt động: ' + error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
 // Hàm khởi tạo người dùng
const initializeUser = async (id) => {
  if (!id) return false;
  
  try {
    setIsLoading(true);
    const response = await fetch(`/api/users/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    const userData = await response.json();
    
    setUser({
      name: userData.name,
      id: userData.id,
      email: userData.email,
      school: userData.school,
      level: userData.level,
    });
    
    setPoints(prev => ({
      ...prev,
      total: userData.points || 0,
    }));
    
    if (userData.settings) {
      setSettings({
        reminder: userData.settings.reminderOn,
        reminderTime: userData.settings.reminderTime,
      });
    }
    
    // Đặt userId để các hàm khác có thể sử dụng
    setUserId(id);
    
    // Khởi tạo lịch sử hoạt động
    await fetchUserActivityHistory(id);
    
    // Đánh dấu đã đăng nhập
    setIsAuthenticated(true);
    
    // Đặt lại biến activitiesLoadedRef để cho phép tải lại danh sách hoạt động
    activitiesLoadedRef.current = false;
    
    // Gọi fetchGreenActivities sau khi đã set userId và isAuthenticated
    await fetchGreenActivities();
    
    return true;
  } catch (error) {
    console.error('Error initializing user:', error);
    logout();
    return false;
  } finally {
    setIsLoading(false);
  }
};
  
  // Hàm đăng nhập
  const login = async (email, password) => {
    if (isLoading) return false;
    
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Đăng nhập thất bại');
      }
      
      const { user } = await response.json();
      
      // Lưu userId vào localStorage
      localStorage.setItem('userId', user.id);
      
      // Khởi tạo dữ liệu người dùng
      const initSuccess = await initializeUser(user.id);
      
      return initSuccess;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Hàm đăng xuất
  const logout = () => {
    // Ngăn chặn đăng xuất khi đang trong quá trình chuyển hướng
    if (isRedirecting.current) return;
    
    // Xóa thông tin người dùng khỏi localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('greenUser');
    localStorage.removeItem('greenPoints');
    localStorage.removeItem('greenHistory');
    localStorage.removeItem('greenSettings');
    
    // Reset state
    setUser({ name: 'Học Sinh' });
    setUserId(null);
    setPoints({
      today: 0,
      week: 0,
      total: 0,
      streak: 0,
    });
    setHistory([]);
    setTodayActions([]);
    setSettings({
      reminder: true,
      reminderTime: '18:00',
    });
    setIsAuthenticated(false);
    
    // Reset flag để cho phép tải lại hoạt động ở lần đăng nhập tiếp theo
    activitiesLoadedRef.current = false;
    
    // Chuyển hướng về trang đăng nhập
    isRedirecting.current = true;
    router.replace('/dang-nhap');
  };
  
  // Lấy lịch sử hoạt động của người dùng
  const fetchUserActivityHistory = async (id) => {
    if (!id) return;
    
    try {
      const response = await fetch(`/api/user-activities?userId=${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch activity history');
      }
      
      const data = await response.json();
      
      // Chuyển đổi dữ liệu cho state history
      const formattedHistory = data.activities.map(day => ({
        date: day.date,
        points: day.totalPoints,
        activities: day.activities
      }));
      
      setHistory(formattedHistory);
      
      // Tính streak
      calculateStreak(formattedHistory);
      
    } catch (error) {
      console.error('Error fetching activity history:', error);
    }
  };
  
  // Tính streak từ lịch sử
  const calculateStreak = (historyData) => {
    if (!historyData || historyData.length === 0) {
      setPoints(prev => ({ ...prev, streak: 0 }));
      return;
    }
    
    // Sắp xếp lịch sử theo thứ tự ngày giảm dần
    const sortedHistory = [...historyData].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let currentDate = new Date(today);
    
    // Kiểm tra xem có hoạt động nào trong ngày hôm nay không
    const todayActivity = sortedHistory.find(item => {
      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);
      return itemDate.getTime() === today.getTime();
    });
    
    if (todayActivity) {
      streak = 1;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    // Tính streak
    for (let i = 0; i < sortedHistory.length; i++) {
      const historyDate = new Date(sortedHistory[i].date);
      historyDate.setHours(0, 0, 0, 0);
      
      if (historyDate.getTime() === currentDate.getTime()) {
        if (todayActivity || i > 0) {
          streak++;
        }
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (historyDate.getTime() < currentDate.getTime()) {
        // Ngày bị bỏ lỡ, streak kết thúc
        break;
      }
    }
    
    setPoints(prev => ({ ...prev, streak }));
  };
  
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
  const saveActions = async () => {
    const completedActions = todayActions.filter(a => a.completed);
    
    if (completedActions.length === 0) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Gửi các hoạt động đã hoàn thành lên server
      const response = await fetch('/api/user-activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          activities: completedActions.map(a => a.id),
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save activities');
      }
      
      const result = await response.json();
      
      // Nếu tất cả các hoạt động đã hoàn thành trước đó, hiển thị thông báo
      if (result.alreadyCompleted) {
        alert('Tất cả các hoạt động này đã được hoàn thành trước đó rồi. Mỗi hoạt động chỉ được tính điểm một lần mỗi ngày.');
        return;
      }
      
      // Cập nhật điểm và trạng thái
      setPoints(prev => ({
        ...prev,
        total: result.newTotalPoints,
        week: prev.week + result.pointsEarned,
        today: 0,
      }));
      
      // Cập nhật lịch sử
      const today = new Date().toISOString().split('T')[0];
      setHistory(prev => [
        { date: today, points: result.pointsEarned },
        ...prev
      ]);
      
      // Cập nhật streak
      setPoints(prev => ({
        ...prev,
        streak: prev.streak + 1,
      }));
      
      // Hiển thị thông báo nếu có cả hoạt động đã thêm và đã bỏ qua
      if (result.activitiesSkipped > 0) {
        alert(`Đã lưu ${result.activitiesAdded} hoạt động mới. ${result.activitiesSkipped} hoạt động đã được hoàn thành trước đó và được bỏ qua.`);
      }
      
      // Reset trạng thái hoàn thành của các hành động
      setTodayActions(prev => prev.map(action => ({
        ...action,
        completed: false
      })));
      
      // Đặt lại flag để cho phép API tải lại danh sách
      activitiesLoadedRef.current = false;
      
      // Tải lại hoạt động để có thông tin mới nhất về tình trạng hoàn thành
      // Chỉ gọi một lần và không sử dụng await để tránh trì hoãn
      setTimeout(() => {
        fetchGreenActivities();
      }, 500);
      
    } catch (error) {
      console.error('Error saving activities:', error);
      alert('Có lỗi xảy ra khi lưu hoạt động: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Kiểm tra huy hiệu
  const getEarnedBadges = () => {
    return BADGES.filter(badge => points.total >= badge.points);
  };
  
  // Kiểm tra người dùng đã đăng nhập chưa
  const checkAuthentication = async () => {
    // Tránh kiểm tra lại nếu đã xác thực
    if (isAuthenticated) return true;
    
    const storedUserId = localStorage.getItem('userId');
    
    if (storedUserId) {
      const success = await initializeUser(storedUserId);
      return success;
    }
    
    return false;
  };
  
  // Kiểm tra trạng thái đăng nhập khi khởi động ứng dụng
  useEffect(() => {
    // Ngăn chặn chạy nhiều lần
    if (authCheckedRef.current) return;
    
    const initAuth = async () => {
      authCheckedRef.current = true;
      
      // Nếu đang điều hướng, bỏ qua
      if (isRedirecting.current) return;
      
      const isLoggedIn = await checkAuthentication();
      
      if (!isLoggedIn) {
        // Nếu đang ở trang khác trang đăng nhập/đăng ký, chuyển về trang đăng nhập
        const currentPath = window.location.pathname;
        if (currentPath !== '/dang-nhap' && currentPath !== '/dang-ky') {
          isRedirecting.current = true;
          router.replace('/dang-nhap');
          // Reset biến isRedirecting sau khi chuyển hướng hoàn tất
          setTimeout(() => {
            isRedirecting.current = false;
          }, 1000);
        } else {
          // Nếu đã ở trang đăng nhập/đăng ký, đánh dấu không còn chuyển hướng
          isRedirecting.current = false;
        }
      } else {
        isRedirecting.current = false;
      }
    };
    
    initAuth();
  }, [router, isAuthenticated]);
  
  // Reset biến isRedirecting khi router thay đổi
  useEffect(() => {
    return () => {
      isRedirecting.current = false;
    };
  }, [router]);
  
  // Load dữ liệu từ localStorage khi khởi động (cho chế độ offline/demo)
  useEffect(() => {
    if (typeof window !== 'undefined' && !isAuthenticated) {
      const savedUser = localStorage.getItem('greenUser');
      const savedPoints = localStorage.getItem('greenPoints');
      const savedHistory = localStorage.getItem('greenHistory');
      const savedSettings = localStorage.getItem('greenSettings');
      
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setUserId(parsedUser.id);
      }
      
      if (savedPoints) setPoints(JSON.parse(savedPoints));
      if (savedHistory) setHistory(JSON.parse(savedHistory));
      if (savedSettings) setSettings(JSON.parse(savedSettings));
    }
  }, [isAuthenticated]);
  
  // Lưu dữ liệu vào localStorage khi có thay đổi (cho chế độ offline/demo)
  useEffect(() => {
    if (typeof window !== 'undefined' && isAuthenticated) {
      localStorage.setItem('greenUser', JSON.stringify(user));
      localStorage.setItem('greenPoints', JSON.stringify(points));
      localStorage.setItem('greenHistory', JSON.stringify(history));
      localStorage.setItem('greenSettings', JSON.stringify(settings));
    }
  }, [user, points, history, settings, isAuthenticated]);
  
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
    isLoading,
    userId,
    setUserId,
    initializeUser,
    isAuthenticated,
    login,
    logout,
    checkAuthentication,
    fetchGreenActivities,
    deleteActivity,
    fetchUserActivityHistory,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}