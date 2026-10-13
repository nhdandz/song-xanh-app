import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth';
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from '@/lib/auth-token';

// Đăng nhập nhanh bằng tài khoản mẫu, dành cho lúc demo/chấm bài.
// Thông tin tài khoản nằm trong biến môi trường phía server, không nằm
// trong source của client. Đường đi vẫn là kiểm mật khẩu thật rồi cấp
// phiên như mọi người dùng khác — không có lối tắt nào.
export async function POST(request) {
  if (process.env.ENABLE_DEMO_LOGIN === 'false') {
    return NextResponse.json(
      { error: 'Đăng nhập demo đã bị tắt' },
      { status: 404 }
    );
  }

  try {
    const { as } = await request.json();

    const isAdmin = as === 'admin';
    const email = isAdmin ? process.env.SEED_ADMIN_EMAIL : process.env.SEED_USER_EMAIL;
    const password = isAdmin
      ? process.env.SEED_ADMIN_PASSWORD
      : process.env.SEED_USER_PASSWORD;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Tài khoản demo chưa được cấu hình trên server' },
        { status: 500 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, password: true, role: true },
    });

    const passwordMatch = await verifyPassword(password, user?.password);

    if (!user || !passwordMatch) {
      return NextResponse.json(
        { error: 'Tài khoản demo chưa được tạo. Hãy chạy: npm run prisma:seed' },
        { status: 401 }
      );
    }

    const { password: _, ...userWithoutPassword } = user;

    const token = await createSessionToken({ id: user.id, role: user.role });

    const response = NextResponse.json({
      message: 'Đăng nhập thành công',
      user: userWithoutPassword,
    });
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());

    return response;
  } catch (error) {
    console.error('Demo login error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi đăng nhập demo' },
      { status: 500 }
    );
  }
}
