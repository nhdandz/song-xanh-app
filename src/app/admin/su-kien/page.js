"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon, PlusIcon, CalendarIcon, MapPinIcon, UsersIcon } from "@heroicons/react/24/outline";

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    maxParticipants: ""
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
      alert("Không thể tải danh sách sự kiện");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.location || !formData.date) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null
        })
      });

      if (res.ok) {
        alert("Đã tạo sự kiện");
        setShowAddForm(false);
        setFormData({
          title: "",
          description: "",
          location: "",
          date: "",
          maxParticipants: ""
        });
        fetchEvents();
      } else {
        throw new Error("Tạo sự kiện thất bại");
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const deleteEvent = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sự kiện này?")) return;

    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEvents(events.filter(e => e.id !== id));
        alert("Đã xóa sự kiện");
      } else {
        throw new Error("Xóa thất bại");
      }
    } catch (err) {
      console.error(err);
      alert("Không thể xóa sự kiện");
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Quản lý Sự kiện</h1>
            <p className="text-gray-600 mt-1">Tổng số: {events.length} sự kiện</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Tạo sự kiện mới
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="mb-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Tạo sự kiện mới</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Tiêu đề sự kiện *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />

            <textarea
              placeholder="Mô tả sự kiện *"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              rows="4"
              required
            />

            <input
              type="text"
              placeholder="Địa điểm *"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Ngày giờ tổ chức *</label>
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Số lượng tham gia tối đa (tùy chọn)</label>
                <input
                  type="number"
                  placeholder="Để trống nếu không giới hạn"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Tạo sự kiện
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Đang tải danh sách sự kiện...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.length === 0 ? (
            <div className="col-span-2 text-center py-12 bg-white rounded-lg shadow">
              <CalendarIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-gray-500">Chưa có sự kiện nào</p>
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-700">
                      <CalendarIcon className="w-5 h-5 mr-2 text-green-600" />
                      {new Date(event.date).toLocaleString("vi-VN", {
                        dateStyle: "long",
                        timeStyle: "short"
                      })}
                    </div>
                    <div className="flex items-center text-gray-700">
                      <MapPinIcon className="w-5 h-5 mr-2 text-green-600" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-gray-700">
                      <UsersIcon className="w-5 h-5 mr-2 text-green-600" />
                      {event._count?.participants || 0} người tham gia
                      {event.maxParticipants && ` / ${event.maxParticipants} tối đa`}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
