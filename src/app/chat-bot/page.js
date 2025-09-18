"use client";
import React, { useEffect, useRef, useState } from "react";

const STORAGE_PREFIX = "songoanh_chat_history";
const MAX_SAVE = 100; // lưu tối đa 100 tin nhắn
const MAX_SEND_HISTORY = 12; // gửi tối đa 12 tin nhắn gần nhất lên Gemini

export default function ChatBotPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Chào bạn 🌿 — mình có thể giúp gì hôm nay?" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(""); // optional: cho phân biệt người dùng
  const bottomRef = useRef(null);

  // load history on mount
  useEffect(() => {
    try {
      const key = userId ? `${STORAGE_PREFIX}_${userId}` : STORAGE_PREFIX;
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) setMessages(parsed);
      }
    } catch (e) {
      console.warn("Không load được lịch sử:", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // chỉ chạy 1 lần. Nếu bạn muốn load theo userId, có thể thêm userId vào dependency

  // save history when messages change
  useEffect(() => {
    try {
      const key = userId ? `${STORAGE_PREFIX}_${userId}` : STORAGE_PREFIX;
      const trimmed = messages.slice(-MAX_SAVE);
      localStorage.setItem(key, JSON.stringify(trimmed));
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (e) {
      console.warn("Không lưu lịch sử:", e);
    }
  }, [messages, userId]);

  // parse Gemini response safely
  const parseGeminiText = (data) => {
    try {
      const cand = data?.candidates?.[0];
      if (cand?.content?.parts && Array.isArray(cand.content.parts)) {
        return cand.content.parts.map((p) => p.text || "").join("");
      }
      if (cand?.output) return cand.output;
      if (data?.text) return data.text;
      return "Không có phản hồi";
    } catch {
      return "Không đọc được phản hồi từ Gemini";
    }
  };

  // prepare contents from recent history (exclude system)
  const buildContentsFromMessages = (messagesArr, currentUserText) => {
  const recent = messagesArr.filter((m) => m.role !== "system").slice(-MAX_SEND_HISTORY);
  const contents = recent.map((m) => ({
    role: m.role,
    parts: [{ text: m.content }],
  }));
  if (currentUserText) {
    contents.push({ role: "user", parts: [{ text: currentUserText }] });
  }
  return contents;
};


const sendMessage = async () => {
  setError("");
  const trimmed = message.trim();
  if (!trimmed) return;

  // tạo newMessages cục bộ để dùng luôn (tránh trạng thái chưa kịp cập nhật)
  const newUserMsg = { role: "user", content: trimmed };
  const newMessages = [...messages, newUserMsg];

  // cập nhật UI trước
  setMessages(newMessages);
  setMessage("");
  setLoading(true);

  try {
    const systemInstruction = {
      parts: [
        {
          text: "Bạn là trợ lý AI. Trả lời mọi câu hỏi bằng tiếng Việt, ngắn gọn, rõ ràng và thân thiện.",
        },
      ],
    };

    // build contents từ newMessages (không cần push trimmed nữa vì newMessages đã có)
    const contents = buildContentsFromMessages(newMessages, null); // sửa hàm để nếu currentUserText = null thì không append

    const payload = {
      systemInstruction,
      contents,
      generation_config: { temperature: 0.2, maxOutputTokens: 512 },
    };

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Lỗi proxy: ${res.status} ${txt}`);
    }

    const data = await res.json();
    const assistantText = parseGeminiText(data);

    // append assistant reply to latest state (functional update)
    setMessages((m) => [...m, { role: "assistant", content: assistantText }]);
  } catch (err) {
    console.error("Fetch error:", err);
    setError(err?.message || "Có lỗi xảy ra");
    setMessages((m) => [...m, { role: "assistant", content: "Xin lỗi — có lỗi khi gọi API." }]);
  } finally {
    setLoading(false);
  }
};


  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) sendMessage();
    }
  };

  // export history as JSON file
  const exportHistory = () => {
    const key = userId ? `${STORAGE_PREFIX}_${userId}` : STORAGE_PREFIX;
    const raw = localStorage.getItem(key) || JSON.stringify(messages);
    const blob = new Blob([raw], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-history${userId ? "_" + userId : ""}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // import history (replace current)
  const importHistory = async (ev) => {
    const file = ev.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) throw new Error("File không đúng định dạng (cần array of messages).");
      setMessages(parsed.slice(-MAX_SAVE));
      alert("Đã import lịch sử.");
    } catch (err) {
      alert("Import thất bại: " + err.message);
    } finally {
      ev.target.value = "";
    }
  };

  const clearHistory = () => {
    if (!confirm("Xác nhận xóa lịch sử chat trên trình duyệt?")) return;
    const key = userId ? `${STORAGE_PREFIX}_${userId}` : STORAGE_PREFIX;
    localStorage.removeItem(key);
    setMessages([{ role: "assistant", content: "Chào bạn 🌿 — mình có thể giúp gì hôm nay?" }]);
  };

  const setUserIdPrompt = () => {
    const id = prompt("Nhập ID người dùng (để phân tách lịch sử), để trống để bỏ:");
    if (id === null) return;
    setUserId(id.trim());
    alert("Đã cập nhật userId. Lịch sử mới sẽ lưu theo userId này.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v12m0 0C8.134 15 4 17 4 20c0 0 4-1 8-1s8 1 8 1c0-3-4.134-5-8-5z" />
            </svg>
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-green-800">Sống Xanh — Trợ lý</h1>
            <p className="text-sm text-green-700/80">Trả lời tiếng Việt. Hỏi về sống xanh, hoạt động, mẹo tiết kiệm năng lượng...</p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={setUserIdPrompt} className="text-sm px-3 py-1 border rounded">Đổi user</button>
            <button onClick={exportHistory} className="text-sm px-3 py-1 border rounded">Export</button>
            <label className="text-sm px-3 py-1 border rounded cursor-pointer">
              Import
              <input type="file" accept="application/json" onChange={importHistory} className="hidden" />
            </label>
            <button onClick={clearHistory} className="text-sm px-3 py-1 border rounded text-red-600">Clear</button>
          </div>
        </header>

        <main className="bg-white rounded-2xl shadow p-4 h-[68vh] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`${m.role === "user" ? "bg-green-600 text-white" : "bg-green-50 text-green-900"} max-w-[80%] px-4 py-3 rounded-xl shadow-sm whitespace-pre-wrap`}>
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-green-50 text-green-900 max-w-[70%] px-4 py-3 rounded-xl shadow-sm flex items-center gap-3">
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
                    <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <span>Đang trả lời...</span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="mt-4 pt-4 border-t border-green-100">
            {error && <div className="text-sm text-red-600 mb-2">Lỗi: {error}</div>}

            <div className="flex gap-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Gõ câu hỏi của bạn... (Enter gửi, Shift+Enter xuống dòng)"
                className="flex-1 resize-none h-20 rounded-xl border border-green-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-200"
              />

              <button
                onClick={sendMessage}
                disabled={loading}
                className="h-12 w-12 flex-shrink-0 rounded-xl bg-green-600 hover:bg-green-700 active:scale-95 text-white flex items-center justify-center shadow"
                title="Gửi"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5l7 7-7 7M5 12h14" />
                </svg>
              </button>
            </div>

            <div className="mt-2 text-xs text-green-600/80">
              <span>Ghi chú: </span>Ứng dụng lưu lịch sử trên **localStorage** (chỉ trên trình duyệt này). Để gọi Gemini an toàn, hãy đảm bảo bạn đã cấu hình `GEMINI_API_KEY` trong server env và dùng proxy `/api/chat` (mình đã chuẩn bị route server phía dưới).
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
