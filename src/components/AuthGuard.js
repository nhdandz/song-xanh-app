'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppContext } from '../context/AppContext';

// Danh sách các trang không cần đăng nhập
const publicPaths = ['/dang-nhap', '/dang-ky'];

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { checkAuthentication } = useAppContext();

  useEffect(() => {
    const checkAuthStatus = async () => {
      // Bỏ qua tất cả trang admin (có auth riêng)
      if (pathname.startsWith('/admin')) {
        return;
      }

      if (publicPaths.includes(pathname)) {
        return;
      }

      const isLoggedIn = await checkAuthentication();

      // Nếu không đăng nhập và đang ở trang cần bảo vệ, chuyển hướng
      if (!isLoggedIn && !publicPaths.includes(pathname)) {
        router.push('/dang-nhap');
      }

      // Nếu đã đăng nhập mà truy cập trang đăng nhập/đăng ký, chuyển về trang chủ
      if (isLoggedIn && publicPaths.includes(pathname)) {
        router.push('/');
      }
    };

    checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return children;
}