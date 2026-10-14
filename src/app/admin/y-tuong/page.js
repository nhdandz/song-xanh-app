"use client";

import { useState, useEffect } from "react";
import { LightBulbIcon } from "@heroicons/react/24/outline";

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
      "Chấp nhận": "bg-brand-wash text-ink",
      "Từ chối": "bg-red-100 text-red-800",
      "Đang thực hiện": "bg-purple-100 text-purple-800",
      "Hoàn thành": "bg-canvas text-ink"
    };
    return colors[status] || "bg-canvas text-ink";
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-ink">Quản lý Ý tưởng</h1>
            <p className="text-ink-soft mt-1">Tổng số: {ideas.length} ý tưởng</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl border-[1.5px] border-line bg-paper focus:outline-none focus:border-brand transition-colors"
        >
          <option value="all">Tất cả trạng thái</option>
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand border-t-transparent"></div>
          <p className="mt-4 text-ink-soft">Đang tải danh sách ý tưởng...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredIdeas.length === 0 ? (
            <div className="col-span-2 text-center py-12 sx-card">
              <LightBulbIcon className="w-12 h-12 mx-auto mb-2 text-ink-faint" />
              <p className="text-ink-faint">Không tìm thấy ý tưởng nào</p>
            </div>
          ) : (
            filteredIdeas.map((idea) => (
              <div key={idea.id} className="sx-card p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-ink flex-1">{idea.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(idea.status)}`}>
                    {idea.status}
                  </span>
                </div>

                <p className="text-ink-soft mb-4 line-clamp-3">{idea.description}</p>

                <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                  <div>
                    <span className="text-ink-faint">Danh mục:</span>
                    <div className="font-semibold text-brand">{idea.category}</div>
                  </div>
                  <div>
                    <span className="text-ink-faint">Độ khó:</span>
                    <div className="font-semibold">{idea.difficulty}</div>
                  </div>
                  <div>
                    <span className="text-ink-faint">Tác động:</span>
                    <div className="font-semibold">{idea.impact}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-ink-faint">
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
                    className="flex-1 px-3 py-1 border border-line rounded text-sm focus:ring-2 focus:border-brand"
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
