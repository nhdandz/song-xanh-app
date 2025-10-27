import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    // Kiểm tra admin auth (đơn giản hóa)
    const adminToken = request.cookies.get('admin-token')?.value;
    if (!adminToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Lấy thống kê
    const [
      totalUsers,
      totalProducts,
      totalActivities,
      totalScans,
      recentUsers,
      recentScans
    ] = await Promise.all([
      // Tổng số người dùng
      prisma.user.count(),

      // Tổng số sản phẩm
      prisma.product.count(),

      // Tổng số hoạt động xanh
      prisma.greenActivity.count(),

      // Tổng số lần quét
      prisma.scanHistory.count(),

      // Người dùng mới nhất
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          points: true,
          createdAt: true,
          role: true
        }
      }),

      // Lần quét gần nhất
      prisma.scanHistory.findMany({
        take: 10,
        orderBy: { scannedAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          product: {
            select: {
              name: true,
              greenScore: true
            }
          }
        }
      })
    ]);

    // Thống kê theo tháng (30 ngày gần nhất)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newUsersThisMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });

    const scansThisMonth = await prisma.scanHistory.count({
      where: {
        scannedAt: {
          gte: thirtyDaysAgo
        }
      }
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        totalProducts,
        totalActivities,
        totalScans,
        newUsersThisMonth,
        scansThisMonth
      },
      recentUsers,
      recentScans
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy thống kê' },
      { status: 500 }
    );
  }
}
