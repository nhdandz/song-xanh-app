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

// Những đường dẫn không hiện navigation (ví dụ đăng nhập/đăng ký)
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
      <body className={`${inter.className}`}>
        <AppProvider>
          <AuthGuard>
            {/* Flex column để footer luôn nằm đáy nếu nội dung ngắn */}
            <div
              className={`min-h-screen flex flex-col ${
                isAdminPath
                  ? 'bg-gray-100'
                  : 'bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/30'
              }`}
            >
              {/* Navigation (nếu có) */}
              {showNavigation && <Navigation onMenuClick={toggleDrawer} />}

              {/* Nội dung chính */}
              <main className={`${isAdminPath ? '' : 'lg:ml-64'} flex-grow`}>
                {/* Decorative background elements (chỉ khi không phải admin và có navigation) */}
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

              {/* Footer bản quyền - xuất hiện ở cuối mọi trang và responsive */}
              <footer className="w-full border-t border-gray-200 mt-6">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:py-5">
                  <p className="text-center text-gray-500 text-xs sm:text-sm md:text-base">
                    © {new Date().getFullYear()} Ngọc Tú-Nhật Minh
                  </p>
                </div>
              </footer>

              {/* Drawer menu (nếu có) */}
              {showNavigation && <DrawerMenu isOpen={isDrawerOpen} onClose={toggleDrawer} />}
            </div>
          </AuthGuard>
        </AppProvider>
      </body>
    </html>
  );
}
