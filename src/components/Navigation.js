'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import {
  FaHome,
  FaLeaf,
  FaChartBar,
  FaUsers,
  FaBars,
  FaGift,
  FaGamepad,
} from 'react-icons/fa';

const NAV_ITEMS = [
  { path: '/', label: 'Trang chủ', icon: FaHome },
  { path: '/hanh-vi-xanh', label: 'Hành động', icon: FaLeaf },
  { path: '/tro-choi', label: 'Trò chơi', icon: FaGamepad },
  { path: '/thong-ke', label: 'Thống kê', icon: FaChartBar },
  { path: '/so-sanh', label: 'Cộng đồng', icon: FaUsers },
  { path: '/doi-qua', label: 'Đổi quà', icon: FaGift },
];

// Thanh dưới trên mobile chỉ đủ chỗ cho 4 mục + nút menu
const MOBILE_ITEMS = NAV_ITEMS.filter((item) =>
  ['/', '/hanh-vi-xanh', '/tro-choi', '/doi-qua'].includes(item.path)
);

export default function Navigation({ onMenuClick }) {
  const pathname = usePathname();
  const { user } = useAppContext();

  const points = user?.points ?? 0;

  return (
    <>
      {/* ---------------- Sidebar (máy tính) ---------------- */}
      <nav className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-72 bg-paper border-r border-line z-40">
        <div className="p-5">
          <Link href="/" className="flex items-center gap-2.5 mb-6">
            <span className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center shrink-0">
              <FaLeaf className="text-white" size={19} />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-ink">
              Sống Xanh
            </span>
          </Link>

          {/* Thẻ điểm: cho học sinh thấy tiến độ ngay, không phải bấm vào đâu */}
          <Link
            href="/thong-ke"
            className="sx-dark sx-tap block p-4 mb-6"
            style={{ boxShadow: 'var(--shadow-lift)' }}
          >
            <p className="relative text-[11px] uppercase tracking-widest font-bold text-brand-bright/90">
              Điểm xanh của bạn
            </p>
            <p className="relative sx-figure text-4xl mt-1.5 text-white">
              {points.toLocaleString('vi-VN')}
            </p>
            <p className="relative text-xs mt-1.5 text-white/70 truncate">
              {user?.level || 'Người khởi đầu xanh'}
            </p>
          </Link>

          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-[15px] transition-colors ${
                      active
                        ? 'bg-brand-wash text-brand'
                        : 'text-ink-soft hover:bg-canvas hover:text-ink'
                    }`}
                  >
                    <Icon size={18} className="shrink-0" />
                    <span>{item.label}</span>
                    {active && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-auto p-5 pt-0">
          <button
            onClick={onMenuClick}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-ink-soft hover:bg-canvas hover:text-ink font-semibold text-[15px] w-full transition-colors"
          >
            <FaBars size={17} className="shrink-0" />
            <span>Tất cả menu</span>
          </button>
        </div>
      </nav>

      {/* ---------------- Thanh dưới (điện thoại) ---------------- */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-paper border-t border-line z-40 pb-[env(safe-area-inset-bottom)]">
        <ul className="flex">
          {MOBILE_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.path;
            return (
              <li key={item.path} className="flex-1">
                <Link
                  href={item.path}
                  aria-current={active ? 'page' : undefined}
                  className="flex flex-col items-center gap-0.5 pt-2 pb-1.5"
                >
                  <span
                    className={`flex items-center justify-center h-8 w-14 rounded-full transition-colors ${
                      active ? 'bg-brand-wash text-brand' : 'text-ink-faint'
                    }`}
                  >
                    <Icon size={18} />
                  </span>
                  <span
                    className={`text-[11px] font-semibold ${
                      active ? 'text-brand' : 'text-ink-faint'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
          <li className="flex-1">
            <button
              onClick={onMenuClick}
              className="flex flex-col items-center gap-0.5 pt-2 pb-1.5 w-full"
            >
              <span className="flex items-center justify-center h-8 w-14 rounded-full text-ink-faint">
                <FaBars size={18} />
              </span>
              <span className="text-[11px] font-semibold text-ink-faint">Menu</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
