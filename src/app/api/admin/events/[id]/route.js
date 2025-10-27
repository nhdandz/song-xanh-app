import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    await prisma.event.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/events/[id] error:", error);
    return NextResponse.json(
      { error: "Lỗi khi xóa sự kiện" },
      { status: 500 }
    );
  }
}
