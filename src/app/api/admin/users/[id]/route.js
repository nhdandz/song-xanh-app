import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  school: true,
  points: true,
  level: true,
  createdAt: true,
  updatedAt: true
};

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: USER_SELECT
    });

    if (!user) {
      return NextResponse.json(
        { error: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET /api/admin/users/[id] error:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy thông tin người dùng" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const has = (key) => Object.prototype.hasOwnProperty.call(body, key);

    if (has("name") && (!body.name || !String(body.name).trim())) {
      return NextResponse.json(
        { error: "Tên người dùng là bắt buộc" },
        { status: 400 }
      );
    }

    // Chỉ ghi những field được gửi lên, tránh xóa mất dữ liệu cũ
    const data = {};
    if (has("name")) data.name = String(body.name).trim();
    if (has("email")) data.email = body.email ? String(body.email).trim() : null;
    if (has("school")) data.school = body.school ? String(body.school).trim() : null;
    if (has("level")) data.level = body.level ? String(body.level).trim() : null;

    if (body.points !== undefined && body.points !== null && body.points !== "") {
      const points = Number(body.points);
      if (!Number.isInteger(points) || points < 0) {
        return NextResponse.json(
          { error: "Điểm phải là số nguyên không âm" },
          { status: 400 }
        );
      }
      data.points = points;
    }

    // Chỉ đổi mật khẩu khi admin nhập giá trị mới
    if (body.password) {
      data.password = String(body.password);
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "Không có dữ liệu để cập nhật" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: USER_SELECT
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("PUT /api/admin/users/[id] error:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email này đã được sử dụng" },
        { status: 400 }
      );
    }

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Lỗi khi cập nhật người dùng" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/users/[id] error:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Lỗi khi xóa người dùng" },
      { status: 500 }
    );
  }
}
