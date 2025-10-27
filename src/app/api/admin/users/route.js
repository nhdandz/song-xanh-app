import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Lấy danh sách người dùng
export async function GET(request) {
  try {
    const adminToken = request.cookies.get('admin-token')?.value;
    if (!adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          school: true,
          points: true,
          level: true,
          createdAt: true,
          _count: {
            select: {
              userActivities: true,
              scanHistories: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy danh sách người dùng' },
      { status: 500 }
    );
  }
}

// PUT - Cập nhật người dùng
export async function PUT(request) {
  try {
    const adminToken = request.cookies.get('admin-token')?.value;
    if (!adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, email, role, school, points } = body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        role,
        school,
        points,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Lỗi khi cập nhật người dùng' },
      { status: 500 }
    );
  }
}

// DELETE - Xóa người dùng
export async function DELETE(request) {
  try {
    const adminToken = request.cookies.get('admin-token')?.value;
    if (!adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Thiếu ID người dùng' },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Đã xóa người dùng' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Lỗi khi xóa người dùng' },
      { status: 500 }
    );
  }
}
