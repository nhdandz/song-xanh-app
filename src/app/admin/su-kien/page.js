"use client";

import { useState, useEffect } from "react";
import { PlusIcon, CalendarIcon, MapPinIcon, UsersIcon } from "@heroicons/react/24/outline";

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
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-ink">Quản lý Sự kiện</h1>
            <p className="text-ink-soft mt-1">Tổng số: {events.length} sự kiện</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="sx-btn sx-btn-primary"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Tạo sự kiện mới
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="mb-6 sx-card p-6">
          <h2 className="text-xl font-bold mb-4">Tạo sự kiện mới</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Tiêu đề sự kiện *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border-[1.5px] border-line bg-paper focus:outline-none focus:border-brand transition-colors"
              required
            />

            <textarea
              placeholder="Mô tả sự kiện *"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border-[1.5px] border-line bg-paper focus:outline-none focus:border-brand transition-colors"
              rows="4"
              required
            />

            <input
              type="text"
              placeholder="Địa điểm *"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border-[1.5px] border-line bg-paper focus:outline-none focus:border-brand transition-colors"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-ink-soft mb-1">Ngày giờ tổ chức *</label>
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-[1.5px] border-line bg-paper focus:outline-none focus:border-brand transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-ink-soft mb-1">Số lượng tham gia tối đa (tùy chọn)</label>
                <input
                  type="number"
                  placeholder="Để trống nếu không giới hạn"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-[1.5px] border-line bg-paper focus:outline-none focus:border-brand transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="sx-btn sx-btn-primary"
              >
                Tạo sự kiện
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="sx-btn sx-btn-outline"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand border-t-transparent"></div>
          <p className="mt-4 text-ink-soft">Đang tải danh sách sự kiện...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.length === 0 ? (
            <div className="col-span-2 text-center py-12 sx-card">
              <CalendarIcon className="w-12 h-12 mx-auto mb-2 text-ink-faint" />
              <p className="text-ink-faint">Chưa có sự kiện nào</p>
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} className="sx-card overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-ink mb-2">{event.title}</h3>
                  <p className="text-ink-soft mb-4 line-clamp-3">{event.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-ink-soft">
                      <CalendarIcon className="w-5 h-5 mr-2 text-brand" />
                      {new Date(event.date).toLocaleString("vi-VN", {
                        dateStyle: "long",
                        timeStyle: "short"
                      })}
                    </div>
                    <div className="flex items-center text-ink-soft">
                      <MapPinIcon className="w-5 h-5 mr-2 text-brand" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-ink-soft">
                      <UsersIcon className="w-5 h-5 mr-2 text-brand" />
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
