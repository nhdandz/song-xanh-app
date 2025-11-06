'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import DrawerMenu from '@/components/DrawerMenu';
import AuthGuard from '@/components/AuthGuard';
import { AppProvider } from '@/context/AppContext';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

// Danh sách các trang không cần hiện menu điều hướng
const noNavPaths = ['/dang-nhap', '/dang-ky'];

export default function RootLayout({ children }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const isAdminPath = pathname?.startsWith('/admin');
  const showNavigation = !noNavPaths.includes(pathname) && !isAdminPath;

  return (
    <html lang="vi">
      <body className={inter.className}>
        <AppProvider>
          <AuthGuard>
            <div className={`min-h-screen ${isAdminPath ? 'bg-gray-100' : 'bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/30'}`}>
              {showNavigation && <Navigation onMenuClick={toggleDrawer} />}
              <main className={`${isAdminPath ? '' : 'lg:ml-64'} min-h-screen`}>
                {/* Decorative background elements */}
                {!isAdminPath && showNavigation && (
                  <>
                    <div className="fixed top-20 right-10 w-72 h-72 bg-green-200 rounded-full opacity-10 blur-3xl pointer-events-none z-0"></div>
                    <div className="fixed bottom-40 left-20 lg:left-80 w-96 h-96 bg-emerald-200 rounded-full opacity-10 blur-3xl pointer-events-none z-0"></div>
                  </>
                )}
                <div className="relative z-10">
                  {children}
                </div>
              </main>
              {showNavigation && <DrawerMenu isOpen={isDrawerOpen} onClose={toggleDrawer} />}
            </div>
          </AuthGuard>
        </AppProvider>
      </body>
    </html>
  );
}