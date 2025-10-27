import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/admin/products error:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách sản phẩm" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.barcode || !body.name) {
      return NextResponse.json(
        { error: "Thiếu barcode hoặc tên sản phẩm" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        barcode: body.barcode,
        name: body.name,
        brand: body.brand || null,
        category: body.category || null,
        packaging: body.packaging || null,
        greenScore: body.greenScore || 5,
        recyclable: body.recyclable || false,
        biodegradable: body.biodegradable || false,
        plasticFree: body.plasticFree || false,
        recommendation: body.recommendation || null
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/products error:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Barcode đã tồn tại" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Lỗi khi tạo sản phẩm" },
      { status: 500 }
    );
  }
}
