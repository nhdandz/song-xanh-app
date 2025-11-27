'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function RewardsPage() {
  const { user, isAuthenticated } = useAppContext();
  const [rewards, setRewards] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(null);

  const categories = ['all', 'Văn phòng phẩm', 'Đồ dùng', 'Cây xanh', 'Voucher'];

  useEffect(() => {
    console.log('User in RewardsPage:', user);
    console.log('isAuthenticated:', isAuthenticated);
    fetchRewards();
    if (user?.id) {
      fetchRedemptions();
    }
  }, [user, isAuthenticated]);

  const fetchRewards = async () => {
    try {
      const response = await fetch('/api/rewards');
      const data = await response.json();
      setRewards(data);
    } catch (error) {
      console.error('Error fetching rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRedemptions = async () => {
    try {
      const response = await fetch(`/api/rewards/redemptions?userId=${user.id}`);
      const data = await response.json();
      setRedemptions(data);
    } catch (error) {
      console.error('Error fetching redemptions:', error);
    }
  };

  const handleRedeem = async (reward) => {
    if (!user?.id) {
      alert('Vui lòng đăng nhập để đổi quà');
      return;
    }

    if (user.points < reward.points) {
      alert('Bạn không đủ điểm để đổi quà này');
      return;
    }

    if (!reward.available || reward.stock <= 0) {
      alert('Quà này hiện đã hết hàng');
      return;
    }

    const confirmed = confirm(
      `Bạn có chắc muốn đổi ${reward.title} với ${reward.points} điểm?`
    );

    if (!confirmed) return;

    setRedeeming(reward.id);

    try {
      const response = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          rewardId: reward.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to redeem reward');
      }

      alert('Đổi quà thành công! Giáo viên sẽ liên hệ với bạn sớm.');

      fetchRewards();
      fetchRedemptions();

      window.location.reload();
    } catch (error) {
      console.error('Error redeeming reward:', error);
      alert(error.message || 'Có lỗi xảy ra khi đổi quà');
    } finally {
      setRedeeming(null);
    }
  };

  const filteredRewards = rewards.filter(
    (r) => selectedCategory === 'all' || r.category === selectedCategory
  );

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

  if (!isAuthenticated || !user?.id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Vui lòng đăng nhập</h2>
          <p className="text-gray-600 mb-6">
            Bạn cần đăng nhập để xem và đổi quà
          </p>
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Đăng nhập ngay
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Đổi Quà</h1>
          <p className="text-gray-600 mb-4">
            Sử dụng điểm xanh của bạn để đổi lấy các phần quà thú vị
          </p>
          <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl p-4">
            <p className="text-sm opacity-90">Điểm hiện tại của bạn</p>
            <p className="text-4xl font-bold">{user?.points || 0} điểm</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? 'Tất cả' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredRewards.map((reward) => {
            const canAfford = user && user.points >= reward.points;
            const isAvailable = reward.available && reward.stock > 0;

            return (
              <div
                key={reward.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center text-6xl">
                  {reward.category === 'Văn phòng phẩm' && '✏️'}
                  {reward.category === 'Đồ dùng' && '🎒'}
                  {reward.category === 'Cây xanh' && '🌱'}
                  {reward.category === 'Voucher' && '🎟️'}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{reward.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{reward.description}</p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">Danh mục</span>
                    <span className="text-sm font-medium">{reward.category}</span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">Còn lại</span>
                    <span className={`text-sm font-medium ${reward.stock <= 5 ? 'text-red-600' : 'text-green-600'}`}>
                      {reward.stock} quà
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-green-600">
                      {reward.points} điểm
                    </span>
                  </div>

                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford || !isAvailable || redeeming === reward.id}
                    className={`w-full py-3 rounded-lg font-medium transition-all ${
                      canAfford && isAvailable && redeeming !== reward.id
                        ? 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {redeeming === reward.id
                      ? 'Đang xử lý...'
                      : !isAvailable
                      ? 'Hết hàng'
                      : !canAfford
                      ? 'Không đủ điểm'
                      : 'Đổi quà'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {redemptions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Lịch sử đổi quà</h2>
            <div className="space-y-3">
              {redemptions.map((redemption) => (
                <div
                  key={redemption.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{redemption.reward.title}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(redemption.redeemedAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">-{redemption.pointsUsed} điểm</p>
                    <p className={`text-sm ${
                      redemption.status === 'pending' ? 'text-yellow-600' :
                      redemption.status === 'approved' ? 'text-green-600' :
                      'text-red-600'
                    }`}>
                      {redemption.status === 'pending' ? 'Đang xử lý' :
                       redemption.status === 'approved' ? 'Đã duyệt' : 'Đã hủy'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
