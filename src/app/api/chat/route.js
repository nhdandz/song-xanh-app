// app/api/chat/route.js
import Groq from "groq-sdk";

export async function POST(req) {
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

    // MODEL MỚI NHẤT
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
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
