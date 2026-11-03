'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { APP_NAME, USER_FEATURES } from '@/lib/app-config';
import {
  FaHome,
  FaLeaf,
  FaGamepad,
  FaCamera,
  FaSignOutAlt,
  FaSeedling,
} from 'react-icons/fa';

// Icon cho từng nội dung chính. Đường dẫn và nhãn nằm ở app-config để
// thanh điều hướng và phần chặn truy cập không bị lệch nhau.
const ICONS = {
  '/hanh-vi-xanh': FaLeaf,
  '/quet-ma': FaCamera,
  '/tro-choi': FaGamepad,
};

const NAV_ITEMS = [
  { path: '/', label: 'Trang chủ', icon: FaHome },
  ...USER_FEATURES.map((item) => ({
    path: item.path,
    label: item.label,
    icon: ICONS[item.path] ?? FaLeaf,
  })),
];

export default function Navigation() {
  const pathname = usePathname();
  const { user, logout } = useAppContext();

  const points = user?.points ?? 0;
  const diem = points.toLocaleString('vi-VN');

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
              {APP_NAME}
            </span>
          </Link>

          {/* Thẻ điểm: cho học sinh thấy tiến độ ngay. Không bấm được nữa vì
              trang thống kê đã ẩn khỏi phần người dùng. */}
          <div
            className="sx-dark block p-4 mb-6"
            style={{ boxShadow: 'var(--shadow-lift)' }}
          >
            <p className="relative text-[11px] uppercase tracking-widest font-bold text-brand-bright/90">
              Điểm xanh của bạn
            </p>
            <p className="relative sx-figure text-4xl mt-1.5 text-white">{diem}</p>
            <p className="relative text-xs mt-1.5 text-white/70 truncate">
              {user?.level || 'Người khởi đầu xanh'}
            </p>
          </div>

          <p className="px-3.5 pb-2 text-[11px] uppercase tracking-widest font-bold text-ink-faint">
            Nội dung chính
          </p>

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

        {/* Đăng xuất nằm cuối sidebar, thay cho menu "Tất cả menu" cũ */}
        <div className="mt-auto p-5 pt-0">
          <div className="flex items-center gap-3 px-3.5 py-3 mb-2 rounded-xl bg-canvas">
            <span className="w-9 h-9 rounded-lg bg-brand-wash text-brand flex items-center justify-center shrink-0">
              <FaSeedling size={16} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-ink truncate">
                {user?.name || 'Học sinh'}
              </span>
              <span className="block text-xs text-ink-faint">{diem} điểm</span>
            </span>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-red-600 hover:bg-red-50 font-semibold text-[15px] w-full transition-colors"
          >
            <FaSignOutAlt size={17} className="shrink-0" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </nav>

      {/* ---------------- Thanh trên (điện thoại) ----------------
          Chứa tên ứng dụng, điểm và nút đăng xuất, để thanh dưới chỉ còn
          4 mục điều hướng cho thoáng. */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 z-40 bg-paper/95 backdrop-blur border-b border-line">
        <div className="h-full px-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <span className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center shrink-0">
              <FaLeaf className="text-white" size={15} />
            </span>
            <span className="font-extrabold tracking-tight text-ink truncate">
              {APP_NAME}
            </span>
          </Link>

          <span className="ml-auto sx-chip bg-brand-wash text-brand shrink-0">
            <FaSeedling size={11} />
            {diem} điểm
          </span>

          <button
            onClick={logout}
            aria-label="Đăng xuất"
            className="w-9 h-9 rounded-lg text-red-600 hover:bg-red-50 flex items-center justify-center shrink-0 transition-colors"
          >
            <FaSignOutAlt size={17} />
          </button>
        </div>
      </header>

      {/* ---------------- Thanh dưới (điện thoại) ---------------- */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-paper border-t border-line z-40 pb-[env(safe-area-inset-bottom)]">
        <ul className="flex">
          {NAV_ITEMS.map((item) => {
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
                    className={`text-[11px] font-semibold text-center leading-tight px-0.5 ${
                      active ? 'text-brand' : 'text-ink-faint'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
