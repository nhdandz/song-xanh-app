// app/api/chat/route.js
export async function POST(req) {
  try {
    // đọc body text
    const raw = await req.text();

    // parse body
    let body;
    try {
      body = raw ? JSON.parse(raw) : {};
    } catch (e) {
      return new Response(JSON.stringify({ error: "Body không phải JSON" }), { status: 400, headers: { "Content-Type": "application/json" }});
    }

    // Lấy key từ env và sanitize (loại BOM, trim)
    const rawKey = process.env.GEMINI_API_KEY || "";
    const key = rawKey.replace(/\uFEFF/g, "").trim();

    if (!key) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY chưa cấu hình trên server hoặc rỗng" }), { status: 500, headers: { "Content-Type": "application/json" }});
    }

    // Nếu key chứa ký tự non-ASCII (có khả năng do copy-paste bị dính ký tự lạ),
    // trả lỗi hướng dẫn người dùng kiểm tra .env (KHÔNG in key ra log).
    if (!/^[A-Za-z0-9_\-:]+$/.test(key)) {
      return new Response(JSON.stringify({
        error: "GEMINI_API_KEY chứa ký tự không hợp lệ (non-ASCII). Vui lòng kiểm tra .env.local, xóa ký tự lạ/BOM và thử lại."
      }), { status: 400, headers: { "Content-Type": "application/json" }});
    }

    // Build safe payload: chỉ forward trường cần thiết
    const safePayload = {};
    if (body.systemInstruction) safePayload.systemInstruction = body.systemInstruction;
    if (body.contents) safePayload.contents = body.contents;
    if (body.generation_config) safePayload.generation_config = body.generation_config;

    if (!safePayload.contents || !Array.isArray(safePayload.contents) || safePayload.contents.length === 0) {
      return new Response(JSON.stringify({ error: "Missing contents in request" }), { status: 400, headers: { "Content-Type": "application/json" }});
    }

    // Gọi Gemini bằng query param key (không đặt header x-goog-api-key)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(key)}`;

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(safePayload),
    });

    const text = await resp.text();

    return new Response(text, { status: resp.status, headers: { "Content-Type": "application/json" }});
  } catch (err) {
    console.error("Proxy /api/chat error (no key shown):", err?.message || err);
    return new Response(JSON.stringify({ error: err?.message || "Lỗi server" }), { status: 500, headers: { "Content-Type": "application/json" }});
  }
}
