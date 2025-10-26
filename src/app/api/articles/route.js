// File: src/app/api/articles/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// =========================
// GET /api/articles
// =========================
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const q = (searchParams.get("q") || "").trim();
    const page = Number(searchParams.get("page") || 1);
    const pageSize = Number(searchParams.get("pageSize") || 10);

    const where = q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { excerpt: { contains: q, mode: "insensitive" } },
            { content: { contains: q, mode: "insensitive" } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("GET /api/articles error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// =========================
// POST /api/articles
// =========================
export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.title || !body.content) {
      return NextResponse.json({ error: "Thiếu title hoặc content" }, { status: 400 });
    }

    // Normalize cards: accept array or JSON string
    let cards = null;
    if (body.cards) {
      if (Array.isArray(body.cards)) cards = body.cards;
      else {
        try {
          cards = typeof body.cards === "string" ? JSON.parse(body.cards) : body.cards;
        } catch {
          cards = null;
        }
      }
    }

    const created = await prisma.article.create({
      data: {
        title: body.title,
        content: body.content,
        excerpt: body.excerpt ?? "",
        category: body.category ?? "Khác",
        image: body.image ?? null,
        readTime: body.readTime ?? "",
        cards: cards ?? null,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/articles error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
