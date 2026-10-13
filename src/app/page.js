'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import PointDisplay from '@/components/PointDisplay';
import { FaLeaf, FaArrowRight, FaGamepad, FaGift, FaTrophy } from 'react-icons/fa';

const IMPACTS = [
  { label: 'CO₂ giảm thiểu', unit: 'kg', tint: 'bg-brand-wash', ink: 'text-brand', factor: 0.5, decimals: 1 },
  { label: 'Nước tiết kiệm', unit: 'lít', tint: 'bg-sky-wash', ink: 'text-sky', factor: 10, decimals: 0 },
  { label: 'Nhựa giảm', unit: 'món', tint: 'bg-sun-wash', ink: 'text-sun', factor: 2, decimals: 0 },
];

const SHORTCUTS = [
  { href: '/tro-choi', label: 'Trò chơi', hint: 'Chơi và tích điểm', icon: FaGamepad, tint: 'bg-grape-wash', ink: 'text-grape' },
  { href: '/thach-thuc', label: 'Thử thách', hint: 'Nhận nhiệm vụ mới', icon: FaTrophy, tint: 'bg-sun-wash', ink: 'text-sun' },
  { href: '/doi-qua', label: 'Đổi quà', hint: 'Dùng điểm đổi quà', icon: FaGift, tint: 'bg-coral-wash', ink: 'text-coral' },
];

export default function Home() {
  const router = useRouter();
  const { user, points, BADGES } = useAppContext();

  const total = user?.points ?? 0;

  // Mốc huy hiệu kế tiếp để học sinh biết còn bao nhiêu điểm nữa
  const ladder = [...(BADGES || [])].sort((a, b) => a.points - b.points);
  const nextBadge = ladder.find((badge) => total < badge.points);
  const prevMark = ladder.filter((badge) => total >= badge.points).pop()?.points ?? 0;
  const progress = nextBadge
    ? Math.min(100, Math.round(((total - prevMark) / (nextBadge.points - prevMark)) * 100))
    : 100;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-5">
      {/* ---------- Khối chào mừng ---------- */}
      <section className="sx-dark sx-enter p-6 sm:p-8">
        <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div className="min-w-0">
            <span className="sx-chip bg-white/15 text-brand-bright">
              <FaLeaf size={11} />
              {user?.level || 'Người khởi đầu xanh'}
            </span>

            <h1 className="text-2xl sm:text-4xl text-white mt-3">
              Xin chào, {user?.name || 'bạn'}!
            </h1>
            <p className="text-white/70 mt-1.5 text-sm sm:text-base">
              Hôm nay bạn đã sống xanh chưa?
            </p>
          </div>

          <button
            onClick={() => router.push('/hanh-vi-xanh')}
            className="sx-btn sx-btn-sun shrink-0 w-full sm:w-auto"
          >
            Ghi nhận hành động
            <FaArrowRight size={13} />
          </button>
        </div>

        {/* Tiến độ tới huy hiệu kế tiếp */}
        {nextBadge && (
          <div className="relative mt-6">
            <div className="flex items-baseline justify-between text-xs mb-2">
              <span className="font-semibold text-white/80">
                Còn{' '}
                <span className="text-brand-bright font-extrabold">
                  {(nextBadge.points - total).toLocaleString('vi-VN')} điểm
                </span>{' '}
                nữa tới
              </span>
              <span className="font-bold text-white/90 truncate ml-3">{nextBadge.title}</span>
            </div>
            <div className="sx-track sx-track-dark">
              <div className="sx-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </section>

      {/* ---------- Ba chỉ số ---------- */}
      <PointDisplay
        todayPoints={points.today}
        sumPoints={total}
        streak={points.streak}
      />

      {/* ---------- Lối tắt ---------- */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {SHORTCUTS.map((item, i) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="sx-card sx-tap sx-enter p-4 flex items-center gap-3.5"
              style={{ animationDelay: `${180 + i * 60}ms` }}
            >
              <span
                className={`flex items-center justify-center w-11 h-11 rounded-xl ${item.tint} ${item.ink} shrink-0`}
              >
                <Icon size={18} />
              </span>
              <span className="min-w-0">
                <span className="block font-bold text-ink leading-tight">{item.label}</span>
                <span className="block text-xs text-ink-faint mt-0.5">{item.hint}</span>
              </span>
              <FaArrowRight size={12} className="ml-auto text-ink-faint shrink-0" />
            </Link>
          );
        })}
      </section>

      {/* ---------- Tác động môi trường ---------- */}
      <section className="sx-card sx-enter p-5 sm:p-6" style={{ animationDelay: '360ms' }}>
        <div className="flex items-baseline justify-between gap-3 mb-4">
          <h2 className="text-lg sm:text-xl text-ink">Tác động của bạn</h2>
          <Link
            href="/thong-ke"
            className="text-sm font-bold text-brand hover:underline shrink-0"
          >
            Xem chi tiết
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {IMPACTS.map((impact) => (
            <div
              key={impact.label}
              className={`${impact.tint} rounded-xl p-4 border border-line`}
            >
              <p className="text-xs font-bold text-ink-soft">{impact.label}</p>
              <p className={`sx-figure text-2xl sm:text-3xl mt-1.5 ${impact.ink}`}>
                {(total * impact.factor).toFixed(impact.decimals)}
                <span className="text-xs font-semibold ml-1 tracking-normal opacity-70">
                  {impact.unit}
                </span>
              </p>
            </div>
          ))}
        </div>

        <p className="text-xs text-ink-faint mt-4">
          Ước tính dựa trên tổng điểm xanh bạn đã tích lũy.
        </p>
      </section>
    </div>
  );
}
