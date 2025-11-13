'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
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

// Helper: format local date -> YYYY-MM-DD
function formatDateKeyLocal(input) {
  const d = input ? new Date(input) : new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getLast7DateKeys() {
  const arr = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push(formatDateKeyLocal(d));
  }
  return arr;
}

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

  // State cho lịch sử điểm (mảng 7 ngày gần nhất: { date: 'YYYY-MM-DD', points: number, activities: [] })
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

  // ---- Helpers ----
  const ensureSevenDays = useCallback((inputArray = []) => {
    // inputArray: [{date, points, activities}]
    const map = {};
    const keys = getLast7DateKeys();
    keys.forEach(k => { map[k] = { date: k, points: 0, activities: [] }; });

    (inputArray || []).forEach(item => {
      if (!item || !item.date) return;
      const key = formatDateKeyLocal(item.date);
      if (!(key in map)) return; // ignore older/newer than 7-day window
      map[key].points = item.points ?? (item.totalPoints ?? map[key].points ?? 0);
      map[key].activities = item.activities ?? item.activitiesList ?? map[key].activities;
    });

    return keys.map(k => map[k]);
  }, []);

  // Tính streak dựa trên history đã normalized
  const calculateStreak = useCallback((historyData) => {
    if (!historyData || historyData.length === 0) {
      setPoints(prev => ({ ...prev, streak: 0 }));
      return;
    }

    // sắp từ mới -> cũ theo ngày
    const sortedDesc = [...historyData].sort((a, b) => new Date(b.date) - new Date(a.date));

    let streak = 0;
    const today = new Date();
    today.setHours(0,0,0,0);

    let current = new Date(today);

    // nếu hôm nay có hoạt động
    const todayItem = sortedDesc.find(it => formatDateKeyLocal(it.date) === formatDateKeyLocal(today));
    if (todayItem && (todayItem.points || todayItem.activities?.length)) {
      streak = 1;
      current.setDate(current.getDate() - 1);
    }

    for (let i = 0; i < sortedDesc.length; i++) {
      const itemDate = new Date(sortedDesc[i].date);
      itemDate.setHours(0,0,0,0);
      if (itemDate.getTime() === current.getTime()) {
        if (sortedDesc[i].points > 0 || (sortedDesc[i].activities && sortedDesc[i].activities.length > 0)) {
          streak++;
          current.setDate(current.getDate() - 1);
        } else {
          break;
        }
      } else if (itemDate.getTime() < current.getTime()) {
        break; // gap
      }
    }

    setPoints(prev => ({ ...prev, streak }));
  }, []);

  // ---- Data loading / saving ----
  // Lấy danh sách hành vi từ API (todayActions)
  const fetchGreenActivities = useCallback(async () => {
    if (activitiesLoadedRef.current) return;
    if (!userId) return;

    try {
      activitiesLoadedRef.current = true;
      setIsLoading(true);
      const res = await fetch(`/api/activities?userId=${userId}`);
      if (!res.ok) throw new Error('Failed to fetch green activities');
      const activities = await res.json();

      const formatted = (activities || []).map(a => ({
        id: a.id,
        text: a.name ?? a.text ?? 'Hoạt động',
        completed: Boolean(a.completed),
      }));

      setTodayActions(formatted.length ? formatted : DEFAULT_GREEN_ACTIONS);

      // update today's points count
      const completedCount = formatted.filter(a => a.completed).length;
      setPoints(prev => ({ ...prev, today: completedCount }));

      setIsLoading(false);
    } catch (err) {
      console.error('fetchGreenActivities error', err);
      setTodayActions(DEFAULT_GREEN_ACTIONS);
      activitiesLoadedRef.current = false;
      setIsLoading(false);
    }
  }, [userId]);

  // Lấy lịch sử hoạt động user (server trả dữ liệu aggregate theo ngày hoặc raw)
  const fetchUserActivityHistory = useCallback(async (id) => {
    if (!id) return;
    try {
      setIsLoading(true);
      const res = await fetch(`/api/user-activities?userId=${id}`);
      if (!res.ok) throw new Error('Failed to fetch activity history');
      const json = await res.json();

      // Expect json.activities = [{ date: 'YYYY-MM-DD', totalPoints, activities: [...] }, ...]
      const raw = json.activities ?? json.data ?? [];

      const normalized = ensureSevenDays(raw.map(item => ({
        date: item.date,
        points: item.totalPoints ?? item.points ?? item.value ?? 0,
        activities: item.activities ?? item.items ?? [],
      })));

      setHistory(normalized);

      // Update total/week from the aggregated data if available
      const totalSum = normalized.reduce((s, it) => s + (it.points || 0), 0);
      setPoints(prev => ({ ...prev, total: json.totalPoints ?? totalSum }));

      calculateStreak(normalized);

      // persist local copy
      try { localStorage.setItem('greenHistory', JSON.stringify(normalized)); } catch (e) { /* ignore */ }

      setIsLoading(false);
      return normalized;
    } catch (err) {
      console.error('fetchUserActivityHistory error', err);
      // fallback: try localStorage
      try {
        const local = localStorage.getItem('greenHistory');
        if (local) {
          const parsed = JSON.parse(local);
          const normalized = ensureSevenDays(parsed);
          setHistory(normalized);
          calculateStreak(normalized);
          setIsLoading(false);
          return normalized;
        }
      } catch (e) { /* ignore parse errors */ }
      setIsLoading(false);
    }
  }, [ensureSevenDays, calculateStreak]);

  // Lưu các hành động hoàn thành của hôm nay
  const saveActions = useCallback(async () => {
    const completedActions = todayActions.filter(a => a.completed).map(a => a.id);
    if (!userId) { alert('Chưa có userId'); return; }
    if (completedActions.length === 0) return;

    try {
      setIsLoading(true);
      const res = await fetch('/api/user-activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, activities: completedActions }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Save failed');

      // Sau khi save, refetch lịch sử để đảm bảo consistent
      await fetchUserActivityHistory(userId);

      // Cập nhật points từ response nếu server trả
      if (json.newTotalPoints != null || json.pointsEarned != null) {
        setPoints(prev => ({
          ...prev,
          total: json.newTotalPoints ?? prev.total + (json.pointsEarned ?? 0),
          week: prev.week + (json.pointsEarned ?? 0),
          today: 0,
        }));
      } else {
        // nếu server không trả, tính lại từ history
        const localSum = history.reduce((s, it) => s + (it.points || 0), 0);
        setPoints(prev => ({ ...prev, total: localSum, today: 0 }));
      }

      // Reset todayActions completed flags
      setTodayActions(prev => prev.map(a => ({ ...a, completed: false })));

      // allow reloading of activities
      activitiesLoadedRef.current = false;

      setIsLoading(false);

      return { ok: true, data: json };
    } catch (err) {
      console.error('saveActions error', err);
      alert('Lỗi khi lưu hoạt động: ' + (err.message || err));
      setIsLoading(false);
      return { ok: false, error: err.message };
    }
  }, [todayActions, userId, fetchUserActivityHistory, history]);

  // Xóa một activity đã hoàn thành (server side)
  const deleteActivity = useCallback(async (activityId) => {
    if (!userId || !activityId) return false;
    try {
      setIsLoading(true);
      const res = await fetch(`/api/user-activities?userId=${userId}&activityId=${activityId}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Delete failed');

      // refresh history and points
      await fetchUserActivityHistory(userId);
      // also refresh today actions status
      activitiesLoadedRef.current = false;
      fetchGreenActivities();

      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('deleteActivity error', err);
      setIsLoading(false);
      alert('Xóa thất bại: ' + (err.message || ''));
      return false;
    }
  }, [userId, fetchUserActivityHistory, fetchGreenActivities]);

  // Khởi tạo user (lấy profile + history)
  const initializeUser = useCallback(async (id) => {
    if (!id) return false;
    try {
      setIsLoading(true);
      const res = await fetch(`/api/users/${id}`);
      if (!res.ok) throw new Error('Failed to fetch user');
      const userData = await res.json();

      setUser({
        name: userData.name ?? 'Học Sinh',
        id: userData.id,
        email: userData.email,
        school: userData.school,
        level: userData.level,
      });

      setPoints(prev => ({ ...prev, total: userData.points ?? prev.total }));

      if (userData.settings) {
        setSettings({
          reminder: !!userData.settings.reminderOn,
          reminderTime: userData.settings.reminderTime ?? '18:00',
        });
      }

      setUserId(id);
      setIsAuthenticated(true);

      // reload history and activities
      activitiesLoadedRef.current = false;
      await fetchUserActivityHistory(id);
      await fetchGreenActivities();

      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('initializeUser error', err);
      logout();
      setIsLoading(false);
      return false;
    }
  }, [fetchUserActivityHistory, fetchGreenActivities]);

  // Đăng nhập
  const login = useCallback(async (email, password) => {
    if (isLoading) return false;
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Login failed');
      const json = await res.json();
      const { user: u } = json;
      if (!u?.id) throw new Error('No user id from login');

      // store userId locally for session persistence
      try { localStorage.setItem('userId', u.id); } catch (e) { /* ignore */ }

      const ok = await initializeUser(u.id);
      setIsLoading(false);
      return ok;
    } catch (err) {
      console.error('login error', err);
      setIsLoading(false);
      return false;
    }
  }, [initializeUser, isLoading]);

  // Đăng xuất
  const logout = useCallback(() => {
    if (isRedirecting.current) return;
    try { localStorage.removeItem('userId'); localStorage.removeItem('greenUser'); localStorage.removeItem('greenPoints'); localStorage.removeItem('greenHistory'); localStorage.removeItem('greenSettings'); } catch (e) {}
    setUser({ name: 'Học Sinh' });
    setUserId(null);
    setPoints({ today:0, week:0, total:0, streak:0 });
    setHistory([]);
    setTodayActions([]);
    setSettings({ reminder:true, reminderTime:'18:00' });
    setIsAuthenticated(false);
    activitiesLoadedRef.current = false;
    isRedirecting.current = true;
    router.replace('/dang-nhap');
    setTimeout(() => { isRedirecting.current = false; }, 1000);
  }, [router]);

  // Kiểm tra auth on start
  useEffect(() => {
    if (authCheckedRef.current) return;
    authCheckedRef.current = true;

    const init = async () => {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      if (stored) {
        await initializeUser(stored);
        return;
      }
      // nếu chưa login, try load local demo data
      try {
        const localUser = localStorage.getItem('greenUser');
        const localPoints = localStorage.getItem('greenPoints');
        const localHistory = localStorage.getItem('greenHistory');
        const localSettings = localStorage.getItem('greenSettings');
        if (localUser) setUser(JSON.parse(localUser));
        if (localPoints) setPoints(JSON.parse(localPoints));
        if (localHistory) setHistory(ensureSevenDays(JSON.parse(localHistory)));
        if (localSettings) setSettings(JSON.parse(localSettings));
      } catch (e) { /* ignore */ }
    };

    init();
  }, [initializeUser, ensureSevenDays]);

  // Persist to localStorage when changes (only when authenticated or in demo)
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem('greenUser', JSON.stringify(user));
      localStorage.setItem('greenPoints', JSON.stringify(points));
      localStorage.setItem('greenHistory', JSON.stringify(history));
      localStorage.setItem('greenSettings', JSON.stringify(settings));
    } catch (e) { /* noop */ }
  }, [user, points, history, settings]);

  const getEarnedBadges = useCallback(() => BADGES.filter(b => points.total >= b.points), [points.total]);

  // Tính tổng số hành động xanh từ toàn bộ lịch sử
  const totalGreenActions = history.reduce((sum, h) => sum + (h.activities?.length || 0),0);

  const value = {
    user,
    setUser,
    todayActions,
    setTodayActions,
    updateAction: (id, completed) => {
      const newActions = todayActions.map(a => a.id === id ? { ...a, completed } : a);
      setTodayActions(newActions);
      const completedCount = newActions.filter(a => a.completed).length;
      setPoints(prev => ({ ...prev, today: completedCount }));
    },
    points,
    setPoints,
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
    totalGreenActions,
    isAuthenticated,
    login,
    logout,
    checkAuthentication: async () => {
      if (isAuthenticated) return true;
      const stored = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      if (stored) return await initializeUser(stored);
      return false;
    },
    fetchGreenActivities,
    deleteActivity,
    fetchUserActivityHistory,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
