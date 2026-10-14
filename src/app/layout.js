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

import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import DrawerMenu from '@/components/DrawerMenu';
import AuthGuard from '@/components/AuthGuard';
import { AppProvider } from '@/context/AppContext';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

// Be Vietnam Pro được thiết kế riêng cho tiếng Việt nên dấu không bị vỡ như Inter
const beVietnam = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-be-vietnam',
  display: 'swap',
});

// Những đường dẫn không hiện navigation (ví dụ đăng nhập/đăng ký)
const noNavPaths = ['/dang-nhap', '/dang-ky'];

export default function RootLayout({ children }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const isAdminPath = pathname?.startsWith('/admin');
  const isAuthPage = noNavPaths.includes(pathname);
  const showNavigation = !isAuthPage && !isAdminPath;

  // Lề trái phải bám theo việc CÓ sidebar hay không, chứ không phải theo
  // "có phải trang admin không". Trang đăng nhập/đăng ký không có sidebar
  // nào cả, nếu vẫn đẩy lg:ml-72 thì nội dung lệch hẳn sang phải 288px.
  const contentOffset = showNavigation ? 'lg:ml-72' : isAdminPath ? 'lg:ml-64' : '';

  return (
    <html lang="vi" className={beVietnam.variable}>
      <body>
        <AppProvider>
          <AuthGuard>
            {/* Flex column để footer luôn nằm đáy nếu nội dung ngắn */}
            <div className={`min-h-screen flex flex-col ${isAdminPath ? 'bg-canvas' : ''}`}>
              {/* Navigation (nếu có) */}
              {showNavigation && <Navigation onMenuClick={toggleDrawer} />}

              {/* Nội dung chính. Trang đăng nhập/đăng ký tự lo chiều cao
                  nên bỏ flex-grow để không bị đẩy thêm khoảng trống. */}
              <main className={`${contentOffset} ${isAuthPage ? '' : 'flex-grow'}`}>
                {children}
              </main>

              {/* Footer bản quyền. Không dùng w-full: cộng với lg:ml-72 sẽ
                  thành 100% + 288px và làm cả trang tràn ngang.
                  Trang đăng nhập/đăng ký là màn hình toàn khung nên không có
                  footer. */}
              {!isAuthPage && (
                <footer className={`border-t border-line ${contentOffset}`}>
                  <div className="max-w-6xl mx-auto px-4 py-5">
                    <p className="text-center text-ink-faint text-xs sm:text-sm">
                      © {new Date().getFullYear()} Ngọc Tú — Nhật Minh
                    </p>
                  </div>
                </footer>
              )}

              {/* Drawer menu (nếu có) */}
              {showNavigation && <DrawerMenu isOpen={isDrawerOpen} onClose={toggleDrawer} />}
            </div>
          </AuthGuard>
        </AppProvider>
      </body>
    </html>
  );
}
