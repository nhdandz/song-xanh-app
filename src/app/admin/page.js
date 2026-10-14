"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  UserGroupIcon,
  NewspaperIcon,
  CubeIcon,
  CalendarIcon,
  FlagIcon,
  ChartBarIcon,
  LightBulbIcon,
  TrophyIcon,
  GiftIcon,
  CircleStackIcon
} from "@heroicons/react/24/outline";
import { ADMIN_MODELS } from "@/lib/adminModels";

export default function AdminPage() {
  const [stats, setStats] = useState({
    users: 0,
    articles: 0,
    products: 0,
    events: 0,
    reports: 0,
    ideas: 0,
    rewards: 0,
    loading: true
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats({ ...data, loading: false });
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const adminSections = [
    {
      title: "Quản lý Người dùng",
      description: "Xem và quản lý tài khoản người dùng",
      icon: UserGroupIcon,
      href: "/admin/nguoi-dung",
      count: stats.users,
      color: "blue"
    },
    {
      title: "Quản lý Tin tức",
      description: "Tạo, sửa, xóa bài viết tin tức",
      icon: NewspaperIcon,
      href: "/admin/tin-tuc",
      count: stats.articles,
      color: "green"
    },
    {
      title: "Quản lý Sản phẩm",
      description: "Quản lý cơ sở dữ liệu barcode sản phẩm",
      icon: CubeIcon,
      href: "/admin/san-pham",
      count: stats.products,
      color: "purple"
    },
    {
      title: "Quản lý Sự kiện",
      description: "Tạo và quản lý sự kiện môi trường",
      icon: CalendarIcon,
      href: "/admin/su-kien",
      count: stats.events,
      color: "orange"
    },
    {
      title: "Kiểm duyệt Báo cáo",
      description: "Xem và phê duyệt báo cáo môi trường",
      icon: FlagIcon,
      href: "/admin/bao-cao",
      count: stats.reports,
      color: "red"
    },
    {
      title: "Quản lý Ý tưởng",
      description: "Xem và phê duyệt ý tưởng từ cộng đồng",
      icon: LightBulbIcon,
      href: "/admin/y-tuong",
      count: stats.ideas,
      color: "yellow"
    },
    {
      title: "Quản lý Quà tặng",
      description: "Thêm quà để trang Đổi quà có dữ liệu",
      icon: GiftIcon,
      href: "/admin/du-lieu/qua-tang",
      count: stats.rewards,
      color: "pink"
    },
    {
      title: "Quản lý Dữ liệu",
      description: `Thêm, sửa, xóa ${ADMIN_MODELS.length} bảng dữ liệu còn lại`,
      icon: CircleStackIcon,
      href: "/admin/du-lieu",
      count: null,
      color: "teal"
    },
    {
      title: "Thống kê",
      description: "Xem báo cáo và phân tích dữ liệu",
      icon: ChartBarIcon,
      href: "/admin/thong-ke",
      count: null,
      color: "indigo"
    }
  ];

  const TINTS = {
    blue: { tint: "bg-sky-wash", ink: "text-sky" },
    green: { tint: "bg-brand-wash", ink: "text-brand" },
    purple: { tint: "bg-grape-wash", ink: "text-grape" },
    orange: { tint: "bg-sun-wash", ink: "text-sun" },
    red: { tint: "bg-coral-wash", ink: "text-coral" },
    yellow: { tint: "bg-sun-wash", ink: "text-sun" },
    indigo: { tint: "bg-grape-wash", ink: "text-grape" },
    pink: { tint: "bg-coral-wash", ink: "text-coral" },
    teal: { tint: "bg-sky-wash", ink: "text-sky" },
  };

  // Bốn số liệu đáng theo dõi nhất, đưa lên đầu trang
  const HIGHLIGHTS = [
    { key: "users", label: "Người dùng", ink: "text-brand-bright" },
    { key: "articles", label: "Bài viết", ink: "text-white" },
    { key: "rewards", label: "Quà tặng", ink: "text-white" },
    { key: "reports", label: "Báo cáo", ink: "text-white" },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-5 max-w-6xl mx-auto">
      {/* Khối tổng quan */}
      <section className="sx-dark sx-enter p-6 sm:p-8">
        <div className="relative">
          <span className="sx-chip bg-white/15 text-brand-bright">Quản trị</span>
          <h1 className="text-2xl sm:text-4xl text-white mt-3">Bảng điều khiển</h1>
          <p className="text-white/70 mt-1.5 text-sm sm:text-base">
            Quản lý nội dung và dữ liệu của ứng dụng Sống Xanh.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
            {HIGHLIGHTS.map((item) => (
              <div key={item.key}>
                <p className="text-[11px] uppercase tracking-widest font-bold text-white/50">
                  {item.label}
                </p>
                <p className={`sx-figure text-2xl sm:text-3xl mt-1 ${item.ink}`}>
                  {stats.loading ? "—" : (stats[item.key] ?? 0).toLocaleString("vi-VN")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Các mục quản lý */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminSections.map((section, i) => {
          const Icon = section.icon;
          const tone = TINTS[section.color] || TINTS.blue;
          return (
            <Link
              key={section.href}
              href={section.href}
              className="sx-card sx-tap sx-enter p-5"
              style={{ animationDelay: `${Math.min(i, 9) * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`flex items-center justify-center w-11 h-11 rounded-xl shrink-0 ${tone.tint} ${tone.ink}`}
                >
                  <Icon className="w-5 h-5" />
                </span>
                {section.count !== null && (
                  <span className={`sx-chip ${tone.tint} ${tone.ink}`}>
                    {stats.loading ? "…" : (section.count ?? 0).toLocaleString("vi-VN")}
                  </span>
                )}
              </div>
              <h2 className="font-extrabold mt-3.5 text-ink leading-tight">{section.title}</h2>
              <p className="text-sm text-ink-soft mt-1 leading-snug">{section.description}</p>
            </Link>
          );
        })}
      </div>

      <section className="sx-card p-5 sm:p-6">
        <h3 className="text-lg text-ink mb-3">Lưu ý khi dùng</h3>
        <ul className="space-y-1.5 text-sm text-ink-soft">
          <li>• Mỗi mục mở ra một trang quản lý riêng, thao tác lưu ngay vào cơ sở dữ liệu.</li>
          <li>• Số liệu trên trang này đọc trực tiếp từ cơ sở dữ liệu mỗi lần tải lại.</li>
          <li>• Xoá bản ghi là không khôi phục được, hãy kiểm tra kỹ trước khi xác nhận.</li>
          <li>• Mục <strong className="text-ink">Dữ liệu</strong> gom {ADMIN_MODELS.length} bảng còn lại chưa có trang riêng.</li>
        </ul>
      </section>
    </div>
  );
}
