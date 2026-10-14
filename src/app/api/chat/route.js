// app/api/chat/route.js
import Groq from "groq-sdk";
import { requireAuth } from "@/lib/auth";

export async function POST(req) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body = await req.json();

    // Convert format Gemini -> Groq nếu có
    let messages = body.messages;

    if (!messages && body.contents) {
      messages = body.contents.map(item => ({
        role: item.role || "user",
        content: item.parts?.map(p => p.text).join("\n") || ""
      }));
    }

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "messages missing" }),
        { status: 400 }
      );
    }

    const client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    // Groq hay khai tử model, nên để đổi được qua biến môi trường mà không
    // phải sửa code. llama-3.3-70b-versatile đã ngừng phục vụ gói free/dev
    // từ 16/08/2026, Groq khuyến nghị thay bằng openai/gpt-oss-120b.
    // Danh sách cập nhật: https://console.groq.com/docs/deprecations
    const completion = await client.chat.completions.create({
      model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
      messages,
      max_tokens: 2048,
    });

    return new Response(
      JSON.stringify(completion),
      { status: 200, headers: { "Content-Type": "application/json" }}
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}
