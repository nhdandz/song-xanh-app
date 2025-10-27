import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "desc" },
      include: {
        _count: {
          select: { participants: true }
        }
      }
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("GET /api/admin/events error:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách sự kiện" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.title || !body.description || !body.location || !body.date) {
      return NextResponse.json(
        { error: "Thiếu thông tin bắt buộc" },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description,
        location: body.location,
        date: new Date(body.date),
        maxParticipants: body.maxParticipants || null
      }
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/events error:", error);
    return NextResponse.json(
      { error: "Lỗi khi tạo sự kiện" },
      { status: 500 }
    );
  }
}
