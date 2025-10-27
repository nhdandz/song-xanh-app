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
            <div className={`min-h-screen ${isAdminPath ? 'bg-gray-100' : 'bg-green-50'}`}>
              <main className={isAdminPath ? '' : 'container mx-auto px-4 py-8 max-w-md'}>
                {children}
              </main>
              {showNavigation && <Navigation onMenuClick={toggleDrawer} />}
              {showNavigation && <DrawerMenu isOpen={isDrawerOpen} onClose={toggleDrawer} />}
            </div>
          </AuthGuard>
        </AppProvider>
      </body>
    </html>
  );
}