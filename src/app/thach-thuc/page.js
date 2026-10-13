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
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-ink-soft">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-4xl mx-auto space-y-5">
        <section className="sx-dark sx-enter p-6 sm:p-8">
          <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="sx-chip bg-white/15 text-brand-bright">Nhiệm vụ</span>
              <h1 className="text-2xl sm:text-4xl text-white mt-3">Thách thức &amp; Nhiệm vụ</h1>
              <p className="text-white/70 mt-1.5 text-sm sm:text-base">
                Hoàn thành nhiệm vụ mỗi ngày để nhận điểm xanh.
              </p>
            </div>
            <div className="sm:text-right shrink-0">
              <p className="text-[11px] uppercase tracking-widest font-bold text-brand-bright/90">
                Điểm hiện tại
              </p>
              <p className="sx-figure text-4xl sm:text-5xl text-white mt-1">
                {(user?.points || 0).toLocaleString('vi-VN')}
              </p>
            </div>
          </div>
        </section>

        {dailyMissions.length > 0 && (
          <div className="bg-sun-wash p-6 rounded-card border-[1.5px] border-line">
            <h2 className="text-xl text-sun flex items-center gap-2 mb-4">
              <FaClock className="mr-2" />
              Nhiệm vụ hàng ngày
            </h2>

            <div className="space-y-3">
              {dailyMissions.map((mission) => (
                <div
                  key={mission.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    mission.completed
                      ? 'bg-brand-wash border-brand '
                     : 'bg-paper border-line '
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => completeDailyMission(mission)}
                      disabled={mission.completed || completing === mission.id}
                      className={`w-8 h-8 rounded-full border-3 flex-shrink-0 flex items-center justify-center transition-all ${
                        mission.completed
                          ? 'border-green-500 bg-brand-bright'
                         : 'border-sun hover:border-yellow-500 hover:bg-sun-wash'
                      } ${completing === mission.id ? 'opacity-50' : ''}`}
                    >
                      {mission.completed && <FaCheck className="text-white text-sm" />}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3
                            className={`font-semibold text-lg ${
                              mission.completed ? 'text-ink' : 'text-ink'
                            }`}
                          >
                            {mission.icon} {mission.title}
                          </h3>
                          <p className="text-sm text-ink-soft mt-1">{mission.description}</p>
                          <span className="inline-block mt-2 text-xs bg-gray-200 px-2 py-1 rounded">
                            {mission.category}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-brand">
                            +{mission.points}
                          </span>
                          <p className="text-xs text-ink-faint">điểm</p>
                        </div>
                      </div>

                      {!mission.completed && (
                        <button
                          onClick={() => completeDailyMission(mission)}
                          disabled={completing === mission.id}
                          className="sx-btn sx-btn-sun mt-3 w-full"
                        >
                          {completing === mission.id ? 'Đang xử lý...' : 'Hoàn thành nhiệm vụ'}
                        </button>
                      )}

                      {mission.completed && (
                        <div className="mt-3 text-center text-brand font-medium">
                          <FaCheck className="inline-block mr-1" />
                          Đã hoàn thành hôm nay
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-paper/70 rounded-xl border border-line">
              <p className="text-sm text-ink-soft text-center">
                Nhiệm vụ được làm mới mỗi ngày. Hoàn thành nhiệm vụ hàng ngày để tích lũy điểm xanh!
              </p>
            </div>
          </div>
        )}

        <div className="bg-paper rounded-card p-6">
          <p className="text-center text-ink-soft">
            Tính năng thách thức dài hạn sẽ được cập nhật sớm!
          </p>
        </div>
      </div>
    </div>
  );
}
