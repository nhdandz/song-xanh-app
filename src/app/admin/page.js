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
  TrophyIcon
} from "@heroicons/react/24/outline";

export default function AdminPage() {
  const [stats, setStats] = useState({
    users: 0,
    articles: 0,
    products: 0,
    events: 0,
    reports: 0,
    ideas: 0,
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
      title: "Thống kê",
      description: "Xem báo cáo và phân tích dữ liệu",
      icon: ChartBarIcon,
      href: "/admin/thong-ke",
      count: null,
      color: "indigo"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      green: "bg-green-50 border-green-200 hover:bg-green-100",
      purple: "bg-purple-50 border-purple-200 hover:bg-purple-100",
      orange: "bg-orange-50 border-orange-200 hover:bg-orange-100",
      red: "bg-red-50 border-red-200 hover:bg-red-100",
      yellow: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
      indigo: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
    };
    return colors[color] || colors.blue;
  };

  const getIconColorClasses = (color) => {
    const colors = {
      blue: "text-blue-600",
      green: "text-green-600",
      purple: "text-purple-600",
      orange: "text-orange-600",
      red: "text-red-600",
      yellow: "text-yellow-600",
      indigo: "text-indigo-600"
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bảng điều khiển Admin</h1>
          <p className="text-gray-600 mt-1">Chào mừng bạn đến trang quản trị Song Xanh</p>
        </div>
        <TrophyIcon className="w-12 h-12 text-green-600" />
      </div>

      {stats.loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Đang tải thống kê...</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminSections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className={`block p-6 rounded-lg border-2 transition-all ${getColorClasses(section.color)} transform hover:scale-105 shadow-sm hover:shadow-md`}
            >
              <div className="flex items-start justify-between">
                <Icon className={`w-8 h-8 ${getIconColorClasses(section.color)}`} />
                {section.count !== null && (
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getIconColorClasses(section.color)} bg-white`}>
                    {section.count}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold mt-4 text-gray-900">{section.title}</h2>
              <p className="text-gray-600 mt-2 text-sm">{section.description}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 p-6 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Hướng dẫn sử dụng</h3>
        <ul className="space-y-2 text-gray-600">
          <li>• Click vào mỗi mục để truy cập trang quản lý tương ứng</li>
          <li>• Số liệu thống kê được cập nhật theo thời gian thực</li>
          <li>• Sử dụng thận trọng các chức năng xóa và chỉnh sửa</li>
          <li>• Liên hệ quản trị viên chính nếu cần hỗ trợ</li>
        </ul>
      </div>
    </div>
  );
}
