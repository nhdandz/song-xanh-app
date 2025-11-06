// app/api/evaluate-product/route.js
export async function POST(req) {
  try {
    const raw = await req.text();

    let body;
    try {
      body = raw ? JSON.parse(raw) : {};
    } catch (e) {
      return new Response(JSON.stringify({ error: "Body không phải JSON" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { productName, barcode, category, packaging } = body;

    // Lấy key từ env và sanitize
    const rawKey = process.env.GEMINI_API_KEY || "";
    const key = rawKey.replace(/\uFEFF/g, "").trim();

    if (!key) {
      return new Response(JSON.stringify({
        error: "GEMINI_API_KEY chưa cấu hình trên server"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!/^[A-Za-z0-9_\-:]+$/.test(key)) {
      return new Response(JSON.stringify({
        error: "GEMINI_API_KEY chứa ký tự không hợp lệ"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Tạo prompt cho Gemini để đánh giá sản phẩm
    const systemPrompt = `Bạn là chuyên gia đánh giá độ xanh (mức độ thân thiện với môi trường) của sản phẩm.

Nhiệm vụ của bạn:
1. Phân tích thông tin sản phẩm được cung cấp
2. Đánh giá độ xanh dựa trên: loại sản phẩm, bao bì, khả năng tái chế, phân hủy sinh học, thành phần
3. Trả về kết quả CHÍNH XÁC theo định dạng JSON sau (KHÔNG thêm markdown hay text nào khác):

{
  "greenScore": <số từ 0-10>,
  "recyclable": <true/false>,
  "biodegradable": <true/false>,
  "plasticFree": <true/false>,
  "recommendation": "<gợi ý 1-2 câu ngắn gọn>",
  "category": "<danh mục sản phẩm>",
  "packaging": "<loại bao bì>",
  "analysis": "<phân tích ngắn gọn về sản phẩm>"
}

Tiêu chí đánh giá điểm xanh (0-10):
- 8-10: Rất xanh - tái chế được, phân hủy sinh học, không nhựa
- 5-7: Trung bình - có một số đặc điểm xanh
- 0-4: Kém xanh - khó tái chế, nhiều nhựa, gây hại môi trường

CHỈ trả về JSON, KHÔNG thêm text hoặc markdown khác.`;

    const userMessage = `Đánh giá sản phẩm sau:
- Tên sản phẩm: ${productName || 'Không rõ'}
- Mã vạch: ${barcode || 'Không có'}
- Loại: ${category || 'Không rõ'}
- Bao bì: ${packaging || 'Không rõ'}

Hãy phân tích và đánh giá độ xanh của sản phẩm này.`;

    const payload = {
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userMessage }]
        }
      ],
      generation_config: {
        temperature: 0.3,
        maxOutputTokens: 1024,
        responseMimeType: "application/json"
      }
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(key)}`;

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const responseText = await resp.text();

    if (!resp.ok) {
      console.error("Gemini API error:", responseText);
      return new Response(JSON.stringify({
        error: `Gemini API error: ${resp.status}`,
        details: responseText
      }), {
        status: resp.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Parse response từ Gemini
    let geminiData;
    try {
      geminiData = JSON.parse(responseText);
    } catch (e) {
      return new Response(JSON.stringify({
        error: "Không thể parse response từ Gemini",
        raw: responseText
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Extract JSON từ response
    const candidate = geminiData?.candidates?.[0];
    if (!candidate?.content?.parts?.[0]?.text) {
      return new Response(JSON.stringify({
        error: "Không nhận được phản hồi từ Gemini",
        raw: geminiData
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    let evaluationResult;
    try {
      const resultText = candidate.content.parts[0].text;
      evaluationResult = JSON.parse(resultText);
    } catch (e) {
      // Nếu không parse được, trả về dữ liệu mặc định
      evaluationResult = {
        greenScore: 5.0,
        recyclable: false,
        biodegradable: false,
        plasticFree: false,
        recommendation: "Chưa có đủ thông tin để đánh giá chính xác. Hãy kiểm tra bao bì và thành phần sản phẩm.",
        category: category || "Chưa xác định",
        packaging: packaging || "Chưa xác định",
        analysis: candidate.content.parts[0].text
      };
    }

    // Đảm bảo có đầy đủ các trường cần thiết
    const finalResult = {
      barcode: barcode || null,
      name: productName || "Sản phẩm không xác định",
      greenScore: evaluationResult.greenScore || 5.0,
      recyclable: evaluationResult.recyclable || false,
      biodegradable: evaluationResult.biodegradable || false,
      plasticFree: evaluationResult.plasticFree || false,
      recommendation: evaluationResult.recommendation || "Không có gợi ý",
      category: evaluationResult.category || category || "Chưa xác định",
      packaging: evaluationResult.packaging || packaging || "Chưa xác định",
      analysis: evaluationResult.analysis || "",
      brand: evaluationResult.brand || ""
    };

    return new Response(JSON.stringify(finalResult), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("Proxy /api/evaluate-product error:", err?.message || err);
    return new Response(JSON.stringify({
      error: err?.message || "Lỗi server"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
