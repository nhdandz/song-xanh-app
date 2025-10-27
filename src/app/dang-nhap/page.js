'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaLock, FaLeaf } from 'react-icons/fa';
import { useAppContext } from '../../context/AppContext';

export default function Login() {
  const router = useRouter();
  const { login, isLoading } = useAppContext();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      setError('');

      // Kiểm tra xem có phải admin không
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Email hoặc mật khẩu không đúng');
        return;
      }

      const { user } = await response.json();

      // Nếu là admin, chuyển đến trang admin
      if (user.role === 'admin') {
        // Lưu thông tin admin vào localStorage
        localStorage.setItem('admin', JSON.stringify(user));

        // Set cookie admin-token
        document.cookie = `admin-token=${user.id}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days

        router.push('/admin/dashboard');
      } else {
        // Nếu là user thông thường, gọi hàm login từ context
        const success = await login(email, password);

        if (success) {
          // Chuyển hướng về trang chủ
          router.push('/');
        } else {
          setError('Email hoặc mật khẩu không đúng');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Đăng nhập thất bại');
    }
  };
  
  // Mô phỏng đăng nhập demo (không cần API thực tế)
    const handleDemoLogin = async () => {
    // Demo sử dụng tài khoản mẫu
    setEmail('hocsinh@example.com');
    setPassword('password123');
    
    // Gọi API đăng nhập với tài khoản demo
    const success = await login('hocsinh@example.com', 'password123');
    
    if (success) {
      // Chuyển hướng về trang chủ (sử dụng setTimeout để tránh lỗi khi render)
      setTimeout(() => {
        router.push('/');
      }, 0);
    } else {
      setError('Không thể đăng nhập với tài khoản demo. Vui lòng thử lại hoặc tạo tài khoản mới.');
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-green-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <FaLeaf className="text-green-600 text-3xl" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-green-800">
            Đăng nhập
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            hoặc{' '}
            <Link href="/dang-ky" className="font-medium text-green-600 hover:text-green-500">
              đăng ký tài khoản mới
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 text-sm">
              {error}
            </div>
          )}
          
          <div className="rounded-md space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="sr-only">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                Ghi nhớ đăng nhập
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className="font-medium text-green-600 hover:text-green-500">
                Quên mật khẩu?
              </a>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </div>
        </form>
        
        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc tiếp tục với</span>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleDemoLogin}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng nhập Demo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}