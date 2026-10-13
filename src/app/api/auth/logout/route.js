import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth-token';

export async function POST() {
  const response = NextResponse.json({ message: 'Đã đăng xuất' });

  // Xoá cookie phiên bằng cách đặt maxAge = 0
  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });

  return response;
}
