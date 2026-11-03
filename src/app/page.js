'use client';

import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import PointDisplay from '@/components/PointDisplay';
import { USER_FEATURES } from '@/lib/app-config';
import { FaLeaf, FaArrowRight, FaGamepad, FaCamera } from 'react-icons/fa';

// Màu và icon cho ba nội dung chính của ứng dụng
const FEATURE_STYLE = {
  '/hanh-vi-xanh': { icon: FaLeaf, tint: 'bg-brand-wash', ink: 'text-brand' },
  '/quet-ma': { icon: FaCamera, tint: 'bg-sky-wash', ink: 'text-sky' },
  '/tro-choi': { icon: FaGamepad, tint: 'bg-grape-wash', ink: 'text-grape' },
};

export default function Home() {
  const { user, points } = useAppContext();

  const total = user?.points ?? 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-5">
      {/* ---------- Khối chào mừng ---------- */}
      <section className="sx-dark sx-enter p-6 sm:p-8">
        <div className="relative min-w-0">
          <span className="sx-chip bg-white/15 text-brand-bright">
            <FaLeaf size={11} />
            {user?.level || 'Người khởi đầu xanh'}
          </span>

          <h1 className="text-2xl sm:text-4xl text-white mt-3">
            Xin chào, {user?.name || 'bạn'}!
          </h1>
          <p className="text-white/70 mt-1.5 text-sm sm:text-base">
            Hôm nay bạn muốn làm gì?
          </p>
        </div>
      </section>

      {/* ---------- Ba chỉ số ---------- */}
      <PointDisplay
        todayPoints={points.today}
        sumPoints={total}
        streak={points.streak}
      />

      {/* ---------- Ba nội dung chính ---------- */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {USER_FEATURES.map((item, i) => {
          const style = FEATURE_STYLE[item.path] ?? {
            icon: FaLeaf,
            tint: 'bg-brand-wash',
            ink: 'text-brand',
          };
          const Icon = style.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className="sx-card sx-tap sx-enter p-5 flex items-center gap-3.5"
              style={{ animationDelay: `${180 + i * 60}ms` }}
            >
              <span
                className={`flex items-center justify-center w-12 h-12 rounded-xl ${style.tint} ${style.ink} shrink-0`}
              >
                <Icon size={20} />
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
    </div>
  );
}
