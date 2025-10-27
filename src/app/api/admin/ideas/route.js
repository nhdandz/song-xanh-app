import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
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
