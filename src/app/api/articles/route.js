// // File: src/app/api/articles/route.js
// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// // =========================
// // GET /api/articles
// // =========================
// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);

//     const q = (searchParams.get("q") || "").trim();
//     const page = Number(searchParams.get("page") || 1);
//     const pageSize = Number(searchParams.get("pageSize") || 10);

//     const where = q
//       ? {
//           OR: [
//             { title: { contains: q, mode: "insensitive" } },
//             { excerpt: { contains: q, mode: "insensitive" } },
//             { content: { contains: q, mode: "insensitive" } },
//           ],
//         }
//       : {};

//     const [items, total] = await Promise.all([
//       prisma.article.findMany({
//         where,
//         orderBy: { createdAt: "desc" },
//         skip: (page - 1) * pageSize,
//         take: pageSize,
//       }),
//       prisma.article.count({ where }),
//     ]);

//     return NextResponse.json({
//       items,
//       total,
//       page,
//       pageSize,
//       totalPages: Math.ceil(total / pageSize),
//     });
//   } catch (error) {
//     console.error("GET /api/articles error:", error);
//     return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
//   }
// }

// // =========================
// // POST /api/articles
// // =========================
// export async function POST(req) {
//   try {
//     const body = await req.json();

//     if (!body.title || !body.content) {
//       return NextResponse.json({ error: "Thiếu title hoặc content" }, { status: 400 });
//     }

//     // Normalize cards: accept array or JSON string
//     let cards = null;
//     if (body.cards) {
//       if (Array.isArray(body.cards)) cards = body.cards;
//       else {
//         try {
//           cards = typeof body.cards === "string" ? JSON.parse(body.cards) : body.cards;
//         } catch {
//           cards = null;
//         }
//       }
//     }

//     const created = await prisma.article.create({
//       data: {
//         title: body.title,
//         content: body.content,
//         excerpt: body.excerpt ?? "",
//         category: body.category ?? "Khác",
//         image: body.image ?? null,
//         readTime: body.readTime ?? "",
//         cards: cards ?? null,
//       },
//     });

//     return NextResponse.json(created, { status: 201 });
//   } catch (error) {
//     console.error("POST /api/articles error:", error);
//     return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
//   }
// }
// File: src/app/api/articles/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Helper: safe parse incoming body by trying json, text->json, formData
 */
async function parseBodySafely(req) {
  // Try req.json()
  try {
    const j = await req.json();
    return j;
  } catch (e) {
    // continue
  }

  // Try text then JSON.parse
  try {
    const txt = await req.text();
    if (txt) {
      try {
        return JSON.parse(txt);
      } catch {
        // not JSON text, return raw text
        return txt;
      }
    }
  } catch (e) {
    // continue
  }

  // Try formData (for application/x-www-form-urlencoded or multipart/form-data)
  try {
    if (typeof req.formData === "function") {
      const fd = await req.formData();
      // convert to plain object (files will remain File objects)
      const obj = {};
      for (const [k, v] of fd.entries()) {
        // if key already exists, convert to array
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
          if (!Array.isArray(obj[k])) obj[k] = [obj[k]];
          obj[k].push(v);
        } else {
          obj[k] = v;
        }
      }
      return obj;
    }
  } catch (e) {
    // ignore
  }

  return null;
}

/**
 * GET /api/articles
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") || 10)));
    const skip = (page - 1) * pageSize;

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
        skip,
        take: pageSize,
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      ok: true,
      data: items,
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (error) {
    console.error("GET /api/articles error:", error);
    return NextResponse.json({ ok: false, error: "Lỗi server" }, { status: 500 });
  }
}

/**
 * POST /api/articles
 * - Hỗ trợ body: JSON, JSON-as-text, form-data, x-www-form-urlencoded
 * - Hỗ trợ cả { article: {...} } hoặc direct { title, content, ... }
 */
export async function POST(req) {
  // Log headers (convert Headers to plain object)
  try {
    const headersObj = {};
    for (const [k, v] of req.headers) headersObj[k] = v;
    console.log("POST /api/articles headers:", headersObj);
  } catch (e) {
    console.log("POST /api/articles headers: (unable to read headers)", e);
  }

  try {
    const raw = await parseBodySafely(req);
    console.log("POST /api/articles raw body:", raw);

    // Accept both { article: {...} } and direct body
    const body = (raw && typeof raw === "object" && "article" in raw) ? raw.article : raw;

    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, error: "Thiếu request body hoặc định dạng không hợp lệ" }, { status: 400 });
    }

    const title = body.title ?? null;
    const content = body.content ?? null;

    if (!title || !content) {
      return NextResponse.json({ ok: false, error: "Thiếu title hoặc content" }, { status: 400 });
    }

    // Normalize cards
    let cards = null;
    if (body.cards) {
      if (Array.isArray(body.cards)) cards = body.cards;
      else if (typeof body.cards === "string") {
        try { const parsed = JSON.parse(body.cards); if (Array.isArray(parsed)) cards = parsed; } catch {}
      }
    }

    // Parse date
    let parsedDate = undefined;
    if (body.date) {
      const d = new Date(body.date);
      if (!isNaN(d.getTime())) parsedDate = d;
    }

    const created = await prisma.article.create({
      data: {
        title: String(title),
        content: String(content),
        excerpt: body.excerpt ?? "",
        category: body.category ?? "Khác",
        image: body.image ?? null,
        readTime: body.readTime ?? "",
        cards: cards ?? null,
        date: parsedDate,
      },
    });

    console.log("POST /api/articles created id:", created.id);
    return NextResponse.json({ ok: true, data: created }, { status: 201 });
  } catch (error) {
    // If error.stack or message is sensitive, logs still fine for server-side debugging
    console.error("POST /api/articles error:", error);
    return NextResponse.json({ ok: false, error: "Lỗi server" }, { status: 500 });
  }
}
