import { NextResponse } from 'next/server';

export function checkAdminAuth(request) {
  // Kiểm tra session/token từ cookies hoặc headers
  const token = request.cookies.get('admin-token')?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized - Admin access required' },
      { status: 401 }
    );
  }

  return null; // Cho phép tiếp tục
}

export async function requireAdmin(userId, prisma) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });

  if (!user || user.role !== 'admin') {
    return false;
  }

  return true;
}
