'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaLock, FaLeaf } from 'react-icons/fa';
import { useAppContext } from '@/context/AppContext';

export default function Login() {
  const router = useRouter();
  const { login, loginDemo, isLoading } = useAppContext();
  const isNavigating = useRef(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Sau khi đăng nhập, admin vào khu quản trị, người dùng thường về trang chủ.
  // Vai trò lấy từ phiên do server cấp, không phải do client tự quyết.
  const redirectAfterLogin = (user) => {
    const next = new URLSearchParams(window.location.search).get('next');
    const isAdmin = user?.role === 'ADMIN';

    if (isAdmin) {
      router.replace(next || '/admin');
    } else {
      router.replace(next && !next.startsWith('/admin') ? next : '/');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (isNavigating.current || isLoading) return;

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      setError('');
      isNavigating.current = true;

      const user = await login(email, password);

      if (user) {
        redirectAfterLogin(user);
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

  // Đăng nhập nhanh bằng tài khoản mẫu. Thông tin tài khoản nằm ở server
  // (xem /api/auth/demo), trang này không giữ mật khẩu nào.
  const handleDemoLogin = async (as) => {
    if (isNavigating.current || isLoading) return;

    try {
      setError('');
      isNavigating.current = true;

      const user = await loginDemo(as);

      if (user) {
        redirectAfterLogin(user);
      } else {
        setError('Không thể đăng nhập demo. Hãy chạy: npm run prisma:seed');
        isNavigating.current = false;
      }
    } catch (error) {
      console.error('Demo login error:', error);
      setError(error.message || 'Không thể đăng nhập demo.');
      isNavigating.current = false;
    }
  };

  const busy = isLoading || isNavigating.current;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md sx-enter">
        {/* Nhãn thương hiệu */}
        <div className="text-center mb-7">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand mb-4">
            <FaLeaf className="text-white" size={28} />
          </span>
          <h1 className="text-3xl text-ink">Sống Xanh</h1>
          <p className="text-ink-soft mt-1.5">Mỗi hành động nhỏ, một thay đổi lớn.</p>
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
                <FaUser
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
                  size={14}
                />
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
                <FaLock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
                  size={14}
                />
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

            <button type="submit" className="sx-btn sx-btn-primary w-full" disabled={busy}>
              {busy ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-line" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-paper text-xs font-bold text-ink-faint uppercase tracking-wider">
                Tài khoản mẫu
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleDemoLogin('user')}
              className="sx-btn sx-btn-outline w-full"
              disabled={busy}
            >
              Học sinh
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="sx-btn sx-btn-outline w-full"
              disabled={busy}
            >
              Quản trị
            </button>
          </div>
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
