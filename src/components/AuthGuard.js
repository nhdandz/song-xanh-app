'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

// Danh sách các trang không cần đăng nhập
const publicPaths = ['/dang-nhap', '/dang-ky'];

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, checkAuthentication } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectPath, setRedirectPath] = useState('');

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (publicPaths.includes(pathname)) {
        setIsLoading(false);
        return;
      }
      
      const isLoggedIn = await checkAuthentication();
      
      // Nếu không đăng nhập và đang ở trang cần bảo vệ, đánh dấu cần chuyển hướng
      if (!isLoggedIn && !publicPaths.includes(pathname)) {
        setRedirectPath('/dang-nhap');
        setShouldRedirect(true);
      }
      
      // Nếu đã đăng nhập mà truy cập trang đăng nhập/đăng ký, chuyển về trang chủ
      if (isLoggedIn && publicPaths.includes(pathname)) {
        setRedirectPath('/');
        setShouldRedirect(true);
      }
      
      setIsLoading(false);
    };
    
    checkAuthStatus();
  }, [pathname, isAuthenticated]);
  
  // Xử lý chuyển hướng trong useEffect riêng để tránh lỗi
  useEffect(() => {
    if (shouldRedirect && redirectPath) {
      router.push(redirectPath);
    }
  }, [shouldRedirect, redirectPath, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  // Nếu cần chuyển hướng, hiển thị loading trong khi chờ chuyển
  if (shouldRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  return children;
}