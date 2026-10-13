import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { REF_SOURCES } from "@/lib/adminModels";

const MAX_OPTIONS = 500;

// Trả về danh sách lựa chọn cho các field liên kết (dropdown trong form admin).
// Ví dụ: /api/admin/refs?name=user
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    const source = REF_SOURCES[name];

    if (!source) {
      return NextResponse.json(
        { error: "Không hỗ trợ nguồn dữ liệu này" },
        { status: 400 }
      );
    }

    const delegate = prisma[source.model];
    if (!delegate) {
      return NextResponse.json({ error: "Model không tồn tại" }, { status: 400 });
    }

    const select = { id: true };
    for (const field of source.fields) select[field] = true;

    const rows = await delegate.findMany({
      select,
      take: MAX_OPTIONS,
      orderBy: { id: "asc" },
    });

    const options = rows.map((row) => {
      const parts = source.fields
        .map((field) => row[field])
        .filter(Boolean)
        .map((value) => String(value).slice(0, 60));

      return {
        id: row.id,
        label: parts.length ? parts.join(" — ") : row.id,
      };
    });

    return NextResponse.json(options);
  } catch (error) {
    console.error("GET /api/admin/refs error:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách lựa chọn" },
      { status: 500 }
    );
  }
}
