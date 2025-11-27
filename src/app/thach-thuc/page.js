'use client';

import { useState, useEffect } from 'react';
import { FaFlag, FaTrophy, FaLock, FaCheck, FaClock } from 'react-icons/fa';
import { useAppContext } from '@/context/AppContext';

export default function Challenges() {
  const { user } = useAppContext();
  const [challenges, setChallenges] = useState([]);
  const [dailyMissions, setDailyMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchDailyMissions();
    }
  }, [user]);

  const fetchDailyMissions = async () => {
    try {
      const response = await fetch(`/api/daily-missions?userId=${user.id}`);
      const data = await response.json();
      setDailyMissions(data);
    } catch (error) {
      console.error('Error fetching daily missions:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeDailyMission = async (mission) => {
    if (!user?.id) {
      alert('Vui lòng đăng nhập');
      return;
    }

    if (mission.completed) {
      alert('Bạn đã hoàn thành nhiệm vụ này hôm nay rồi!');
      return;
    }

    setCompleting(mission.id);

    try {
      const response = await fetch('/api/daily-missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          missionId: mission.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete mission');
      }

      alert(`Chúc mừng! Bạn đã nhận ${mission.points} điểm`);

      fetchDailyMissions();

      window.location.reload();
    } catch (error) {
      console.error('Error completing mission:', error);
      alert(error.message || 'Có lỗi xảy ra');
    } finally {
      setCompleting(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6 pb-16">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <h1 className="text-3xl font-bold text-green-800">
            Thách thức & Nhiệm vụ
          </h1>
          <p className="text-gray-600 mt-2">
            Hoàn thành nhiệm vụ hàng ngày để nhận điểm xanh
          </p>
          <div className="mt-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl p-4 inline-block">
            <p className="text-sm opacity-90">Điểm hiện tại</p>
            <p className="text-3xl font-bold">{user?.points || 0} điểm</p>
          </div>
        </div>

        {dailyMissions.length > 0 && (
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl shadow-lg border-2 border-yellow-200">
            <h2 className="font-bold text-2xl text-yellow-800 flex items-center mb-4">
              <FaClock className="mr-2" />
              Nhiệm vụ hàng ngày
            </h2>

            <div className="space-y-3">
              {dailyMissions.map((mission) => (
                <div
                  key={mission.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    mission.completed
                      ? 'bg-green-100 border-green-300 shadow-md'
                      : 'bg-white border-yellow-300 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => completeDailyMission(mission)}
                      disabled={mission.completed || completing === mission.id}
                      className={`w-8 h-8 rounded-full border-3 flex-shrink-0 flex items-center justify-center transition-all ${
                        mission.completed
                          ? 'border-green-500 bg-green-500'
                          : 'border-yellow-400 hover:border-yellow-500 hover:bg-yellow-50'
                      } ${completing === mission.id ? 'opacity-50' : ''}`}
                    >
                      {mission.completed && <FaCheck className="text-white text-sm" />}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3
                            className={`font-semibold text-lg ${
                              mission.completed ? 'text-green-800' : 'text-gray-800'
                            }`}
                          >
                            {mission.icon} {mission.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{mission.description}</p>
                          <span className="inline-block mt-2 text-xs bg-gray-200 px-2 py-1 rounded">
                            {mission.category}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-green-600">
                            +{mission.points}
                          </span>
                          <p className="text-xs text-gray-500">điểm</p>
                        </div>
                      </div>

                      {!mission.completed && (
                        <button
                          onClick={() => completeDailyMission(mission)}
                          disabled={completing === mission.id}
                          className="mt-3 w-full py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all shadow-md disabled:opacity-50"
                        >
                          {completing === mission.id ? 'Đang xử lý...' : 'Hoàn thành nhiệm vụ'}
                        </button>
                      )}

                      {mission.completed && (
                        <div className="mt-3 text-center text-green-700 font-medium">
                          <FaCheck className="inline-block mr-1" />
                          Đã hoàn thành hôm nay
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-white/70 rounded-xl border border-yellow-200">
              <p className="text-sm text-gray-700 text-center">
                Nhiệm vụ được làm mới mỗi ngày. Hoàn thành nhiệm vụ hàng ngày để tích lũy điểm xanh!
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-center text-gray-600">
            Tính năng thách thức dài hạn sẽ được cập nhật sớm!
          </p>
        </div>
      </div>
    </div>
  );
}
