import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Safe operations with fallback
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

    const safeFindMany = async (model, modelName, options) => {
      try {
        if (model && typeof model.findMany === 'function') {
          return await model.findMany(options);
        }
        return [];
      } catch (err) {
        console.warn(`FindMany failed for ${modelName}:`, err.message);
        return [];
      }
    };

    const safeGroupBy = async (model, modelName, options) => {
      try {
        if (model && typeof model.groupBy === 'function') {
          return await model.groupBy(options);
        }
        return [];
      } catch (err) {
        console.warn(`GroupBy failed for ${modelName}:`, err.message);
        return [];
      }
    };

    const [
      users,
      articles,
      products,
      events,
      reports,
      ideas,
      topUsers,
      recentActivities,
      reportsByStatus
    ] = await Promise.all([
      safeCount(prisma.user, 'user'),
      safeCount(prisma.article, 'article'),
      safeCount(prisma.product, 'product'),
      safeCount(prisma.event, 'event'),
      safeCount(prisma.report, 'report'),
      safeCount(prisma.idea, 'idea'),

      // Top 10 users by points
      safeFindMany(prisma.user, 'user', {
        orderBy: { points: "desc" },
        take: 10,
        select: {
          id: true,
          name: true,
          points: true,
          level: true
        }
      }),

      // Recent 10 activities
      safeFindMany(prisma.userActivity, 'userActivity', {
        orderBy: { date: "desc" },
        take: 10,
        include: {
          user: {
            select: { name: true }
          },
          activity: {
            select: { name: true }
          }
        }
      }),

      // Count reports by status
      safeGroupBy(prisma.report, 'report', {
        by: ["status"],
        _count: true
      })
    ]);

    // Transform reportsByStatus into a more usable format
    const reportStatusCounts = {};
    reportsByStatus.forEach(item => {
      reportStatusCounts[item.status] = item._count;
    });

    return NextResponse.json({
      users,
      articles,
      products,
      events,
      reports,
      ideas,
      topUsers,
      recentActivities,
      reportsByStatus: reportStatusCounts
    });
  } catch (error) {
    console.error("GET /api/admin/stats/detailed error:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy thống kê chi tiết" },
      { status: 500 }
    );
  }
}
