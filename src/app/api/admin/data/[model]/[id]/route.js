import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminModel } from "@/lib/adminModels";
import { AdminDataError, buildData, prismaErrorMessage } from "@/lib/adminData";

function resolve(slug) {
  const config = getAdminModel(slug);
  if (!config) return { error: "Model không được hỗ trợ", status: 404 };

  const delegate = prisma[config.model];
  if (!delegate || typeof delegate.findUnique !== "function") {
    return { error: "Model chưa được tạo trong Prisma Client", status: 500 };
  }

  return { config, delegate };
}

// GET /api/admin/data/[slug]/[id]
export async function GET(req, { params }) {
  const { model: slug, id } = await params;
  const { config, delegate, error, status } = resolve(slug);
  if (error) return NextResponse.json({ error }, { status });

  try {
    const item = await delegate.findUnique({ where: { id } });

    if (!item) {
      return NextResponse.json(
        { error: `Không tìm thấy ${config.label}` },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (err) {
    console.error(`GET /api/admin/data/${slug}/${id} error:`, err);
    return NextResponse.json(
      { error: `Lỗi khi lấy ${config.label}` },
      { status: 500 }
    );
  }
}

// PUT /api/admin/data/[slug]/[id]
export async function PUT(req, { params }) {
  const { model: slug, id } = await params;
  const { config, delegate, error, status } = resolve(slug);
  if (error) return NextResponse.json({ error }, { status });

  try {
    const body = await req.json();
    const data = buildData(config, body, { partial: true });

    const updated = await delegate.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof AdminDataError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    if (err.code === "P2025") {
      return NextResponse.json(
        { error: `Không tìm thấy ${config.label}` },
        { status: 404 }
      );
    }

    console.error(`PUT /api/admin/data/${slug}/${id} error:`, err);
    const message = prismaErrorMessage(err, `Lỗi khi cập nhật ${config.label}`);
    return NextResponse.json({ error: message }, { status: err.code ? 400 : 500 });
  }
}

// DELETE /api/admin/data/[slug]/[id]
export async function DELETE(req, { params }) {
  const { model: slug, id } = await params;
  const { config, delegate, error, status } = resolve(slug);
  if (error) return NextResponse.json({ error }, { status });

  try {
    await delegate.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err.code === "P2025") {
      return NextResponse.json(
        { error: `Không tìm thấy ${config.label}` },
        { status: 404 }
      );
    }

    console.error(`DELETE /api/admin/data/${slug}/${id} error:`, err);
    return NextResponse.json(
      { error: `Lỗi khi xóa ${config.label}` },
      { status: 500 }
    );
  }
}
