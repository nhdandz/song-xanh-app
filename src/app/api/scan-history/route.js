import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/scan-history - Lấy lịch sử quét của người dùng
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Thiếu userId' },
        { status: 400 }
      );
    }

    const scanHistory = await prisma.scanHistory.findMany({
      where: { userId },
      include: {
        product: true
      },
      orderBy: { scannedAt: 'desc' },
      take: 50 // Giới hạn 50 lần quét gần nhất
    });

    return NextResponse.json(scanHistory);
  } catch (error) {
    console.error('Error fetching scan history:', error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy lịch sử quét' },
      { status: 500 }
    );
  }
}

// POST /api/scan-history - Thêm lịch sử quét mới
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, productId } = body;

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'Thiếu userId hoặc productId' },
        { status: 400 }
      );
    }

    // Kiểm tra sản phẩm có tồn tại không
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Sản phẩm không tồn tại' },
        { status: 404 }
      );
    }

    // Tạo lịch sử quét mới
    const scanHistory = await prisma.scanHistory.create({
      data: {
        userId,
        productId
      },
      include: {
        product: true
      }
    });

    return NextResponse.json(scanHistory, { status: 201 });
  } catch (error) {
    console.error('Error creating scan history:', error);
    return NextResponse.json(
      { error: 'Lỗi khi tạo lịch sử quét' },
      { status: 500 }
    );
  }
}

// DELETE /api/scan-history - Xóa lịch sử quét
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Thiếu userId' },
        { status: 400 }
      );
    }

    await prisma.scanHistory.deleteMany({
      where: { userId }
    });

    return NextResponse.json({ message: 'Đã xóa lịch sử quét' });
  } catch (error) {
    console.error('Error deleting scan history:', error);
    return NextResponse.json(
      { error: 'Lỗi khi xóa lịch sử quét' },
      { status: 500 }
    );
  }
}
