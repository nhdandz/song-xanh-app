import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(req, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = params;
    const body = await req.json();

    if (!body.status) {
      return NextResponse.json(
        { error: "Thiếu trạng thái mới" },
        { status: 400 }
      );
    }

    const idea = await prisma.idea.update({
      where: { id },
      data: { status: body.status }
    });

    return NextResponse.json(idea);
  } catch (error) {
    console.error("PATCH /api/admin/ideas/[id] error:", error);
    return NextResponse.json(
      { error: "Lỗi khi cập nhật ý tưởng" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = params;

    await prisma.idea.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/ideas/[id] error:", error);
    return NextResponse.json(
      { error: "Lỗi khi xóa ý tưởng" },
      { status: 500 }
    );
  }
}
