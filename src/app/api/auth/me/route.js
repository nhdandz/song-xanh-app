import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// Cho client khôi phục phiên sau khi tải lại trang, thay vì tin vào localStorage.
export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      points: true,
      level: true,
      school: true,
    },
  });

  return NextResponse.json({ user });
}
