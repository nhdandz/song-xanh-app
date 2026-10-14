'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaLock, FaLeaf, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAppContext } from '@/context/AppContext';

// Vài lý do ngắn để học sinh thấy đáng đăng nhập, đặt ở cột trái
const PERKS = [
  { icon: '🌱', text: 'Ghi nhận hành động xanh mỗi ngày' },
  { icon: '🎮', text: 'Chơi game, học kiến thức môi trường' },
  { icon: '🎁', text: 'Tích điểm đổi quà thật' },
];

export default function Login() {
  const router = useRouter();
  const { login, loginDemo, isLoading } = useAppContext();
  const isNavigating = useRef(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
  const inputClass =
    'w-full pl-11 pr-4 py-3.5 rounded-xl border-[1.5px] border-line bg-paper text-ink placeholder:text-ink-faint focus:outline-none focus:border-brand transition-colors';

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* ============ Cột trái: giới thiệu (ẩn trên điện thoại) ============ */}
      <aside className="hidden lg:flex flex-col bg-brand-dark relative overflow-hidden">
        <div className="relative z-10 p-10 xl:p-14">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-14">
            <span className="w-10 h-10 bg-brand-bright rounded-xl flex items-center justify-center">
              <FaLeaf className="text-brand-dark" size={19} />
            </span>
            <span className="text-xl font-extrabold text-white">Sống Xanh</span>
          </Link>

          <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.12] tracking-tight">
            Mỗi hành động nhỏ,
            <br />
            <span className="text-brand-bright">một thay đổi lớn.</span>
          </h2>

          <p className="text-white/70 mt-5 text-lg leading-relaxed max-w-md">
            Cùng bạn bè biến những việc nhỏ hằng ngày thành thói quen sống xanh.
          </p>

          <ul className="mt-9 space-y-3.5">
            {PERKS.map((perk) => (
              <li key={perk.text} className="flex items-center gap-3.5">
                <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg shrink-0">
                  {perk.icon}
                </span>
                <span className="text-white/85 font-medium">{perk.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Ảnh minh hoạ sát đáy. object-bottom để cắt bỏ phần tiêu đề có sẵn
            trong ảnh, chỉ giữ lại các nhân vật. */}
        <div className="relative mt-auto h-[46%] min-h-[240px]">
          <img
            src="/images/the-he-Z.png"
            alt="Các bạn trẻ cùng hành động vì môi trường"
            className="absolute inset-0 w-full h-full object-cover object-bottom"
          />
          {/* Hoà ảnh vào nền xanh đậm để không lộ đường cắt */}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-brand-dark to-transparent" />
        </div>
      </aside>

      {/* ============ Cột phải: biểu mẫu ============ */}
      <main className="flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-[400px] sx-enter">
          {/* Banner gọn thay cho cột trái khi ở điện thoại — phần lớn học sinh
              dùng điện thoại nên vẫn cần thấy hình ảnh và thông điệp */}
          <div className="lg:hidden sx-dark relative overflow-hidden mb-7">
            <div className="relative z-10 px-5 pt-5 pb-3">
              <span className="inline-flex items-center gap-2">
                <span className="w-8 h-8 bg-brand-bright rounded-lg flex items-center justify-center">
                  <FaLeaf className="text-brand-dark" size={15} />
                </span>
                <span className="font-extrabold text-white">Sống Xanh</span>
              </span>
              <p className="text-white font-extrabold text-lg leading-snug mt-3">
                Mỗi hành động nhỏ,
                <br />
                <span className="text-brand-bright">một thay đổi lớn.</span>
              </p>
            </div>
            <div className="relative h-28">
              <img
                src="/images/the-he-Z.png"
                alt="Các bạn trẻ cùng hành động vì môi trường"
                className="absolute inset-0 w-full h-full object-cover object-bottom"
              />
              <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-brand-dark to-transparent" />
            </div>
          </div>

          <h1 className="text-3xl text-ink">Chào bạn trở lại</h1>
          <p className="text-ink-soft mt-1.5 mb-7">
            Đăng nhập để tiếp tục hành trình sống xanh.
          </p>

          <form className="space-y-4" onSubmit={handleLogin}>
            {error && (
              <div
                role="alert"
                className="bg-coral-wash border border-coral/30 text-coral rounded-xl p-3 text-sm font-medium"
              >
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-ink-soft mb-1.5">
                Email
              </label>
              <div className="relative">
                <FaUser
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none"
                  size={14}
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={inputClass}
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none"
                  size={14}
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className={`${inputClass} pr-12`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-ink-faint hover:text-ink transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-0.5">
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

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-line" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-canvas text-xs font-bold text-ink-faint uppercase tracking-wider">
                Dùng thử nhanh
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

          <p className="text-center text-sm text-ink-soft mt-7">
            Chưa có tài khoản?{' '}
            <Link href="/dang-ky" className="font-bold text-brand hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
