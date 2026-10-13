import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(req, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = params;

    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/users/[id] error:", error);
    return NextResponse.json(
      { error: "Lỗi khi xóa người dùng" },
      { status: 500 }
    );
  }
}
