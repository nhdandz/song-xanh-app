'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

// Danh sách các trang không cần đăng nhập
const publicPaths = ['/dang-nhap', '/dang-ky'];

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, checkAuthentication } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const isRedirecting = useRef(false);
  const authCheckPerformed = useRef(false);

  useEffect(() => {
    // Tránh kiểm tra xác thực nhiều lần
    if (isRedirecting.current) return;
    
    const checkAuthStatus = async () => {
      try {
        // Nếu đang ở trang công khai, không cần kiểm tra
        if (publicPaths.includes(pathname)) {
          setIsLoading(false);
          return;
        }
        
        // Nếu đã xác thực, không cần kiểm tra lại
        if (isAuthenticated) {
          setIsLoading(false);
          return;
        }
        
        // Kiểm tra trạng thái xác thực
        const isLoggedIn = await checkAuthentication();
        authCheckPerformed.current = true;
        
        // Nếu không đăng nhập và đang ở trang cần bảo vệ, chuyển hướng
        if (!isLoggedIn && !publicPaths.includes(pathname)) {
          isRedirecting.current = true;
          
          // Sử dụng replace thay vì push để tránh vòng lặp
          router.replace('/dang-nhap');
          
          // Reset biến isRedirecting sau khi chuyển hướng hoàn tất
          setTimeout(() => {
            isRedirecting.current = false;
          }, 1000);
          
          return;
        }
        
        // Nếu đã đăng nhập mà truy cập trang đăng nhập/đăng ký, chuyển về trang chủ
        if (isLoggedIn && publicPaths.includes(pathname)) {
          isRedirecting.current = true;
          
          // Sử dụng replace thay vì push để tránh vòng lặp
          router.replace('/');
          
          // Reset biến isRedirecting sau khi chuyển hướng hoàn tất
          setTimeout(() => {
            isRedirecting.current = false;
          }, 1000);
          
          return;
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        // Kết thúc trạng thái loading
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, [pathname, isAuthenticated, router, checkAuthentication]);

  // Hiển thị loading khi đang tải hoặc kiểm tra xác thực
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  return children;
}