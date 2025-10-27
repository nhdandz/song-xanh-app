'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaUsers,
  FaBarcode,
  FaLeaf,
  FaHistory,
  FaUserPlus,
  FaChartLine,
  FaSignOutAlt,
  FaCog,
  FaTrophy,
  FaTasks,
  FaShieldAlt
} from 'react-icons/fa';

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [posts, setPosts] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ content: '', images: '', activity: '' });

  useEffect(() => {
    // Kiểm tra đăng nhập
    const adminData = localStorage.getItem('admin');
    if (!adminData) {
      router.push('/admin/login');
      return;
    }

    setAdmin(JSON.parse(adminData));
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadPosts = async () => {
    try {
      const response = await fetch('/api/admin/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        setShowCreatePost(false);
        setNewPost({ content: '', images: '', activity: '' });
        loadPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleDeletePost = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return;

    try {
      const response = await fetch(`/api/admin/posts?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    document.cookie = 'admin-token=; Max-Age=0; path=/;';
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-green-800 to-green-900 text-white shadow-2xl z-20">
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <FaShieldAlt className="text-2xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Song Xanh</h1>
              <p className="text-green-200 text-sm">Admin Panel</p>
            </div>
          </div>

          <div className="mb-8 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
            <p className="text-sm text-green-200 mb-1">Xin chào,</p>
            <p className="font-semibold text-lg">{admin?.name}</p>
            <p className="text-xs text-green-300 mt-1">{admin?.email}</p>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-green-800 shadow-lg'
                  : 'text-green-100 hover:bg-white/10'
              }`}
            >
              <FaChartLine className="text-xl" />
              <span className="font-medium">Tổng quan</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'users'
                  ? 'bg-white text-green-800 shadow-lg'
                  : 'text-green-100 hover:bg-white/10'
              }`}
            >
              <FaUsers className="text-xl" />
              <span className="font-medium">Người dùng</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'products'
                  ? 'bg-white text-green-800 shadow-lg'
                  : 'text-green-100 hover:bg-white/10'
              }`}
            >
              <FaBarcode className="text-xl" />
              <span className="font-medium">Sản phẩm</span>
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'activities'
                  ? 'bg-white text-green-800 shadow-lg'
                  : 'text-green-100 hover:bg-white/10'
              }`}
            >
              <FaLeaf className="text-xl" />
              <span className="font-medium">Hoạt động</span>
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'badges'
                  ? 'bg-white text-green-800 shadow-lg'
                  : 'text-green-100 hover:bg-white/10'
              }`}
            >
              <FaTrophy className="text-xl" />
              <span className="font-medium">Huy hiệu</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('posts');
                loadPosts();
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'posts'
                  ? 'bg-white text-green-800 shadow-lg'
                  : 'text-green-100 hover:bg-white/10'
              }`}
            >
              <FaTasks className="text-xl" />
              <span className="font-medium">Tin tức</span>
            </button>
          </nav>

          <div className="absolute bottom-8 left-8 right-8">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-lg"
            >
              <FaSignOutAlt className="text-lg" />
              <span className="font-medium">Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-72">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-200">
          <div className="px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {activeTab === 'dashboard' && 'Tổng quan'}
                  {activeTab === 'users' && 'Quản lý người dùng'}
                  {activeTab === 'products' && 'Quản lý sản phẩm'}
                  {activeTab === 'activities' && 'Quản lý hoạt động xanh'}
                  {activeTab === 'badges' && 'Quản lý huy hiệu & thách thức'}
                  {activeTab === 'posts' && 'Quản lý tin tức'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {activeTab === 'dashboard' && 'Xem tổng quan thống kê hệ thống'}
                  {activeTab === 'users' && 'Quản lý danh sách người dùng'}
                  {activeTab === 'products' && 'Quản lý danh mục sản phẩm'}
                  {activeTab === 'activities' && 'Quản lý các hoạt động môi trường'}
                  {activeTab === 'badges' && 'Quản lý hệ thống thưởng'}
                  {activeTab === 'posts' && 'Quản lý bài viết và tin tức'}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="px-8 py-8">
        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-8 text-white hover:shadow-xl transition-all hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <FaUsers className="text-3xl" />
                  </div>
                  <div className="text-right">
                    <p className="text-blue-100 text-sm font-medium">Tổng</p>
                    <p className="text-4xl font-bold">
                      {stats?.stats?.totalUsers || 0}
                    </p>
                  </div>
                </div>
                <div className="border-t border-white/20 pt-4">
                  <p className="text-lg font-semibold">Người dùng</p>
                  <p className="text-blue-100 text-sm mt-1">
                    +{stats?.stats?.newUsersThisMonth || 0} người tháng này
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-8 text-white hover:shadow-xl transition-all hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <FaBarcode className="text-3xl" />
                  </div>
                  <div className="text-right">
                    <p className="text-green-100 text-sm font-medium">Tổng</p>
                    <p className="text-4xl font-bold">
                      {stats?.stats?.totalProducts || 0}
                    </p>
                  </div>
                </div>
                <div className="border-t border-white/20 pt-4">
                  <p className="text-lg font-semibold">Sản phẩm</p>
                  <p className="text-green-100 text-sm mt-1">
                    Trong hệ thống
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg p-8 text-white hover:shadow-xl transition-all hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <FaLeaf className="text-3xl" />
                  </div>
                  <div className="text-right">
                    <p className="text-amber-100 text-sm font-medium">Tổng</p>
                    <p className="text-4xl font-bold">
                      {stats?.stats?.totalActivities || 0}
                    </p>
                  </div>
                </div>
                <div className="border-t border-white/20 pt-4">
                  <p className="text-lg font-semibold">Hoạt động xanh</p>
                  <p className="text-amber-100 text-sm mt-1">
                    Hoạt động có sẵn
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg p-8 text-white hover:shadow-xl transition-all hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <FaHistory className="text-3xl" />
                  </div>
                  <div className="text-right">
                    <p className="text-purple-100 text-sm font-medium">Tổng</p>
                    <p className="text-4xl font-bold">
                      {stats?.stats?.totalScans || 0}
                    </p>
                  </div>
                </div>
                <div className="border-t border-white/20 pt-4">
                  <p className="text-lg font-semibold">Lượt quét</p>
                  <p className="text-purple-100 text-sm mt-1">
                    +{stats?.stats?.scansThisMonth || 0} lượt tháng này
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Người dùng mới nhất
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-6 text-base font-semibold text-gray-700">
                        Tên
                      </th>
                      <th className="text-left py-4 px-6 text-base font-semibold text-gray-700">
                        Email
                      </th>
                      <th className="text-left py-4 px-6 text-base font-semibold text-gray-700">
                        Điểm
                      </th>
                      <th className="text-left py-4 px-6 text-base font-semibold text-gray-700">
                        Role
                      </th>
                      <th className="text-left py-4 px-6 text-base font-semibold text-gray-700">
                        Ngày tạo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.recentUsers?.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 text-base font-medium text-gray-900">{user.name}</td>
                        <td className="py-4 px-6 text-base text-gray-600">{user.email}</td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-base font-medium">
                            {user.points}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1.5 rounded-full text-base font-medium ${
                            user.role === 'admin'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-base text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Scans */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Lượt quét gần nhất
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-6 text-base font-semibold text-gray-700">
                        Người dùng
                      </th>
                      <th className="text-left py-4 px-6 text-base font-semibold text-gray-700">
                        Sản phẩm
                      </th>
                      <th className="text-left py-4 px-6 text-base font-semibold text-gray-700">
                        Điểm xanh
                      </th>
                      <th className="text-left py-4 px-6 text-base font-semibold text-gray-700">
                        Thời gian
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.recentScans?.map((scan, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 text-base font-medium text-gray-900">{scan.user.name}</td>
                        <td className="py-4 px-6 text-base text-gray-700">{scan.product.name}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1.5 rounded-full text-base font-medium ${
                            scan.product.greenScore >= 8
                              ? 'bg-green-100 text-green-800'
                              : scan.product.greenScore >= 5
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {scan.product.greenScore.toFixed(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-base text-gray-600">
                          {new Date(scan.scannedAt).toLocaleString('vi-VN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs content */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900">
                Quản lý người dùng
              </h2>
              <button
                onClick={() => router.push('/admin/users/new')}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-base font-medium"
              >
                <FaUserPlus className="inline mr-2 text-lg" />
                Thêm người dùng
              </button>
            </div>
            <p className="text-gray-600 text-base">
              Tính năng quản lý chi tiết người dùng đang được phát triển...
            </p>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900">
                Quản lý sản phẩm
              </h2>
              <button
                onClick={() => router.push('/admin/products/new')}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-base font-medium"
              >
                Thêm sản phẩm
              </button>
            </div>
            <p className="text-gray-600 text-base">
              Tính năng quản lý chi tiết sản phẩm đang được phát triển...
            </p>
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900">
                Quản lý hoạt động xanh
              </h2>
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-base font-medium">
                Thêm hoạt động
              </button>
            </div>
            <p className="text-gray-600 text-base">
              Tính năng quản lý hoạt động xanh đang được phát triển...
            </p>
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900">
                Quản lý huy hiệu & thách thức
              </h2>
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-base font-medium">
                Thêm huy hiệu
              </button>
            </div>
            <p className="text-gray-600 text-base">
              Tính năng quản lý huy hiệu và thách thức đang được phát triển...
            </p>
          </div>
        )}

        {/* Posts Management Tab */}
        {activeTab === 'posts' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Quản lý tin tức
                </h2>
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-base font-medium"
                >
                  Tạo bài viết mới
                </button>
              </div>

              {/* Create Post Form */}
              {showCreatePost && (
                <div className="mb-8 p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Tạo bài viết mới</h3>
                  <form onSubmit={handleCreatePost} className="space-y-6">
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-3">
                        Nội dung bài viết *
                      </label>
                      <textarea
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
                        rows="6"
                        required
                        placeholder="Nhập nội dung bài viết..."
                      />
                    </div>
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-3">
                        URL hình ảnh (tùy chọn)
                      </label>
                      <input
                        type="text"
                        value={newPost.images}
                        onChange={(e) => setNewPost({ ...newPost, images: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-3">
                        Hoạt động liên quan (tùy chọn)
                      </label>
                      <input
                        type="text"
                        value={newPost.activity}
                        onChange={(e) => setNewPost({ ...newPost, activity: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
                        placeholder="Ví dụ: Trồng cây, Dọn rác..."
                      />
                    </div>
                    <div className="flex space-x-4 pt-4">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-base font-medium"
                      >
                        Đăng bài
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCreatePost(false);
                          setNewPost({ content: '', images: '', activity: '' });
                        }}
                        className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-base font-medium"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Posts List */}
              <div className="space-y-6">
                {posts.length === 0 ? (
                  <p className="text-gray-600 text-center py-12 text-lg">
                    Chưa có bài viết nào. Hãy tạo bài viết đầu tiên!
                  </p>
                ) : (
                  posts.map((post) => (
                    <div key={post.id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <span className="font-semibold text-gray-900 text-base">
                              {post.user.name}
                            </span>
                            <span className="text-gray-500 text-base">
                              {new Date(post.createdAt).toLocaleString('vi-VN')}
                            </span>
                          </div>
                          <p className="text-gray-700 whitespace-pre-wrap text-base leading-relaxed mb-4">{post.content}</p>
                          {post.activity && (
                            <div className="mb-4">
                              <span className="inline-block px-3 py-1.5 bg-green-100 text-green-800 text-base rounded-full font-medium">
                                {post.activity}
                              </span>
                            </div>
                          )}
                          {post.images && (
                            <div className="mb-4">
                              <img
                                src={post.images}
                                alt="Post"
                                className="max-w-2xl rounded-lg shadow-md"
                              />
                            </div>
                          )}
                          <div className="flex items-center space-x-6 text-base text-gray-600 pt-3 border-t border-gray-200">
                            <span className="font-medium">{post._count.likes} lượt thích</span>
                            <span className="font-medium">{post._count.comments} bình luận</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="ml-6 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-base font-medium"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
