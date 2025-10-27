import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/users/:id - Lấy thông tin chi tiết người dùng
export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        badges: {
          include: {
            badge: true
          }
        },
        settings: true,
        _count: {
          select: {
            greenActivities: true,
            posts: true,
            friendsAsUser: {
              where: {
                status: 'accepted'
              }
            }
          }
        }
      }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Lấy các hoạt động xanh của người dùng
    const userActivities = await prisma.userActivity.findMany({
      where: { userId: id },
      include: {
        activity: true,
      },
      orderBy: {
        date: 'desc'
      },
      take: 10
    });
    
    // Tái cấu trúc đối tượng trả về để ngắn gọn hơn
    const formattedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      school: user.school,
      points: user.points,
      level: user.level,
      createdAt: user.createdAt,
      settings: user.settings,
      badges: user.badges.map(ub => ({
        ...ub.badge,
        earnedAt: ub.earnedAt
      })),
      stats: {
        activities: user._count.greenActivities,
        posts: user._count.posts,
        friends: user._count.friendsAsUser
      },
      recentActivities: userActivities.map(ua => ({
        id: ua.id,
        name: ua.activity.name,
        points: ua.activity.points,
        date: ua.date
      }))
    };
    
    return NextResponse.json(formattedUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

// PUT /api/users/:id - Cập nhật thông tin người dùng
export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const data = await request.json();
    
    // Nếu muốn cập nhật email, kiểm tra xem email đã tồn tại chưa
    if (data.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: data.email,
          id: { not: id }
        }
      });
      
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        );
      }
    }
    
    // Cập nhật người dùng
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        school: data.school,
        // Chỉ cập nhật password nếu có trong request
        ...(data.password && { password: data.password }),
      }
    });
    
    // Nếu có cập nhật settings
    if (data.settings) {
      await prisma.settings.upsert({
        where: { userId: id },
        update: {
          reminderOn: data.settings.reminderOn,
          reminderTime: data.settings.reminderTime
        },
        create: {
          userId: id,
          reminderOn: data.settings.reminderOn,
          reminderTime: data.settings.reminderTime
        }
      });
    }
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE /api/users/:id - Xóa người dùng
export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;    
    // Xóa người dùng - các bảng liên quan sẽ được xóa cascade theo cấu hình schema
    await prisma.user.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}