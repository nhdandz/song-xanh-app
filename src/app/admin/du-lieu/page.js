"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CircleStackIcon } from "@heroicons/react/24/outline";

export default function AdminDataIndexPage() {
  const [groups, setGroups] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/models");
      if (res.ok) {
        const data = await res.json();
        setGroups(data.groups || []);
        setItems(data.items || []);
      }
    } catch (err) {
      console.error("Failed to fetch models:", err);
      alert("Không thể tải danh sách dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const totalRecords = items.reduce((sum, item) => sum + (item.count || 0), 0);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-ink">Quản lý Dữ liệu</h1>
        <p className="text-ink-soft mt-1">
          {items.length} bảng dữ liệu · {totalRecords.toLocaleString("vi-VN")} bản ghi
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand border-t-transparent"></div>
          <p className="mt-4 text-ink-soft">Đang tải danh sách dữ liệu...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 sx-card">
          <CircleStackIcon className="w-12 h-12 mx-auto mb-2 text-ink-faint" />
          <p className="text-ink-faint">Chưa có bảng dữ liệu nào</p>
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map((group) => {
            const groupItems = items.filter((item) => item.group === group);
            if (groupItems.length === 0) return null;

            return (
              <section key={group}>
                <h2 className="text-lg font-semibold text-ink mb-3">{group}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupItems.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/admin/du-lieu/${item.slug}`}
                      className="block p-5 sx-card sx-tap hover:border-brand transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-2xl" aria-hidden="true">{item.icon || "🗂️"}</span>
                        <span className="px-3 py-1 rounded-full text-sm font-semibold text-brand bg-brand-wash">
                          {item.count.toLocaleString("vi-VN")}
                        </span>
                      </div>
                      <h3 className="font-bold mt-3 text-ink">{item.label}</h3>
                      <p className="text-sm text-ink-soft mt-1">{item.description}</p>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
