"use client";

import React, { useEffect, useRef, useState } from "react";

const STORAGE_PREFIX = "songoanh_chat_history";
const MAX_SAVE = 100; // lưu tối đa 100 tin nhắn
const MAX_SEND_HISTORY = 12; // gửi tối đa 12 tin nhắn gần nhất lên Gemini
const STORAGE_VIDEO_KEY = "songoanh_last_chat_video";

export default function ChatBotPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Chào bạn 🌿 — mình có thể giúp gì hôm nay?" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(""); // optional: cho phân biệt người dùng
  const bottomRef = useRef(null);

  // ===== video list và logic random giống phần hành vi xanh =====
  const videos = [
    "/videos/Animation001.mp4",
    "/videos/Animation002.mp4",
    "/videos/Animation003.mp4",
    "/videos/Animation004.mp4",
    // ví dụ YouTube:
    // "https://youtu.be/dQw4w9WgXcQ",
    "https://youtu.be/nLCBnLuBGqU?si=UveCWLY3IraqUg-c",
    "https://youtu.be/rPcy-QSCf54?si=Iy9f47PzEFB__j7x",
  ];

  const pickRandom = (arr, avoid = null) => {
    if (!arr || arr.length === 0) return null;
    if (arr.length === 1) return arr[0];
    let idx, tries = 0;
    do {
      idx = Math.floor(Math.random() * arr.length);
      tries += 1;
      if (tries > 20) break;
    } while (avoid !== null && arr[idx] === avoid);
    return arr[idx];
  };

  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    try {
      const last = typeof window !== "undefined" ? localStorage.getItem(STORAGE_VIDEO_KEY) : null;
      const pick = pickRandom(videos, last);
      setSelectedVideo(pick);
      if (typeof window !== "undefined" && pick) localStorage.setItem(STORAGE_VIDEO_KEY, pick);
    } catch (e) {
      setSelectedVideo(pickRandom(videos));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shuffleVideo = () => {
    try {
      const last = typeof window !== "undefined" ? localStorage.getItem(STORAGE_VIDEO_KEY) : null;
      const next = pickRandom(videos, last || selectedVideo);
      setSelectedVideo(next);
      if (typeof window !== "undefined" && next) localStorage.setItem(STORAGE_VIDEO_KEY, next);
    } catch (e) {
      setSelectedVideo(pickRandom(videos));
    }
  };

  const isYouTube = (url) => /youtube\.com|youtu\.be/.test(url);
  const isDirectVideoFile = (url) => /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
  const toYouTubeEmbed = (url) => {
    try {
      const short = url.match(/youtu\.be\/([^\?&/]+)/);
      if (short && short[1]) return `https://www.youtube.com/embed/${short[1]}?rel=0`;
      const u = new URL(url);
      const vid = u.searchParams.get("v");
      if (vid) return `https://www.youtube.com/embed/${vid}?rel=0`;
      const embedMatch = url.match(/embed\/([^\?&/]+)/);
      if (embedMatch && embedMatch[1]) return `https://www.youtube.com/embed/${embedMatch[1]}?rel=0`;
    } catch (e) {
      // fallback
    }
    return url;
  };

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
  const buildContentsFromMessages = (messagesArr, currentUser) => {
    const recent = messagesArr.filter((m) => m.role !== "system").slice(-MAX_SEND_HISTORY);
    const contents = recent.map((m) => {
      const parts = m.content ? [{ text: m.content }] : [];
      if (m.image) {
        parts.push({ inline_data: { mime_type: m.image.mime, data: m.image.data } });
      }
      return { role: m.role, parts };
    });
    if (currentUser) {
      const currentParts = currentUser.content ? [{ text: currentUser.content }] : [];
      if (currentUser.image) {
        currentParts.push({ inline_data: { mime_type: currentUser.image.mime, data: currentUser.image.data } });
      }
      contents.push({ role: "user", parts: currentParts });
    }
    return contents;
  };

  // State cho ảnh upload
  const [selectedImage, setSelectedImage] = useState(null); // {mime: string, data: base64} | null

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Chỉ hỗ trợ file ảnh (jpeg, png, gif, webp).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result.split(",")[1]; // loại bỏ data:mime;base64,
      const mime = file.type;
      setSelectedImage({ mime, data: base64 });
    };
    reader.readAsDataURL(file);
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  const sendMessage = async () => {
    setError("");
    const trimmed = message.trim();
    if (!trimmed && !selectedImage) return;

    const newUserMsg = { 
      role: "user", 
      content: trimmed, 
      image: selectedImage ? { ...selectedImage } : null 
    };
    const newMessages = [...messages, newUserMsg];

    setMessages(newMessages);
    setMessage("");
    setSelectedImage(null);
    setLoading(true);

    try {
      const contents = buildContentsFromMessages(newMessages, null);

      const payload = { contents, generation_config: { temperature: 0.2, maxOutputTokens: 512 } };

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

  // export/import/clear history functions
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
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v12m0 0C8.134 15 4 17 4 20c0 0 4-1 8-1s8 1 8 1c0-3-4.134-5-8-5z" />
            </svg>
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-green-800">Sống Xanh — Trợ lý AI</h1>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={clearHistory} className="text-sm px-3 py-1 border rounded text-red-600">Clear</button>
          </div>
        </header>

        {/* video area: ở trên chat */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex items-center justify-center gap-4">
            <div className="w-full max-w-3xl">
              {selectedVideo ? (
                isYouTube(selectedVideo) ? (
                  <div className="aspect-video w-full rounded-lg overflow-hidden shadow-sm mx-auto">
                    <iframe
                      className="w-full h-full"
                      src={toYouTubeEmbed(selectedVideo)}
                      title="Video Sống Xanh"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : isDirectVideoFile(selectedVideo) ? (
                  <video controls preload="metadata" className="w-full rounded-lg shadow-sm mx-auto" playsInline>
                    <source src={selectedVideo} />
                    Trình duyệt của bạn không hỗ trợ video. <a href={selectedVideo}>Mở link</a>
                  </video>
                ) : (
                  <div className="p-4 rounded-lg border border-gray-200 text-left">
                    <p className="mb-2">Không nhận diện được kiểu video — mở link bên dưới:</p>
                    <a href={selectedVideo} target="_blank" rel="noopener noreferrer" className="text-green-600 underline">
                      Mở video
                    </a>
                  </div>
                )
              ) : (
                <div className="text-gray-600">Không có video để hiển thị.</div>
              )}
            </div>
          </div>
        </div>

        <main className="bg-white rounded-2xl shadow p-4 h-[62vh] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`${m.role === "user" ? "bg-green-600 text-white" : "bg-green-50 text-green-900"} max-w-[80%] px-4 py-3 rounded-xl shadow-sm whitespace-pre-wrap`}>
                  {m.image && (
                    <img 
                      src={`data:${m.image.mime};base64,${m.image.data}`} 
                      alt="Uploaded image" 
                      className="max-w-full h-auto rounded-md mb-2" 
                    />
                  )}
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

            {selectedImage && (
              <div className="mb-2 flex items-center gap-2">
                <img 
                  src={`data:${selectedImage.mime};base64,${selectedImage.data}`} 
                  alt="Preview" 
                  className="w-16 h-16 object-cover rounded-md" 
                />
                <button onClick={removeSelectedImage} className="text-red-600 text-sm">Xóa ảnh</button>
              </div>
            )}

            <div className="flex gap-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Gõ câu hỏi của bạn... (Enter gửi, Shift+Enter xuống dòng). Upload ảnh để phân tích."
                className="flex-1 resize-none h-20 rounded-xl border border-green-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-200"
              />

              <label className="h-12 w-12 flex-shrink-0 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center shadow cursor-pointer" title="Upload ảnh">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </label>

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
          </div>
        </main>
      </div>
    </div>
  );
}