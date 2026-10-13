'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaLock, FaLeaf } from 'react-icons/fa';
import { useAppContext } from '@/context/AppContext';

export default function Login() {
  const router = useRouter();
  const { login, isLoading } = useAppContext();
  const isNavigating = useRef(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // === CẤU HÌNH ADMIN NGAY Ở ĐÂY (THAY BẰNG EMAIL + PASS BẠN MUỐN) ===
  // CẢNH BÁO: KHÔNG AN TOÀN CHO PRODUCTION — CHỈ DÙNG CHO DEMO/TẠM THỜI
  const ADMIN_EMAIL = 'test123@gmail.com';
  const ADMIN_PASS = '12345678';
  // ==================================================================

  const handleLogin = async (e) => {
    e.preventDefault();
    // --- KIỂM TRA NHANH ADMIN CHỈ TRÊN CLIENT (SIÊU NHANH) ---
    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    try {
    // nếu muốn gọi login để backend set session thì giữ dòng này
    await login(email, password);
    } catch (err) {
    console.warn('Admin quick login: backend login error (ignored)', err);
    }

    // --- SET COOKIE isAdmin = '1' (không httpOnly) ---
    // đặt path=/ để cookie có hiệu lực toàn site, max-age tính bằng giây
    document.cookie = 'isAdmin=1; path=/; max-age=' + 8 * 60 * 60 + ';';
    // --------------------------------------------------

    router.replace('/admin');
  return;
}

    // ---------------------------------------------------------

    // Ngăn chặn đăng nhập trùng lặp
    if (isNavigating.current || isLoading) return;
    
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    
    try {
      setError('');
      isNavigating.current = true;
      
      // Gọi hàm đăng nhập từ context
      const success = await login(email, password);
      
      if (success) {
        // Chuyển hướng về trang chủ sử dụng replace thay vì push
        router.replace('/');
      } else {
        setError('Email hoặc mật khẩu không đúng');
        isNavigating.current = false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Đăng nhập thất bại');
      isNavigating.current = false;
    }
  };
  
  // Mô phỏng đăng nhập demo (không cần API thực tế)
  const handleDemoLogin = async () => {
    // Ngăn chặn đăng nhập trùng lặp
    if (isNavigating.current || isLoading) return;
    
    try {
      // Demo sử dụng tài khoản mẫu
      setEmail('hocsinh@example.com');
      setPassword('password123');
      
      isNavigating.current = true;
      
      // Gọi API đăng nhập với tài khoản demo
      const success = await login('hocsinh@example.com', 'password123');
      
      if (success) {
        // Chuyển hướng về trang chủ sử dụng replace
        router.replace('/');
      } else {
        setError('Không thể đăng nhập với tài khoản demo. Vui lòng thử lại hoặc tạo tài khoản mới.');
        isNavigating.current = false;
      }
    } catch (error) {
      console.error('Demo login error:', error);
      setError('Không thể đăng nhập với tài khoản demo. Vui lòng thử lại.');
      isNavigating.current = false;
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md sx-enter">
        {/* Nhãn thương hiệu */}
        <div className="text-center mb-7">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand mb-4">
            <FaLeaf className="text-white" size={28} />
          </span>
          <h1 className="text-3xl text-ink">Sống Xanh</h1>
          <p className="text-ink-soft mt-1.5">
            Mỗi hành động nhỏ, một thay đổi lớn.
          </p>
        </div>

        <div className="sx-card p-6 sm:p-7">
          <h2 className="text-xl text-ink mb-5">Đăng nhập</h2>

          <form className="space-y-4" onSubmit={handleLogin}>
            {error && (
              <div className="bg-coral-wash border border-coral/30 text-coral rounded-xl p-3 text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-ink-soft mb-1.5">
                Email
              </label>
              <div className="relative">
                <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" size={14} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-[1.5px] border-line bg-paper text-ink placeholder:text-ink-faint focus:outline-none focus:border-brand transition-colors"
                  placeholder="ten@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-ink-soft mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" size={14} />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-[1.5px] border-line bg-paper text-ink placeholder:text-ink-faint focus:outline-none focus:border-brand transition-colors"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 accent-[var(--color-brand)] rounded"
                />
                <span className="text-sm font-medium text-ink-soft">Ghi nhớ</span>
              </label>
              <a href="#" className="text-sm font-bold text-brand hover:underline">
                Quên mật khẩu?
              </a>
            </div>

            <button
              type="submit"
              className="sx-btn sx-btn-primary w-full"
              disabled={isLoading || isNavigating.current}
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-line" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-paper text-xs font-bold text-ink-faint uppercase tracking-wider">
                Hoặc
              </span>
            </div>
          </div>

          <button
            onClick={handleDemoLogin}
            className="sx-btn sx-btn-outline w-full"
            disabled={isLoading || isNavigating.current}
          >
            {isLoading ? 'Đang xử lý...' : 'Dùng thử tài khoản demo'}
          </button>
        </div>

        <p className="text-center text-sm text-ink-soft mt-5">
          Chưa có tài khoản?{' '}
          <Link href="/dang-ky" className="font-bold text-brand hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
