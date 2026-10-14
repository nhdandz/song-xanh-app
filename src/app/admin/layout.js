"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Squares2X2Icon,
  UserGroupIcon,
  NewspaperIcon,
  CubeIcon,
  CalendarIcon,
  FlagIcon,
  LightBulbIcon,
  GiftIcon,
  CircleStackIcon,
  ChartBarIcon,
  ArrowLeftOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const NAV = [
  { href: "/admin", label: "Tổng quan", icon: Squares2X2Icon, exact: true },
  { href: "/admin/nguoi-dung", label: "Người dùng", icon: UserGroupIcon },
  { href: "/admin/tin-tuc", label: "Tin tức", icon: NewspaperIcon },
  { href: "/admin/san-pham", label: "Sản phẩm", icon: CubeIcon },
  { href: "/admin/su-kien", label: "Sự kiện", icon: CalendarIcon },
  { href: "/admin/bao-cao", label: "Báo cáo", icon: FlagIcon },
  { href: "/admin/y-tuong", label: "Ý tưởng", icon: LightBulbIcon },
  { href: "/admin/du-lieu/qua-tang", label: "Quà tặng", icon: GiftIcon },
  { href: "/admin/du-lieu", label: "Dữ liệu", icon: CircleStackIcon, exact: true },
  { href: "/admin/thong-ke", label: "Thống kê", icon: ChartBarIcon },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isActive = (item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Xoá sạch state phía client rồi mới chuyển trang
      try {
        localStorage.removeItem("userId");
      } catch {}
      router.replace("/dang-nhap");
    }
  };

  const navList = (
    <ul className="space-y-1">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active = isActive(item);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-[15px] transition-colors ${
                active
                  ? "bg-brand-bright/20 text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-bright" />}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const footerLinks = (
    <div className="space-y-1 pt-4 mt-4 border-t border-white/10">
      <Link
        href="/"
        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/60 hover:bg-white/10 hover:text-white font-semibold text-[15px] transition-colors"
      >
        <ArrowTopRightOnSquareIcon className="w-5 h-5 shrink-0" />
        <span>Xem trang học sinh</span>
      </Link>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/60 hover:bg-coral/20 hover:text-white font-semibold text-[15px] transition-colors w-full"
      >
        <ArrowLeftOnRectangleIcon className="w-5 h-5 shrink-0" />
        <span>Đăng xuất</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* ---------- Sidebar (máy tính) ---------- */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-brand-dark z-40 p-5">
        <Link href="/admin" className="flex items-center gap-2.5 mb-7">
          <span className="w-9 h-9 bg-brand-bright rounded-xl flex items-center justify-center shrink-0 font-extrabold text-brand-dark">
            SX
          </span>
          <span className="min-w-0">
            <span className="block text-base font-extrabold text-white leading-tight">
              Sống Xanh
            </span>
            <span className="block text-[11px] uppercase tracking-widest font-bold text-brand-bright">
              Quản trị
            </span>
          </span>
        </Link>

        <nav className="flex-1 overflow-y-auto">{navList}</nav>
        {footerLinks}
      </aside>

      {/* ---------- Thanh trên (điện thoại) ---------- */}
      <header className="lg:hidden sticky top-0 z-40 bg-brand-dark px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="w-8 h-8 bg-brand-bright rounded-lg flex items-center justify-center font-extrabold text-brand-dark text-sm">
            SX
          </span>
          <span className="text-sm font-extrabold text-white">Quản trị</span>
        </Link>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Đóng menu" : "Mở menu"}
          aria-expanded={open}
          className="p-2 -mr-2 text-white"
        >
          {open ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </header>

      {open && (
        <div className="lg:hidden sticky top-[56px] z-40 bg-brand-dark px-4 pb-4 border-t border-white/10">
          <nav className="pt-3">{navList}</nav>
          {footerLinks}
        </div>
      )}

      {/* ---------- Nội dung ---------- */}
      <div className="lg:ml-64">{children}</div>
    </div>
  );
}
