
'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import DrawerMenu from '@/components/DrawerMenu';
import { AppProvider } from '@/context/AppContext';
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  
  return (
    <html lang="vi">
      <body className={inter.className}>
        <AppProvider>
          <div className="min-h-screen bg-green-50">
            <main className="container mx-auto px-4 py-8 max-w-md">
              {children}
            </main>
            <Navigation onMenuClick={toggleDrawer} />
            <DrawerMenu isOpen={isDrawerOpen} onClose={toggleDrawer} />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}