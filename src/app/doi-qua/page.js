'use client';

import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';

const emojiFallback = {
  'Văn phòng phẩm': '✏️',
  'Đồ dùng': '🎒',
  'Cây xanh': '🌱',
  'Voucher': '🎟️'
};

function RewardMedia({ reward }) {
  const [imgError, setImgError] = useState(false);

  // fallback khi không có image hoặc load lỗi
  if (!reward?.image || imgError) {
    return (
      <div className="h-44 bg-brand-wash flex items-center justify-center text-6xl">
        {emojiFallback[reward.category] || '🎁'}
      </div>
    );
  }

  return (
    <div className="h-44 bg-canvas flex items-center justify-center overflow-hidden">
      <img
        src={reward.image}
        alt={reward.title || 'reward'}
        loading="lazy"
        onError={() => setImgError(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export default function RewardsPage() {
  const { user, isAuthenticated } = useAppContext();
  const [rewards, setRewards] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(null);

  const categories = ['all', 'Văn phòng phẩm', 'Đồ dùng', 'Cây xanh', 'Voucher', 'Dụng cụ học tập'];

  useEffect(() => {
    // load lại khi user thay đổi
    fetchRewards();
    if (user?.id) {
      fetchRedemptions();
    } else {
      setRedemptions([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAuthenticated]);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/rewards');
      const data = await response.json();
      setRewards(data || []);
    } catch (error) {
      console.error('Error fetching rewards:', error);
      setRewards([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRedemptions = async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`/api/rewards/redemptions?userId=${user.id}`);
      const data = await response.json();
      setRedemptions(data || []);
    } catch (error) {
      console.error('Error fetching redemptions:', error);
      setRedemptions([]);
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

      // cập nhật dữ liệu trên UI
      await fetchRewards();
      await fetchRedemptions();

      // nếu bạn vẫn muốn reload toàn trang (giữ hành vi cũ)
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
      <div className="max-w-6xl mx-auto px-4 py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-line border-t-brand mx-auto" />
          <p className="mt-4 text-ink-soft font-medium">Đang tải quà...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user?.id) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="sx-card p-8 text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl text-ink mb-2">Vui lòng đăng nhập</h2>
          <p className="text-ink-soft mb-6">Bạn cần đăng nhập để xem và đổi quà.</p>
          <a href="/dang-nhap" className="sx-btn sx-btn-primary">
            Đăng nhập ngay
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-5">
      {/* Khối điểm hiện có */}
      <section className="sx-dark sx-enter p-6 sm:p-8">
        <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="sx-chip bg-white/15 text-brand-bright">Đổi quà</span>
            <h1 className="text-2xl sm:text-4xl text-white mt-3">Đổi điểm lấy quà</h1>
            <p className="text-white/70 mt-1.5 text-sm sm:text-base">
              Tích điểm từ hành động xanh và trò chơi để đổi phần quà bạn thích.
            </p>
          </div>
          <div className="sm:text-right shrink-0">
            <p className="text-[11px] uppercase tracking-widest font-bold text-brand-bright/90">
              Điểm hiện có
            </p>
            <p className="sx-figure text-4xl sm:text-5xl text-white mt-1">
              {(user?.points || 0).toLocaleString('vi-VN')}
            </p>
          </div>
        </div>
      </section>

      {/* Lọc theo danh mục */}
      <div className="sx-scroll-x -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2 w-max">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-pill font-bold text-sm whitespace-nowrap border-[1.5px] transition-colors ${
                selectedCategory === cat
                  ? 'bg-brand text-white border-brand'
                 : 'bg-paper text-ink-soft border-line hover:border-brand hover:text-brand'
              }`}
            >
              {cat === 'all' ? 'Tất cả' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Danh sách quà */}
      {filteredRewards.length === 0 ? (
        <div className="sx-card p-12 text-center">
          <p className="text-4xl mb-3">🎁</p>
          <p className="font-bold text-ink">Chưa có quà trong mục này</p>
          <p className="text-sm text-ink-soft mt-1">Hãy thử chọn danh mục khác nhé.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRewards.map((reward, i) => {
            const canAfford = user && user.points >= reward.points;
            const isAvailable = reward.available && reward.stock > 0;
            const lowStock = reward.stock > 0 && reward.stock <= 5;

            return (
              <article
                key={reward.id}
                className="sx-card sx-enter overflow-hidden flex flex-col"
                style={{ animationDelay: `${Math.min(i, 9) * 50}ms` }}
              >
                <div className="relative">
                  <RewardMedia reward={reward} />
                  <span className="absolute top-3 left-3 sx-chip bg-white/95 text-ink-soft shadow-sm">
                    {reward.category}
                  </span>
                  {lowStock && (
                    <span className="absolute top-3 right-3 sx-chip bg-coral text-white shadow-sm">
                      Sắp hết
                    </span>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-extrabold text-ink leading-tight">{reward.title}</h3>
                  <p className="text-sm text-ink-soft mt-1 leading-snug line-clamp-2">
                    {reward.description}
                  </p>

                  <div className="flex items-end justify-between gap-2 mt-4 mb-3">
                    <p className="sx-figure text-2xl text-brand">
                      {reward.points}
                      <span className="text-xs font-semibold text-ink-faint ml-1 tracking-normal">
                        điểm
                      </span>
                    </p>
                    <p className="text-xs font-semibold text-ink-faint">
                      Còn {reward.stock}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford || !isAvailable || redeeming === reward.id}
                    className={`sx-btn w-full mt-auto ${
                      canAfford && isAvailable ? 'sx-btn-primary' : 'sx-btn-outline'
                    }`}
                  >
                    {redeeming === reward.id
                      ? 'Đang xử lý...'
                      : !isAvailable
                      ? 'Hết hàng'
                      : !canAfford
                      ? `Còn thiếu ${reward.points - (user?.points || 0)} điểm`
                      : 'Đổi quà'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Lịch sử đổi quà */}
      {redemptions.length > 0 && (
        <section className="sx-card p-5 sm:p-6">
          <h2 className="text-lg sm:text-xl text-ink mb-4">Lịch sử đổi quà</h2>
          <div className="space-y-2.5">
            {redemptions.map((redemption) => {
              const status = redemption.status;
              const tone =
                status === 'pending'
                  ? 'bg-sun-wash text-sun'
                  : status === 'approved'
                  ? 'bg-brand-wash text-brand'
                 : 'bg-coral-wash text-coral';

              return (
                <div
                  key={redemption.id}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-canvas border border-line"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-ink truncate">{redemption.reward.title}</p>
                    <p className="text-xs text-ink-faint mt-0.5">
                      {new Date(redemption.redeemedAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-extrabold text-ink">-{redemption.pointsUsed} điểm</p>
                    <span className={`sx-chip mt-1 ${tone}`}>
                      {status === 'pending'
                        ? 'Đang xử lý'
                        : status === 'approved'
                        ? 'Đã duyệt'
                       : 'Đã hủy'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
