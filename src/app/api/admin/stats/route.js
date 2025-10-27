import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Safe count with fallback for models that might not be generated yet
    const safeCount = async (model, modelName) => {
      try {
        if (model && typeof model.count === 'function') {
          return await model.count();
        }
        return 0;
      } catch (err) {
        console.warn(`Count failed for ${modelName}:`, err.message);
        return 0;
      }
    };

    const [users, articles, products, events, reports, ideas] = await Promise.all([
      safeCount(prisma.user, 'user'),
      safeCount(prisma.article, 'article'),
      safeCount(prisma.product, 'product'),
      safeCount(prisma.event, 'event'),
      safeCount(prisma.report, 'report'),
      safeCount(prisma.idea, 'idea')
    ]);

    return NextResponse.json({
      users,
      articles,
      products,
      events,
      reports,
      ideas
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy thống kê" },
      { status: 500 }
    );
  }
}
