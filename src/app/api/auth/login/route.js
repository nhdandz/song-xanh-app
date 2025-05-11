import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
// Trong thực tế cần sử dụng thư viện mã hóa như bcrypt
// import bcrypt from 'bcrypt';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email và mật khẩu là bắt buộc' },
        { status: 400 }
      );
    }
    
    // Tìm người dùng theo email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }
    
    // Trong thực tế, cần kiểm tra mật khẩu với bcrypt
    // const passwordMatch = await bcrypt.compare(password, user.password);
    
    // Giả lập kiểm tra mật khẩu (demo)
    const passwordMatch = password === user.password;
    
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }
    
    // Không trả về mật khẩu
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({ 
      message: 'Đăng nhập thành công',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi đăng nhập' },
      { status: 500 }
    );
  }
}