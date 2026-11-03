'use client';

import { usePathname } from 'next/navigation';
import Navigation from '@/components/Navigation';
import AuthGuard from '@/components/AuthGuard';
import { AppProvider } from '@/context/AppContext';

// Những đường dẫn không hiện navigation (ví dụ đăng nhập/đăng ký)
const noNavPaths = ['/dang-nhap', '/dang-ky'];

export default function AppShell({ children }) {
  const pathname = usePathname();

  const isAdminPath = pathname?.startsWith('/admin');
  const isAuthPage = noNavPaths.includes(pathname);
  const showNavigation = !isAuthPage && !isAdminPath;

  // Lề trái phải bám theo việc CÓ sidebar hay không, chứ không phải theo
  // "có phải trang admin không". Trang đăng nhập/đăng ký không có sidebar
  // nào cả, nếu vẫn đẩy lg:ml-72 thì nội dung lệch hẳn sang phải 288px.
  const contentOffset = showNavigation ? 'lg:ml-72' : isAdminPath ? 'lg:ml-64' : '';

  return (
    <AppProvider>
      <AuthGuard>
        {/* Flex column để footer luôn nằm đáy nếu nội dung ngắn */}
        <div className={`min-h-screen flex flex-col ${isAdminPath ? 'bg-canvas' : ''}`}>
          {/* Navigation (nếu có) */}
          {showNavigation && <Navigation />}

          {/* Nội dung chính. Trang đăng nhập/đăng ký tự lo chiều cao
              nên bỏ flex-grow để không bị đẩy thêm khoảng trống.
              Trên điện thoại phải chừa 56px cho thanh trên cố định. */}
          <main
            className={`${contentOffset} ${isAuthPage ? '' : 'flex-grow'} ${
              showNavigation ? 'pt-14 lg:pt-0' : ''
            }`}
          >
            {children}
          </main>

          {/* Footer bản quyền. Không dùng w-full: cộng với lg:ml-72 sẽ
              thành 100% + 288px và làm cả trang tràn ngang.
              Trang đăng nhập/đăng ký là màn hình toàn khung nên không có
              footer. */}
          {!isAuthPage && (
            <footer
              className={`border-t border-line ${contentOffset} ${
                showNavigation
                  ? 'pb-[calc(4.75rem+env(safe-area-inset-bottom))] lg:pb-0'
                  : ''
              }`}
            >
              <div className="max-w-6xl mx-auto px-4 py-5">
                <p className="text-center text-ink-faint text-xs sm:text-sm">
                  © {new Date().getFullYear()} Ngọc Tú — Nhật Minh
                </p>
              </div>
            </footer>
          )}
        </div>
      </AuthGuard>
    </AppProvider>
  );
}
