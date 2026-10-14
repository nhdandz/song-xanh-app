"use client";

import { useState, useEffect } from "react";
import { ChartBarIcon, UserGroupIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/outline";

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
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand border-t-transparent"></div>
          <p className="mt-4 text-ink-soft">Đang tải thống kê...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-ink">Thống kê & Phân tích</h1>
        <p className="text-ink-soft mt-1">Tổng quan về hoạt động của hệ thống</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="sx-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink-faint text-sm">Tổng người dùng</p>
              <p className="text-3xl font-bold text-ink mt-2">{stats?.users || 0}</p>
            </div>
            <UserGroupIcon className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="sx-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink-faint text-sm">Tổng bài viết</p>
              <p className="text-3xl font-bold text-ink mt-2">{stats?.articles || 0}</p>
            </div>
            <ChartBarIcon className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="sx-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink-faint text-sm">Tổng sản phẩm</p>
              <p className="text-3xl font-bold text-ink mt-2">{stats?.products || 0}</p>
            </div>
            <ArrowTrendingUpIcon className="w-12 h-12 text-purple-500" />
          </div>
        </div>

        <div className="sx-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink-faint text-sm">Tổng sự kiện</p>
              <p className="text-3xl font-bold text-ink mt-2">{stats?.events || 0}</p>
            </div>
            <ChartBarIcon className="w-12 h-12 text-orange-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="sx-card p-6">
          <h2 className="text-xl font-bold text-ink mb-4">Top người dùng theo điểm</h2>
          {stats?.topUsers && stats.topUsers.length > 0 ? (
            <div className="space-y-3">
              {stats.topUsers.map((user, idx) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-canvas rounded">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-brand-wash flex items-center justify-center mr-3">
                      <span className="text-brand font-bold">{idx + 1}</span>
                    </div>
                    <div>
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-sm text-ink-faint">{user.level || "Mới"}</div>
                    </div>
                  </div>
                  <div className="text-brand font-bold">{user.points} điểm</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-ink-faint">Chưa có dữ liệu</p>
          )}
        </div>

        <div className="sx-card p-6">
          <h2 className="text-xl font-bold text-ink mb-4">Thống kê báo cáo</h2>
          {stats?.reportsByStatus ? (
            <div className="space-y-3">
              {Object.entries(stats.reportsByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between p-3 bg-canvas rounded">
                  <span className="font-medium">{status}</span>
                  <span className="text-ink font-bold">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-ink-faint">Chưa có dữ liệu</p>
          )}
        </div>
      </div>

      <div className="sx-card p-6">
        <h2 className="text-xl font-bold text-ink mb-4">Hoạt động gần đây</h2>
        {stats?.recentActivities && stats.recentActivities.length > 0 ? (
          <div className="space-y-2">
            {stats.recentActivities.map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div>
                  <span className="font-medium">{activity.user?.name || "Unknown"}</span>
                  <span className="text-ink-soft"> đã thực hiện </span>
                  <span className="font-medium">{activity.activity?.name || "hoạt động"}</span>
                </div>
                <div className="text-sm text-ink-faint">
                  {new Date(activity.date).toLocaleDateString("vi-VN")}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-ink-faint">Chưa có hoạt động nào</p>
        )}
      </div>
    </div>
  );
}
