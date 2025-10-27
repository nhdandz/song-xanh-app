'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaLock, FaShieldAlt } from 'react-icons/fa';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Đăng nhập thất bại');
        setLoading(false);
        return;
      }

      // Lưu thông tin admin vào localStorage
      localStorage.setItem('admin', JSON.stringify(data.user));

      // Chuyển đến dashboard
      router.push('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Đã xảy ra lỗi khi đăng nhập');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block">
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-12 text-white shadow-2xl">
            <div className="mb-8">
              <FaShieldAlt className="text-6xl mb-6" />
              <h1 className="text-5xl font-bold mb-4">Song Xanh Admin</h1>
              <p className="text-xl text-green-100">
                Hệ thống quản lý ứng dụng môi trường
              </p>
            </div>
            <div className="space-y-4 mt-12">
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <FaUser className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Quản lý người dùng</h3>
                  <p className="text-green-100">Theo dõi và quản lý toàn bộ người dùng</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <FaShieldAlt className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Bảo mật cao</h3>
                  <p className="text-green-100">Hệ thống xác thực an toàn</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 lg:hidden">
                <FaShieldAlt className="text-green-600 text-4xl" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                Đăng nhập
              </h2>
              <p className="text-gray-600 text-lg">
                Vui lòng đăng nhập để truy cập bảng quản trị
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 text-base">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-3 text-base">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400 text-lg" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base transition-all"
                    placeholder="admin@songxanh.vn"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-3 text-base">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400 text-lg" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang đăng nhập...
                  </span>
                ) : (
                  'Đăng nhập'
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t-2 border-gray-100">
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <FaShieldAlt className="text-lg" />
                <p className="text-sm font-medium">
                  Chỉ dành cho quản trị viên hệ thống
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
