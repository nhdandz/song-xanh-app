"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon, LightBulbIcon } from "@heroicons/react/24/outline";

export default function AdminIdeasPage() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/ideas");
      if (res.ok) {
        const data = await res.json();
        setIdeas(data);
      }
    } catch (err) {
      console.error("Failed to fetch ideas:", err);
      alert("Không thể tải danh sách ý tưởng");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/admin/ideas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setIdeas(ideas.map(i => i.id === id ? { ...i, status: newStatus } : i));
        alert("Đã cập nhật trạng thái");
      } else {
        throw new Error("Cập nhật thất bại");
      }
    } catch (err) {
      console.error(err);
      alert("Không thể cập nhật trạng thái");
    }
  };

  const deleteIdea = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa ý tưởng này?")) return;

    try {
      const res = await fetch(`/api/admin/ideas/${id}`, { method: "DELETE" });
      if (res.ok) {
        setIdeas(ideas.filter(i => i.id !== id));
        alert("Đã xóa ý tưởng");
      } else {
        throw new Error("Xóa thất bại");
      }
    } catch (err) {
      console.error(err);
      alert("Không thể xóa ý tưởng");
    }
  };

  const filteredIdeas = filterStatus === "all"
    ? ideas
    : ideas.filter(i => i.status === filterStatus);

  const statuses = ["Mới đề xuất", "Đang xem xét", "Chấp nhận", "Từ chối", "Đang thực hiện", "Hoàn thành"];

  const getStatusColor = (status) => {
    const colors = {
      "Mới đề xuất": "bg-blue-100 text-blue-800",
      "Đang xem xét": "bg-yellow-100 text-yellow-800",
      "Chấp nhận": "bg-green-100 text-green-800",
      "Từ chối": "bg-red-100 text-red-800",
      "Đang thực hiện": "bg-purple-100 text-purple-800",
      "Hoàn thành": "bg-gray-100 text-gray-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link href="/admin" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Quay lại Dashboard
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý Ý tưởng</h1>
            <p className="text-gray-600 mt-1">Tổng số: {ideas.length} ý tưởng</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="all">Tất cả trạng thái</option>
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Đang tải danh sách ý tưởng...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredIdeas.length === 0 ? (
            <div className="col-span-2 text-center py-12 bg-white rounded-lg shadow">
              <LightBulbIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-gray-500">Không tìm thấy ý tưởng nào</p>
            </div>
          ) : (
            filteredIdeas.map((idea) => (
              <div key={idea.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900 flex-1">{idea.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(idea.status)}`}>
                    {idea.status}
                  </span>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-3">{idea.description}</p>

                <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Danh mục:</span>
                    <div className="font-semibold text-green-700">{idea.category}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Độ khó:</span>
                    <div className="font-semibold">{idea.difficulty}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Tác động:</span>
                    <div className="font-semibold">{idea.impact}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    <div>Người đề xuất: {idea.user?.name || "Unknown"}</div>
                    <div className="text-xs mt-1">
                      {idea._count?.likes || 0} lượt thích | {idea._count?.comments || 0} bình luận
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <select
                    value={idea.status}
                    onChange={(e) => updateStatus(idea.id, e.target.value)}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => deleteIdea(idea.id)}
                    className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
