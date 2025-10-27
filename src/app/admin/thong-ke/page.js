"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ChartBarIcon, UserGroupIcon, TrendingUpIcon } from "@heroicons/react/24/outline";

export default function AdminStatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetailedStats();
  }, []);

  const fetchDetailedStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/stats/detailed");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      alert("Không thể tải thống kê");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Đang tải thống kê...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link href="/admin" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Quay lại Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Thống kê & Phân tích</h1>
        <p className="text-gray-600 mt-1">Tổng quan về hoạt động của hệ thống</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Tổng người dùng</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.users || 0}</p>
            </div>
            <UserGroupIcon className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Tổng bài viết</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.articles || 0}</p>
            </div>
            <ChartBarIcon className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Tổng sản phẩm</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.products || 0}</p>
            </div>
            <TrendingUpIcon className="w-12 h-12 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Tổng sự kiện</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.events || 0}</p>
            </div>
            <ChartBarIcon className="w-12 h-12 text-orange-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top người dùng theo điểm</h2>
          {stats?.topUsers && stats.topUsers.length > 0 ? (
            <div className="space-y-3">
              {stats.topUsers.map((user, idx) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <span className="text-green-700 font-bold">{idx + 1}</span>
                    </div>
                    <div>
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.level || "Mới"}</div>
                    </div>
                  </div>
                  <div className="text-green-600 font-bold">{user.points} điểm</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Chưa có dữ liệu</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Thống kê báo cáo</h2>
          {stats?.reportsByStatus ? (
            <div className="space-y-3">
              {Object.entries(stats.reportsByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">{status}</span>
                  <span className="text-gray-900 font-bold">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Chưa có dữ liệu</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Hoạt động gần đây</h2>
        {stats?.recentActivities && stats.recentActivities.length > 0 ? (
          <div className="space-y-2">
            {stats.recentActivities.map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div>
                  <span className="font-medium">{activity.user?.name || "Unknown"}</span>
                  <span className="text-gray-600"> đã thực hiện </span>
                  <span className="font-medium">{activity.activity?.name || "hoạt động"}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(activity.date).toLocaleDateString("vi-VN")}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Chưa có hoạt động nào</p>
        )}
      </div>
    </div>
  );
}
