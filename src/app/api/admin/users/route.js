import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        school: true,
        points: true,
        level: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách người dùng" },
      { status: 500 }
    );
  }
}
