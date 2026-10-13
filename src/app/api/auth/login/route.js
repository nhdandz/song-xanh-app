import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth';
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from '@/lib/auth-token';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email và mật khẩu là bắt buộc' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
      },
    });

    // So khớp mật khẩu đã hash. Thông báo lỗi giữ nguyên một kiểu cho cả
    // trường hợp sai email lẫn sai mật khẩu, để không lộ email nào có thật.
    const passwordMatch = await verifyPassword(password, user?.password);

    if (!user || !passwordMatch) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng' },
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
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi đăng nhập' },
      { status: 500 }
    );
  }
}
