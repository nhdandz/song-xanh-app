"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon, MagnifyingGlassIcon, MapPinIcon } from "@heroicons/react/24/outline";

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/reports");
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      alert("Không thể tải danh sách báo cáo");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/admin/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setReports(reports.map(r => r.id === id ? { ...r, status: newStatus } : r));
        alert("Đã cập nhật trạng thái");
      } else {
        throw new Error("Cập nhật thất bại");
      }
    } catch (err) {
      console.error(err);
      alert("Không thể cập nhật trạng thái");
    }
  };

  const deleteReport = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa báo cáo này?")) return;

    try {
      const res = await fetch(`/api/admin/reports/${id}`, { method: "DELETE" });
      if (res.ok) {
        setReports(reports.filter(r => r.id !== id));
        alert("Đã xóa báo cáo");
      } else {
        throw new Error("Xóa thất bại");
      }
    } catch (err) {
      console.error(err);
      alert("Không thể xóa báo cáo");
    }
  };

  const filteredReports = filterStatus === "all"
    ? reports
    : reports.filter(r => r.status === filterStatus);

  const statuses = ["Chờ xác nhận", "Đã xác nhận", "Đang xử lý", "Đã hoàn thành", "Từ chối"];

  const getStatusColor = (status) => {
    const colors = {
      "Chờ xác nhận": "bg-yellow-100 text-yellow-800",
      "Đã xác nhận": "bg-blue-100 text-blue-800",
      "Đang xử lý": "bg-purple-100 text-purple-800",
      "Đã hoàn thành": "bg-green-100 text-green-800",
      "Từ chối": "bg-red-100 text-red-800"
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
            <h1 className="text-3xl font-bold text-gray-900">Kiểm duyệt Báo cáo</h1>
            <p className="text-gray-600 mt-1">Tổng số: {reports.length} báo cáo</p>
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
          <p className="mt-4 text-gray-600">Đang tải danh sách báo cáo...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">Không tìm thấy báo cáo nào</p>
            </div>
          ) : (
            filteredReports.map((report) => (
              <div key={report.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{report.title}</h3>
                    <div className="flex items-center mt-2 text-gray-600">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      {report.location}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Danh mục: {report.category} | Người báo: {report.user?.name || "Unknown"}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>

                <p className="text-gray-700 mb-4">{report.description}</p>

                {report.images && (
                  <div className="mb-4">
                    <img
                      src={report.images}
                      alt="Hình ảnh báo cáo"
                      className="w-full max-w-md rounded-lg"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    Ngày tạo: {new Date(report.createdAt).toLocaleString("vi-VN")}
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={report.status}
                      onChange={(e) => updateStatus(report.id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => deleteReport(report.id)}
                      className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  {report._count?.likes || 0} lượt thích | {report._count?.comments || 0} bình luận
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
