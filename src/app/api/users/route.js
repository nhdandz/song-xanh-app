<<<<<<< HEAD
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/users - Lấy danh sách người dùng
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;
    
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        points: true,
        level: true,
        school: true,
        createdAt: true,
        _count: {
          select: {
            badges: true,
            greenActivities: true,
            friendsAsUser: {
              where: {
                status: 'accepted'
              }
            }
          }
        }
      },
      orderBy: {
        points: 'desc'
      }
    });
    
    const total = await prisma.user.count({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      }
    });
    
    return NextResponse.json({ 
      users: users.map(user => ({
        ...user,
        badges: user._count.badges,
        activities: user._count.greenActivities,
        friends: user._count.friendsAsUser,
        _count: undefined
      })),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST /api/users - Tạo người dùng mới
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Kiểm tra nếu email đã tồn tại
    if (data.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      });
      
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        );
      }
    }
    
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password, // Nên mã hóa mật khẩu trước khi lưu
        school: data.school,
        settings: {
          create: {
            reminderOn: true,
            reminderTime: "18:00"
          }
        }
      }
    });
    
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
=======
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/users - Lấy danh sách người dùng
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;
    
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        points: true,
        level: true,
        school: true,
        createdAt: true,
        _count: {
          select: {
            badges: true,
            greenActivities: true,
            friendsAsUser: {
              where: {
                status: 'accepted'
              }
            }
          }
        }
      },
      orderBy: {
        points: 'desc'
      }
    });
    
    const total = await prisma.user.count({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      }
    });
    
    return NextResponse.json({ 
      users: users.map(user => ({
        ...user,
        badges: user._count.badges,
        activities: user._count.greenActivities,
        friends: user._count.friendsAsUser,
        _count: undefined
      })),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST /api/users - Tạo người dùng mới
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Kiểm tra nếu email đã tồn tại
    if (data.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      });
      
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        );
      }
    }
    
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password, // Nên mã hóa mật khẩu trước khi lưu
        school: data.school,
        settings: {
          create: {
            reminderOn: true,
            reminderTime: "18:00"
          }
        }
      }
    });
    
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
>>>>>>> c9a6028 (add database)
}