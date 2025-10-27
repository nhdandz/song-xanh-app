import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    // Kiểm tra admin auth
    const adminToken = request.cookies.get('admin-token')?.value;
    if (!adminToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Lấy danh sách posts
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          },
          _count: {
            select: {
              comments: true,
              likes: true
            }
          }
        }
      }),
      prisma.post.count()
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy danh sách bài viết' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Kiểm tra admin auth
    const adminToken = request.cookies.get('admin-token')?.value;
    if (!adminToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { content, images, activity } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Nội dung bài viết là bắt buộc' },
        { status: 400 }
      );
    }

    // Tạo bài viết mới với userId là admin
    const post = await prisma.post.create({
      data: {
        userId: adminToken, // Sử dụng adminToken làm userId
        content,
        images: images || null,
        activity: activity || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Lỗi khi tạo bài viết' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    // Kiểm tra admin auth
    const adminToken = request.cookies.get('admin-token')?.value;
    if (!adminToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID bài viết là bắt buộc' },
        { status: 400 }
      );
    }

    // Xóa bài viết
    await prisma.post.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Xóa bài viết thành công' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Lỗi khi xóa bài viết' },
      { status: 500 }
    );
  }
}
