import { requireAuth } from "@/lib/auth";

// Nhận diện sản phẩm từ ảnh bằng mô hình thị giác - ngôn ngữ (VLM).
//
// Khác /api/evaluate-product ở đầu vào: route kia nhận chữ (tên, mã vạch)
// rồi hỏi mô hình, còn route này đưa thẳng ảnh bao bì cho mô hình tự đọc
// xem đó là sản phẩm gì, làm bằng gì, rồi mới chấm độ xanh.
//
// Cổng AI dùng ở đây theo chuẩn OpenAI /chat/completions. Hai điểm đã thử
// và phải chiều theo:
//   - Nó bỏ qua response_format: json_object.
//   - Nó gần như không tuân theo chỉ dẫn đặt ở role "system".
// Nên toàn bộ yêu cầu về định dạng nằm trong tin nhắn user, và phần trả về
// được bóc JSON một cách phòng thủ thay vì JSON.parse thẳng.

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

// Ảnh đã được nén ở phía client xuống cạnh dài 1024px nên bình thường chỉ
// vài trăm KB. Mốc này chỉ để chặn yêu cầu bất thường.
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const PROMPT = `Bạn là chuyên gia đánh giá mức độ thân thiện với môi trường của sản phẩm tiêu dùng.

Hãy nhìn tấm ảnh kèm theo và làm ba việc:
1. Xác định đó là sản phẩm gì, đọc chữ trên bao bì nếu nhìn thấy.
2. Suy ra chất liệu bao bì từ hình dạng và bề mặt.
3. Chấm độ xanh của sản phẩm.

Trả về DUY NHẤT một đối tượng JSON, không kèm lời dẫn, không kèm markdown,
không kèm dấu backtick. Ký tự đầu tiên phải là { và ký tự cuối cùng phải là }.

Cấu trúc bắt buộc:
{
  "detected": true nếu nhìn thấy một sản phẩm tiêu dùng rõ ràng, false nếu ảnh mờ, trống, hoặc không phải sản phẩm,
  "confidence": số thực từ 0 đến 1 cho biết mức chắc chắn,
  "name": "tên sản phẩm, càng cụ thể càng tốt",
  "brand": "thương hiệu, chuỗi rỗng nếu không đọc được",
  "category": "danh mục, ví dụ Đồ uống, Thực phẩm, Hóa mỹ phẩm, Văn phòng phẩm",
  "packaging": "loại bao bì, ví dụ Chai nhựa PET, Lon nhôm, Hộp giấy, Túi ni-lông",
  "materials": ["các chất liệu nhìn thấy được"],
  "greenScore": số từ 0 đến 10,
  "recyclable": true/false,
  "biodegradable": true/false,
  "plasticFree": true/false,
  "recommendation": "gợi ý 1-2 câu cho học sinh, giọng thân thiện",
  "analysis": "phân tích ngắn, nêu rõ căn cứ vào chi tiết nào trong ảnh",
  "alternatives": ["1 đến 3 lựa chọn thay thế xanh hơn"]
}

Thang điểm xanh:
- 8 đến 10: rất xanh, tái chế được hoặc phân hủy sinh học, không nhựa dùng một lần
- 5 đến 7: trung bình, có một vài điểm cộng về môi trường
- 0 đến 4: kém xanh, nhiều nhựa dùng một lần, khó tái chế

Nếu detected là false thì vẫn trả đủ mọi trường: greenScore để 0, các cờ để
false, và nói rõ trong recommendation là chưa nhận ra sản phẩm cùng cách chụp
lại cho rõ hơn.

Viết toàn bộ nội dung bằng tiếng Việt.`;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Mô hình hay bọc JSON trong ```json ... ``` hoặc kèm một câu dẫn, nên bóc
// lấy khối ngoặc nhọn đầu tiên thay vì tin vào toàn bộ chuỗi.
function extractJson(text) {
  if (typeof text !== "string") return null;

  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // thử tiếp bằng cách trích khối ngoặc
  }

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end <= start) return null;

  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
}

export async function POST(req) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    let body;
    try {
      const raw = await req.text();
      body = raw ? JSON.parse(raw) : {};
    } catch {
      return json({ error: "Body không phải JSON" }, 400);
    }

    const { imageBase64, mimeType } = body;

    if (typeof imageBase64 !== "string" || !imageBase64) {
      return json({ error: "Thiếu ảnh trong trường imageBase64" }, 400);
    }

    // Client có thể gửi kèm tiền tố data URL, cắt bỏ cho sạch.
    const base64 = imageBase64.includes(",")
      ? imageBase64.slice(imageBase64.indexOf(",") + 1)
      : imageBase64;

    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64)) {
      return json({ error: "Dữ liệu ảnh không phải base64 hợp lệ" }, 400);
    }

    // Mỗi 4 ký tự base64 mã hóa 3 byte.
    const approxBytes = Math.floor((base64.length * 3) / 4);
    if (approxBytes > MAX_IMAGE_BYTES) {
      return json(
        { error: `Ảnh quá lớn (${Math.round(approxBytes / 1024)} KB). Tối đa 5 MB.` },
        413
      );
    }

    const mime = ALLOWED_MIME.includes(mimeType) ? mimeType : "image/jpeg";

    const gatewayUrl = (process.env.AI_GATEWAY_URL || "").trim().replace(/\/+$/, "");
    const gatewayKey = (process.env.AI_GATEWAY_KEY || "").replace(/﻿/g, "").trim();
    const model = (process.env.AI_VISION_MODEL || "").trim();

    if (!gatewayUrl || !gatewayKey || !model) {
      return json(
        {
          error:
            "Chưa cấu hình cổng AI. Cần AI_GATEWAY_URL, AI_GATEWAY_KEY và AI_VISION_MODEL trong biến môi trường.",
        },
        500
      );
    }

    const resp = await fetch(`${gatewayUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${gatewayKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.1,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: PROMPT },
              {
                type: "image_url",
                image_url: { url: `data:${mime};base64,${base64}` },
              },
            ],
          },
        ],
      }),
    });

    const responseText = await resp.text();

    if (!resp.ok) {
      console.error("Vision gateway error:", resp.status, responseText.slice(0, 500));
      return json(
        { error: `Cổng AI trả lỗi ${resp.status}`, details: responseText.slice(0, 500) },
        resp.status
      );
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      return json({ error: "Không parse được phản hồi từ cổng AI" }, 502);
    }

    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      const reason = data?.choices?.[0]?.finish_reason || "không rõ";
      return json({ error: `Mô hình không trả về nội dung (lý do: ${reason})` }, 502);
    }

    const result = extractJson(content);
    if (!result) {
      console.error("Không bóc được JSON từ:", String(content).slice(0, 300));
      return json(
        { error: "Mô hình trả về dữ liệu không đúng định dạng JSON", raw: String(content).slice(0, 300) },
        502
      );
    }

    const score = Number(result.greenScore);
    const conf = Number(result.confidence);

    return json({
      source: "image",
      model,
      detected: result.detected === true,
      confidence: Number.isFinite(conf) ? Math.min(1, Math.max(0, conf)) : null,
      barcode: null,
      name: result.name && result.name !== "null" ? result.name : "Sản phẩm không xác định",
      brand: result.brand && result.brand !== "null" ? result.brand : "",
      category: result.category && result.category !== "null" ? result.category : "Chưa xác định",
      packaging: result.packaging && result.packaging !== "null" ? result.packaging : "Chưa xác định",
      materials: Array.isArray(result.materials) ? result.materials : [],
      greenScore: Number.isFinite(score) ? Math.min(10, Math.max(0, score)) : null,
      recyclable: result.recyclable === true,
      biodegradable: result.biodegradable === true,
      plasticFree: result.plasticFree === true,
      recommendation: result.recommendation || "Không có gợi ý",
      analysis: result.analysis || "",
      alternatives: Array.isArray(result.alternatives) ? result.alternatives : [],
    });
  } catch (err) {
    console.error("/api/nhan-dien-san-pham error:", err?.message || err);
    return json({ error: err?.message || "Lỗi server" }, 500);
  }
}
