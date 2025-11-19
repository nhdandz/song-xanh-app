// 'use client';

// import { Inter } from 'next/font/google';
// import './globals.css';
// import Navigation from '@/components/Navigation';
// import DrawerMenu from '@/components/DrawerMenu';
// import AuthGuard from '@/components/AuthGuard';
// import { AppProvider } from '@/context/AppContext';
// import { useState } from 'react';
// import { usePathname } from 'next/navigation';

// const inter = Inter({ subsets: ['latin'] });

// // Danh sách các trang không cần hiện menu điều hướng
// const noNavPaths = ['/dang-nhap', '/dang-ky'];

// export default function RootLayout({ children }) {
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const pathname = usePathname();

//   const toggleDrawer = () => {
//     setIsDrawerOpen(!isDrawerOpen);
//   };

//   const isAdminPath = pathname?.startsWith('/admin');
//   const showNavigation = !noNavPaths.includes(pathname) && !isAdminPath;

//   return (
//     <html lang="vi">
//       <body className={inter.className}>
//         <AppProvider>
//           <AuthGuard>
//             <div className={`min-h-screen ${isAdminPath ? 'bg-gray-100' : 'bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/30'}`}>
//               {showNavigation && <Navigation onMenuClick={toggleDrawer} />}
//               <main className={`${isAdminPath ? '' : 'lg:ml-64'} min-h-screen`}>
//                 {/* Decorative background elements */}
//                 {!isAdminPath && showNavigation && (
//                   <>
//                     <div className="fixed top-20 right-10 w-72 h-72 bg-green-200 rounded-full opacity-10 blur-3xl pointer-events-none z-0"></div>
//                     <div className="fixed bottom-40 left-20 lg:left-80 w-96 h-96 bg-emerald-200 rounded-full opacity-10 blur-3xl pointer-events-none z-0"></div>
//                   </>
//                 )}
//                 <div className="relative z-10">
//                   {children}
//                 </div>
//               </main>
//               {showNavigation && <DrawerMenu isOpen={isDrawerOpen} onClose={toggleDrawer} />}
//             </div>
//           </AuthGuard>
//         </AppProvider>
//       </body>
//     </html>
//   );
// }

// app/layout.js
// Dùng JS (KHÔNG TS). File này là RootLayout cho Next.js App Router (đặt trong `app/layout.js`).
// File dùng 'use client' vì dùng hooks (useState, usePathname).

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

  const year = new Date().getFullYear();

  return (
    <html lang="vi">
      {/* body đặt class flex-col để footer nằm dưới cùng */}
      <body className={`${inter.className} min-h-screen flex flex-col`}>
  <AppProvider>
    <AuthGuard>
      {/* CONTENT */}
      <div className={`flex-1 ${isAdminPath ? 'bg-gray-100' : 'bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/30'}`}>
        {showNavigation && <Navigation onMenuClick={toggleDrawer} />}

        <main className={`${isAdminPath ? '' : 'lg:ml-64'} flex-1`}>
          {!isAdminPath && showNavigation && (
            <>
              <div className="fixed top-20 right-10 w-72 h-72 bg-green-200 rounded-full opacity-10 blur-3xl pointer-events-none z-0"></div>
              <div className="fixed bottom-40 left-20 lg:left-80 w-96 h-96 bg-emerald-200 rounded-full opacity-10 blur-3xl pointer-events-none z-0"></div>
            </>
          )}

          <div className="relative z-10">{children}</div>
        </main>

        {showNavigation && <DrawerMenu isOpen={isDrawerOpen} onClose={toggleDrawer} />}
      </div>

      {/* FOOTER NẰM NGOÀI DIV */}
      <Footer year={year} />
        </AuthGuard>
      </AppProvider>
    </body>

    </html>
  );
}

// Footer component (JS) — chỉnh dễ dàng: đổi text, links, style
function Footer({ year }) {
  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200 py-6">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="text-sm text-slate-600">© {year} — Sống Xanh. Bùi Ngọc Tú-Nguyễn Hoàng Nhật Minh.</div>

        <div className="flex items-center gap-4 text-sm text-slate-500">
          <a href="/terms" className="hover:underline">Điều khoản</a>
          <a href="/privacy" className="hover:underline">Chính sách bảo mật</a>
          <a href="/contact" className="hover:underline">Liên hệ</a>
        </div>
      </div>
    </footer>
  );
}
