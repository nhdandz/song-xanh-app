import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Lấy danh sách sản phẩm (admin)
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

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { barcode: { contains: search } },
            { brand: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              scanHistories: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy danh sách sản phẩm' },
      { status: 500 }
    );
  }
}

// PUT - Cập nhật sản phẩm
export async function PUT(request) {
  try {
    const adminToken = request.cookies.get('admin-token')?.value;
    if (!adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      name,
      brand,
      category,
      packaging,
      greenScore,
      recyclable,
      biodegradable,
      plasticFree,
      carbonFootprint,
      waterUsage,
      recommendation,
    } = body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        brand,
        category,
        packaging,
        greenScore,
        recyclable,
        biodegradable,
        plasticFree,
        carbonFootprint,
        waterUsage,
        recommendation,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Lỗi khi cập nhật sản phẩm' },
      { status: 500 }
    );
  }
}

// DELETE - Xóa sản phẩm
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
        { error: 'Thiếu ID sản phẩm' },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Đã xóa sản phẩm' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Lỗi khi xóa sản phẩm' },
      { status: 500 }
    );
  }
}
