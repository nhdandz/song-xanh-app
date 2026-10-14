"use client";

import { useState, useEffect } from "react";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/outline";

const EMPTY_FORM = {
  name: "",
  email: "",
  school: "",
  level: "",
  points: "",
  password: ""
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      alert("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const openEditForm = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      school: user.school || "",
      level: user.level || "",
      points: user.points ?? "",
      password: ""
    });
  };

  const closeEditForm = () => {
    setEditingUser(null);
    setFormData(EMPTY_FORM);
  };

  const saveUser = async (e) => {
    e.preventDefault();
    if (saving || !editingUser) return;

    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên người dùng");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Cập nhật thất bại");

      setUsers(users.map(u => (u.id === data.id ? data : u)));
      closeEditForm();
      alert("Đã cập nhật người dùng");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
        alert("Đã xóa người dùng");
      } else {
        throw new Error("Xóa thất bại");
      }
    } catch (err) {
      console.error(err);
      alert("Không thể xóa người dùng");
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLevel = filterLevel === "all" || user.level === filterLevel;

    return matchesSearch && matchesLevel;
  });

  const levels = [...new Set(users.map(u => u.level).filter(Boolean))];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-ink">Quản lý Người dùng</h1>
        <p className="text-ink-soft mt-1">Tổng số: {users.length} người dùng</p>
      </div>

      <div className="mb-6 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[300px] relative">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-line rounded-lg focus:ring-2 focus:border-brand focus:border-transparent"
          />
        </div>
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="px-4 py-2.5 rounded-xl border-[1.5px] border-line bg-paper focus:outline-none focus:border-brand transition-colors"
        >
          <option value="all">Tất cả cấp độ</option>
          {levels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand border-t-transparent"></div>
          <p className="mt-4 text-ink-soft">Đang tải danh sách người dùng...</p>
        </div>
      ) : (
        <div className="sx-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-canvas">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-ink-faint uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-ink-faint uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-ink-faint uppercase tracking-wider">
                    Trường
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-ink-faint uppercase tracking-wider">
                    Cấp độ
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-ink-faint uppercase tracking-wider">
                    Điểm
                  </th>
                  <th className="hidden xl:table-cell px-4 py-3 text-left text-xs font-medium text-ink-faint uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-ink-faint uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-paper divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-ink-faint">
                      <UserCircleIcon className="w-12 h-12 mx-auto mb-2 text-ink-faint" />
                      Không tìm thấy người dùng nào
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-canvas">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-brand-wash flex items-center justify-center">
                              <span className="text-brand font-semibold text-lg">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-ink">{user.name}</div>
                            <div className="text-xs text-ink-faint">ID: {user.id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-ink break-all">{user.email || "-"}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-ink">{user.school || "-"}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="sx-chip bg-brand-wash text-brand">
                          {user.level || "Mới"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-bold text-brand whitespace-nowrap">{user.points} điểm</div>
                      </td>
                      <td className="hidden xl:table-cell px-4 py-4 whitespace-nowrap text-sm text-ink-faint">
                        {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openEditForm(user)}
                          className="text-brand hover:text-green-900"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="text-red-600 hover:text-red-900 ml-4"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="sx-card-xl w-full max-w-lg max-h-full overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-1">Sửa người dùng</h2>
              <p className="text-sm text-ink-faint mb-4">ID: {editingUser.id}</p>

              <form onSubmit={saveUser} className="space-y-4">
                <div>
                  <label className="block text-sm text-ink-soft mb-1">
                    Tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border-[1.5px] border-line bg-paper focus:outline-none focus:border-brand transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-ink-soft mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border-[1.5px] border-line bg-paper focus:outline-none focus:border-brand transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-ink-soft mb-1">Trường</label>
                  <input
                    type="text"
                    value={formData.school}
                    onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border-[1.5px] border-line bg-paper focus:outline-none focus:border-brand transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-ink-soft mb-1">Cấp độ</label>
                    <input
                      type="text"
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border-[1.5px] border-line bg-paper focus:outline-none focus:border-brand transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-ink-soft mb-1">Điểm</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.points}
                      onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border-[1.5px] border-line bg-paper focus:outline-none focus:border-brand transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-ink-soft mb-1">Mật khẩu mới</label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Để trống nếu không đổi mật khẩu"
                    className="w-full px-4 py-2.5 rounded-xl border-[1.5px] border-line bg-paper focus:outline-none focus:border-brand transition-colors"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="sx-btn sx-btn-primary disabled:bg-gray-300"
                  >
                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                  <button
                    type="button"
                    onClick={closeEditForm}
                    className="sx-btn sx-btn-outline"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
