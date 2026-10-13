import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ADMIN_MODELS, MODEL_GROUPS } from "@/lib/adminModels";

// Danh sách model quản lý được + số bản ghi hiện có, dùng cho trang /admin/du-lieu.
export async function GET() {
  try {
    const items = await Promise.all(
      ADMIN_MODELS.map(async (config) => {
        let count = 0;
        try {
          const delegate = prisma[config.model];
          if (delegate && typeof delegate.count === "function") {
            count = await delegate.count();
          }
        } catch (err) {
          console.warn(`Đếm bản ghi thất bại cho ${config.model}:`, err.message);
        }

        return {
          slug: config.slug,
          model: config.model,
          label: config.label,
          description: config.description,
          group: config.group,
          icon: config.icon,
          count,
        };
      })
    );

    return NextResponse.json({ groups: MODEL_GROUPS, items });
  } catch (error) {
    console.error("GET /api/admin/models error:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách model" },
      { status: 500 }
    );
  }
}
