import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    if (!body.status) {
      return NextResponse.json(
        { error: "Thiếu trạng thái mới" },
        { status: 400 }
      );
    }

    const report = await prisma.report.update({
      where: { id },
      data: { status: body.status }
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error("PATCH /api/admin/reports/[id] error:", error);
    return NextResponse.json(
      { error: "Lỗi khi cập nhật báo cáo" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    await prisma.report.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/reports/[id] error:", error);
    return NextResponse.json(
      { error: "Lỗi khi xóa báo cáo" },
      { status: 500 }
    );
  }
}
