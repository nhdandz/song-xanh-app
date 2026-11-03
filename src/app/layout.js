import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import AppShell from '@/components/AppShell';
import { APP_DESCRIPTION, APP_NAME } from '@/lib/app-config';

// Be Vietnam Pro được thiết kế riêng cho tiếng Việt nên dấu không bị vỡ như Inter
const beVietnam = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-be-vietnam',
  display: 'swap',
});

// Tên hiển thị trên tab trình duyệt. Layout phải là server component mới
// export được metadata, nên phần giao diện động nằm trong <AppShell>.
export const metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={beVietnam.variable}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
