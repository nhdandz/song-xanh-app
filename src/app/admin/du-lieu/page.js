"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon, CircleStackIcon } from "@heroicons/react/24/outline";

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
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link href="/admin" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Quay lại Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Dữ liệu</h1>
        <p className="text-gray-600 mt-1">
          {items.length} bảng dữ liệu · {totalRecords.toLocaleString("vi-VN")} bản ghi
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Đang tải danh sách dữ liệu...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <CircleStackIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p className="text-gray-500">Chưa có bảng dữ liệu nào</p>
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map((group) => {
            const groupItems = items.filter((item) => item.group === group);
            if (groupItems.length === 0) return null;

            return (
              <section key={group}>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">{group}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupItems.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/admin/du-lieu/${item.slug}`}
                      className="block p-5 bg-white rounded-lg border-2 border-gray-200 hover:border-green-400 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-2xl" aria-hidden="true">{item.icon || "🗂️"}</span>
                        <span className="px-3 py-1 rounded-full text-sm font-semibold text-green-700 bg-green-50">
                          {item.count.toLocaleString("vi-VN")}
                        </span>
                      </div>
                      <h3 className="font-bold mt-3 text-gray-900">{item.label}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
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
