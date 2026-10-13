import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const ideas = await prisma.idea.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    return NextResponse.json(ideas);
  } catch (error) {
    console.error("GET /api/admin/ideas error:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách ý tưởng" },
      { status: 500 }
    );
  }
}
