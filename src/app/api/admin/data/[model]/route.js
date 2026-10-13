import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminModel } from "@/lib/adminModels";
import { AdminDataError, buildData, prismaErrorMessage } from "@/lib/adminData";
import { requireAdmin } from "@/lib/auth";

const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

function resolve(slug) {
  const config = getAdminModel(slug);
  if (!config) return { error: "Model không được hỗ trợ", status: 404 };

  const delegate = prisma[config.model];
  if (!delegate || typeof delegate.findMany !== "function") {
    return { error: "Model chưa được tạo trong Prisma Client", status: 500 };
  }

  return { config, delegate };
}

// GET /api/admin/data/[slug]?q=&page=1&pageSize=25
export async function GET(req, { params }) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const { model: slug } = await params;
  const { config, delegate, error, status } = resolve(slug);
  if (error) return NextResponse.json({ error }, { status });

  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const pageSize = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, parseInt(searchParams.get("pageSize") || `${DEFAULT_PAGE_SIZE}`, 10) || DEFAULT_PAGE_SIZE)
    );

    const where = {};
    if (q && config.searchFields?.length) {
      where.OR = config.searchFields.map((field) => ({
        [field]: { contains: q, mode: "insensitive" },
      }));
    }

    const [items, total] = await Promise.all([
      delegate.findMany({
        where,
        include: config.include,
        orderBy: config.orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      delegate.count({ where }),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      pageSize,
      label: config.label,
      description: config.description,
      columns: config.columns,
      fields: config.fields,
      searchable: Boolean(config.searchFields?.length),
    });
  } catch (err) {
    console.error(`GET /api/admin/data/${slug} error:`, err);
    return NextResponse.json(
      { error: `Lỗi khi lấy danh sách ${config.label}` },
      { status: 500 }
    );
  }
}

// POST /api/admin/data/[slug]
export async function POST(req, { params }) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const { model: slug } = await params;
  const { config, delegate, error, status } = resolve(slug);
  if (error) return NextResponse.json({ error }, { status });

  try {
    const body = await req.json();
    const data = buildData(config, body);

    const created = await delegate.create({ data });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    if (err instanceof AdminDataError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    console.error(`POST /api/admin/data/${slug} error:`, err);
    const message = prismaErrorMessage(err, `Lỗi khi tạo ${config.label}`);
    return NextResponse.json({ error: message }, { status: err.code ? 400 : 500 });
  }
}
