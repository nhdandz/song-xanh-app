import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/products - Lấy danh sách sản phẩm hoặc tìm theo barcode
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const barcode = searchParams.get('barcode');

    if (barcode) {
      // Tìm sản phẩm theo mã vạch
      const product = await prisma.product.findUnique({
        where: { barcode }
      });

      if (!product) {
        return NextResponse.json(
          { error: 'Không tìm thấy sản phẩm' },
          { status: 404 }
        );
      }

      return NextResponse.json(product);
    }

    // Lấy tất cả sản phẩm
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy thông tin sản phẩm' },
      { status: 500 }
    );
  }
}

// POST /api/products - Tạo sản phẩm mới
export async function POST(request) {
  try {
    const body = await request.json();

    const {
      barcode,
      name,
      brand,
      category,
      packaging,
      recyclable,
      biodegradable,
      plasticFree,
      carbonFootprint,
      waterUsage,
      recommendation
    } = body;

    // Kiểm tra dữ liệu bắt buộc
    if (!barcode || !name || !brand || !category) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }

    // Tính điểm xanh
    const greenScore = calculateGreenScore({
      recyclable,
      biodegradable,
      plasticFree,
      carbonFootprint,
      waterUsage,
      packaging
    });

    // Tạo sản phẩm mới
    const product = await prisma.product.create({
      data: {
        barcode,
        name,
        brand,
        category,
        packaging,
        greenScore,
        recyclable: recyclable || false,
        biodegradable: biodegradable || false,
        plasticFree: plasticFree || false,
        carbonFootprint: carbonFootprint || 0,
        waterUsage: waterUsage || 0,
        recommendation: recommendation || ''
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Mã vạch đã tồn tại' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Lỗi khi tạo sản phẩm' },
      { status: 500 }
    );
  }
}

// Hàm tính điểm xanh
function calculateGreenScore({
  recyclable,
  biodegradable,
  plasticFree,
  carbonFootprint,
  waterUsage,
  packaging
}) {
  let score = 5; // Điểm cơ bản

  // Tái chế (+2 điểm)
  if (recyclable) score += 2;

  // Phân hủy sinh học (+2.5 điểm)
  if (biodegradable) score += 2.5;

  // Không nhựa (+1.5 điểm)
  if (plasticFree) score += 1.5;

  // Bao bì thân thiện (+1 điểm)
  if (packaging && (packaging.includes('giấy') || packaging.includes('tre') || packaging.includes('gỗ'))) {
    score += 1;
  }

  // Giảm điểm dựa trên carbon footprint (0 đến -2 điểm)
  if (carbonFootprint > 10) score -= 2;
  else if (carbonFootprint > 5) score -= 1;

  // Giảm điểm dựa trên water usage (0 đến -1.5 điểm)
  if (waterUsage > 100) score -= 1.5;
  else if (waterUsage > 50) score -= 0.5;

  // Đảm bảo điểm trong khoảng 0-10
  return Math.max(0, Math.min(10, score));
}
