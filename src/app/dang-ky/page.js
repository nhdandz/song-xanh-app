'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaLock, FaEnvelope, FaSchool, FaLeaf } from 'react-icons/fa';
import { useAppContext } from '@/context/AppContext';

export default function Register() {
  const router = useRouter();
  const { login, isLoading } = useAppContext();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    school: '',
  });
  
  const [error, setError] = useState('');
  const [registering, setRegistering] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    
    const { name, email, password, passwordConfirm, school } = formData;
    
    // Kiểm tra đầy đủ thông tin
    if (!name || !email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin bắt buộc');
      return;
    }
    
    // Kiểm tra mật khẩu trùng khớp
    if (password !== passwordConfirm) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    
    try {
      setRegistering(true);
      setError('');
      
      // Gọi API đăng ký
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          school,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Đăng ký thất bại');
      }
      
      // Đăng nhập tự động sau khi đăng ký thành công
      // Đăng nhập tự động sau khi đăng ký thành công
      const loginSuccess = await login(email, password);
      
      if (loginSuccess) {
        // Chuyển hướng đến trang welcome cho người dùng mới
        setTimeout(() => {
          router.push('/welcome');
        }, 0);
      } else {
        // Nếu đăng nhập tự động thất bại, chuyển về trang đăng nhập
        setTimeout(() => {
          router.push('/dang-nhap');
        }, 0);
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Đăng ký thất bại');
    } finally {
      setRegistering(false);
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
            Đăng ký tài khoản
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            hoặc{' '}
            <Link href="/dang-nhap" className="font-medium text-green-600 hover:text-green-500">
              đăng nhập nếu đã có tài khoản
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 text-sm">
              {error}
            </div>
          )}
          
          <div className="rounded-md space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Họ tên
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Họ tên"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
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
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="passwordConfirm" className="sr-only">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Xác nhận mật khẩu"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="school" className="sr-only">
                Trường học
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSchool className="text-gray-400" />
                </div>
                <input
                  id="school"
                  name="school"
                  type="text"
                  autoComplete="organization"
                  className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Trường học (không bắt buộc)"
                  value={formData.school}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={registering || isLoading}
            >
              {registering ? 'Đang đăng ký...' : isLoading ? 'Đang xử lý...' : 'Đăng ký'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}