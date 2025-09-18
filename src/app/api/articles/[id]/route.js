// File: src/app/api/articles/[id]/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function parseId(params) {
  const id = Number(params.id);
  return Number.isFinite(id) ? id : NaN;
}

export async function GET(req, { params }) {
  const id = parseId(params);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const item = await prisma.article.findUnique({ where: { id } });
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item, { status: 200 });
  } catch (err) {
    console.error("GET article error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const id = parseId(params);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  let data;
  try {
    data = await req.json();
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // normalize cards if present
  if (data.cards) {
    if (!Array.isArray(data.cards)) {
      try {
        data.cards = typeof data.cards === "string" ? JSON.parse(data.cards) : data.cards;
      } catch {
        data.cards = null;
      }
    }
  }

  // If date field exists, optional convert, but we'll just allow prisma to handle valid fields
  if (data.date) {
    const d = new Date(data.date);
    if (isNaN(d)) delete data.date;
    else data.date = d;
  }

  try {
    const updated = await prisma.article.update({
      where: { id },
      data,
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("UPDATE error:", err);
    if (err?.code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  const id = parseId(params);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Delete error:", err);
    if (err?.code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}
