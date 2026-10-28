// app/api/classify-behavior/route.js
// Phân loại hành vi theo hướng tốt / xấu với môi trường.
// Hai chế độ:
//   mode = "de"   -> AI nghĩ ra một hành vi để người chơi đoán
//   mode = "cham" -> người chơi mô tả hành vi của mình, AI chấm
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

const MAX_INPUT = 300;

// Dùng khi chưa cấu hình GEMINI_API_KEY, để chế độ luyện tập vẫn chơi được.
const FALLBACK_BANK = [
  { text: 'Mang bình nước cá nhân đi học thay vì mua chai nhựa', label: 'tot', explain: 'Một bình dùng lại thay thế hàng trăm chai nhựa mỗi năm.' },
  { text: 'Vứt pin cũ chung với rác sinh hoạt', label: 'xau', explain: 'Pin là rác nguy hại, kim loại nặng trong pin có thể ngấm vào đất và nước.' },
  { text: 'Tắt đèn và quạt khi là người cuối cùng rời phòng', label: 'tot', explain: 'Giảm điện năng lãng phí mà không tốn công sức gì.' },
  { text: 'Để vòi nước chảy suốt lúc đánh răng', label: 'xau', explain: 'Mỗi lần đánh răng có thể lãng phí vài lít nước sạch.' },
  { text: 'Mang túi vải khi đi siêu thị', label: 'tot', explain: 'Từ chối túi ni-lông, loại rác cần 500–1.000 năm để phân hủy.' },
  { text: 'Đốt rác trong vườn nhà', label: 'xau', explain: 'Đốt rác thải ra khói độc và bụi mịn, ảnh hưởng hô hấp của cả xóm.' },
  { text: 'Đi bộ hoặc đạp xe cho quãng đường ngắn', label: 'tot', explain: 'Không phát thải, lại tốt cho sức khỏe.' },
  { text: 'Mua đồ ăn mang về đựng trong hộp xốp dùng một lần', label: 'xau', explain: 'Hộp xốp rất khó tái chế và gần như không phân hủy.' },
  { text: 'Tách riêng chai lọ, lon đã rửa sạch để tái chế', label: 'tot', explain: 'Rác tái chế sạch mới được thu gom, dính thức ăn thường bị loại.' },
  { text: 'Lấy nhiều thức ăn rồi bỏ thừa', label: 'xau', explain: 'Lãng phí cả thực phẩm lẫn nước, đất và năng lượng đã dùng để làm ra nó.' },
  { text: 'Dùng giấy cả hai mặt khi làm bài nháp', label: 'tot', explain: 'Giảm một nửa lượng giấy, tức giảm số cây phải chặt.' },
  { text: 'Xả dầu ăn thừa xuống bồn rửa', label: 'xau', explain: 'Dầu đông lại gây tắc ống và ô nhiễm nguồn nước.' },
];

// Ngân hàng hành vi nay nằm trong database để quản trị viên tự sửa được.
// FALLBACK_BANK bên trên chỉ dùng khi bảng còn rỗng hoặc đọc lỗi.
async function pickFallback(exclude = []) {
  let bank = FALLBACK_BANK;

  try {
    const rows = await prisma.behaviorItem.findMany({
      where: { active: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      select: { text: true, label: true, explain: true },
    });
    if (rows.length) bank = rows;
  } catch (err) {
    console.error('Không đọc được BehaviorItem, dùng ngân hàng dự phòng:', err?.message || err);
  }

  const pool = bank.filter((item) => !exclude.includes(item.text));
  const list = pool.length ? pool : bank;
  return { ...list[Math.floor(Math.random() * list.length)], source: 'bank' };
}

function getKey() {
  const raw = process.env.GEMINI_API_KEY || '';
  const key = raw.replace(/﻿/g, '').trim();
  if (!key || !/^[A-Za-z0-9_\-:]+$/.test(key)) return null;
  return key;
}

async function askGemini(systemPrompt, userMessage, key) {
  const url =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' +
    encodeURIComponent(key);

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
      generation_config: {
        temperature: 0.7,
        maxOutputTokens: 512,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!resp.ok) {
    throw new Error(`Gemini trả về ${resp.status}`);
  }

  const data = await resp.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini không trả về nội dung');

  return JSON.parse(text);
}

const DE_PROMPT = `Bạn ra đề cho một trò chơi dành cho học sinh Việt Nam về môi trường.

Nhiệm vụ: nghĩ ra MỘT hành vi đời thường, ngắn gọn, dễ gặp với học sinh, rồi cho biết hành vi đó tốt hay xấu với môi trường.

Trả về đúng JSON sau, không kèm markdown:
{
  "text": "<mô tả hành vi, 1 câu, dưới 20 từ, không tiết lộ đáp án>",
  "label": "tot" hoặc "xau",
  "explain": "<giải thích ngắn 1-2 câu vì sao>"
}

Yêu cầu:
- Luân phiên ngẫu nhiên giữa hành vi tốt và xấu.
- Dùng tình huống gần gũi: lớp học, nhà, căng tin, đi chợ, đi lại.
- Không dùng lại các hành vi đã nêu trong phần "Đã ra rồi".
- Viết tiếng Việt tự nhiên, không sáo rỗng.`;

const CHAM_PROMPT = `Bạn chấm hành vi môi trường cho học sinh Việt Nam.

Người dùng mô tả một việc họ vừa làm. Hãy phân loại việc đó là tốt hay xấu với môi trường.

Trả về đúng JSON sau, không kèm markdown:
{
  "label": "tot" | "xau" | "trungtinh",
  "explain": "<1-2 câu giải thích tác động tới môi trường>",
  "suggestion": "<1 câu gợi ý làm tốt hơn, hoặc lời khen nếu đã tốt>",
  "points": <số nguyên 0-5>
}

Quy tắc chấm điểm:
- "tot": 1-5 điểm tùy mức tác động (việc nhỏ hằng ngày 1-2, việc tốn công sức như trồng cây, dọn rác 3-5).
- "xau": luôn 0 điểm. Không trách mắng, chỉ giải thích tác hại và gợi ý cách thay thế.
- "trungtinh": 0 điểm, dùng khi việc mô tả không liên quan tới môi trường.
- Nếu nội dung không phải mô tả hành vi (spam, vô nghĩa), trả label "trungtinh", points 0, explain nói rõ là chưa hiểu.

Viết tiếng Việt thân thiện, ngắn gọn, xưng "bạn".`;

export async function POST(request) {
  // Trò chơi có cộng điểm nên bắt buộc đăng nhập
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const mode = body?.mode;
    const key = getKey();

    // ---- Chế độ 1: AI ra đề để người chơi phân loại ----
    if (mode === 'de') {
      const exclude = Array.isArray(body.exclude) ? body.exclude.slice(0, 10) : [];

      if (!key) {
        return NextResponse.json(await pickFallback(exclude));
      }

      try {
        const result = await askGemini(
          DE_PROMPT,
          `Đã ra rồi: ${exclude.length ? exclude.join(' | ') : '(chưa có)'}`,
          key
        );

        if (!result?.text || !['tot', 'xau'].includes(result.label)) {
          throw new Error('Định dạng trả về không hợp lệ');
        }

        return NextResponse.json({
          text: String(result.text).slice(0, 200),
          label: result.label,
          explain: String(result.explain || '').slice(0, 300),
          source: 'ai',
        });
      } catch (err) {
        // AI lỗi thì vẫn cho chơi tiếp bằng bộ câu có sẵn
        console.warn('classify-behavior (de) fallback:', err.message);
        return NextResponse.json(await pickFallback(exclude));
      }
    }

    // ---- Chế độ 2: người chơi mô tả, AI chấm ----
    if (mode === 'cham') {
      const text = String(body.text || '').trim().slice(0, MAX_INPUT);

      if (text.length < 5) {
        return NextResponse.json(
          { error: 'Hãy mô tả rõ hơn việc bạn vừa làm (ít nhất 5 ký tự)' },
          { status: 400 }
        );
      }

      if (!key) {
        return NextResponse.json(
          { error: 'Chức năng này cần GEMINI_API_KEY được cấu hình trên server' },
          { status: 503 }
        );
      }

      const result = await askGemini(CHAM_PROMPT, `Hành vi: ${text}`, key);

      const label = ['tot', 'xau', 'trungtinh'].includes(result?.label)
        ? result.label
        : 'trungtinh';

      // Chỉ hành vi tốt mới có điểm, và chặn trên ở 5 để AI không cộng quá tay
      let points = Number(result?.points);
      if (!Number.isInteger(points) || points < 0) points = 0;
      if (label !== 'tot') points = 0;
      points = Math.min(points, 5);

      return NextResponse.json({
        label,
        explain: String(result?.explain || '').slice(0, 400),
        suggestion: String(result?.suggestion || '').slice(0, 300),
        points,
      });
    }

    return NextResponse.json({ error: 'mode không hợp lệ' }, { status: 400 });
  } catch (err) {
    console.error('POST /api/classify-behavior error:', err?.message || err);
    return NextResponse.json(
      { error: 'Không phân loại được lúc này, bạn thử lại sau nhé' },
      { status: 500 }
    );
  }
}
