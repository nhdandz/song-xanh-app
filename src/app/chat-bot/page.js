// "use client";
// import React, { useEffect, useRef, useState } from "react";

// const STORAGE_PREFIX = "songoanh_chat_history";
// const MAX_SAVE = 100; // lưu tối đa 100 tin nhắn
// const MAX_SEND_HISTORY = 12; // gửi tối đa 12 tin nhắn gần nhất lên Gemini

// export default function ChatBotPage() {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([
//     { role: "assistant", content: "Chào bạn 🌿 — mình có thể giúp gì hôm nay?" },
//   ]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [userId, setUserId] = useState(""); // optional: cho phân biệt người dùng
//   const bottomRef = useRef(null);

//   // load history on mount
//   useEffect(() => {
//     try {
//       const key = userId ? `${STORAGE_PREFIX}_${userId}` : STORAGE_PREFIX;
//       const raw = localStorage.getItem(key);
//       if (raw) {
//         const parsed = JSON.parse(raw);
//         if (Array.isArray(parsed) && parsed.length) setMessages(parsed);
//       }
//     } catch (e) {
//       console.warn("Không load được lịch sử:", e);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []); // chỉ chạy 1 lần. Nếu bạn muốn load theo userId, có thể thêm userId vào dependency

//   // save history when messages change
//   useEffect(() => {
//     try {
//       const key = userId ? `${STORAGE_PREFIX}_${userId}` : STORAGE_PREFIX;
//       const trimmed = messages.slice(-MAX_SAVE);
//       localStorage.setItem(key, JSON.stringify(trimmed));
//       bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//     } catch (e) {
//       console.warn("Không lưu lịch sử:", e);
//     }
//   }, [messages, userId]);

//   // parse Gemini response safely
//   const parseGeminiText = (data) => {
//     try {
//       const cand = data?.candidates?.[0];
//       if (cand?.content?.parts && Array.isArray(cand.content.parts)) {
//         return cand.content.parts.map((p) => p.text || "").join("");
//       }
//       if (cand?.output) return cand.output;
//       if (data?.text) return data.text;
//       return "Không có phản hồi";
//     } catch {
//       return "Không đọc được phản hồi từ Gemini";
//     }
//   };

//   // prepare contents from recent history (exclude system)
//   const buildContentsFromMessages = (messagesArr, currentUserText) => {
//   const recent = messagesArr.filter((m) => m.role !== "system").slice(-MAX_SEND_HISTORY);
//   const contents = recent.map((m) => ({
//     role: m.role,
//     parts: [{ text: m.content }],
//   }));
//   if (currentUserText) {
//     contents.push({ role: "user", parts: [{ text: currentUserText }] });
//   }
//   return contents;
// };


// const sendMessage = async () => {
//   setError("");
//   const trimmed = message.trim();
//   if (!trimmed) return;

//   // tạo newMessages cục bộ để dùng luôn (tránh trạng thái chưa kịp cập nhật)
//   const newUserMsg = { role: "user", content: trimmed };
//   const newMessages = [...messages, newUserMsg];

//   // cập nhật UI trước
//   setMessages(newMessages);
//   setMessage("");
//   setLoading(true);

//   try {
//     // build contents từ newMessages (không cần push trimmed nữa vì newMessages đã có)
//     const contents = buildContentsFromMessages(newMessages, null); // sửa hàm để nếu currentUserText = null thì không append

//     const payload = {
//       contents,
//       generation_config: { temperature: 0.2, maxOutputTokens: 512 },
//     };

//     const res = await fetch("/api/chat", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     if (!res.ok) {
//       const txt = await res.text();
//       throw new Error(`Lỗi proxy: ${res.status} ${txt}`);
//     }

//     const data = await res.json();
//     const assistantText = parseGeminiText(data);

//     // append assistant reply to latest state (functional update)
//     setMessages((m) => [...m, { role: "assistant", content: assistantText }]);
//   } catch (err) {
//     console.error("Fetch error:", err);
//     setError(err?.message || "Có lỗi xảy ra");
//     setMessages((m) => [...m, { role: "assistant", content: "Xin lỗi — có lỗi khi gọi API." }]);
//   } finally {
//     setLoading(false);
//   }
// };


//   const onKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       if (!loading) sendMessage();
//     }
//   };

//   // export history as JSON file
//   const exportHistory = () => {
//     const key = userId ? `${STORAGE_PREFIX}_${userId}` : STORAGE_PREFIX;
//     const raw = localStorage.getItem(key) || JSON.stringify(messages);
//     const blob = new Blob([raw], { type: "application/json" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `chat-history${userId ? "_" + userId : ""}.json`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   // import history (replace current)
//   const importHistory = async (ev) => {
//     const file = ev.target.files?.[0];
//     if (!file) return;
//     try {
//       const text = await file.text();
//       const parsed = JSON.parse(text);
//       if (!Array.isArray(parsed)) throw new Error("File không đúng định dạng (cần array of messages).");
//       setMessages(parsed.slice(-MAX_SAVE));
//       alert("Đã import lịch sử.");
//     } catch (err) {
//       alert("Import thất bại: " + err.message);
//     } finally {
//       ev.target.value = "";
//     }
//   };

//   const clearHistory = () => {
//     if (!confirm("Xác nhận xóa lịch sử chat trên trình duyệt?")) return;
//     const key = userId ? `${STORAGE_PREFIX}_${userId}` : STORAGE_PREFIX;
//     localStorage.removeItem(key);
//     setMessages([{ role: "assistant", content: "Chào bạn 🌿 — mình có thể giúp gì hôm nay?" }]);
//   };

//   const setUserIdPrompt = () => {
//     const id = prompt("Nhập ID người dùng (để phân tách lịch sử), để trống để bỏ:");
//     if (id === null) return;
//     setUserId(id.trim());
//     alert("Đã cập nhật userId. Lịch sử mới sẽ lưu theo userId này.");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
//       <div className="max-w-5xl mx-auto">
//         <header className="flex items-center gap-4 mb-6">
//           <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow">
//             <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v12m0 0C8.134 15 4 17 4 20c0 0 4-1 8-1s8 1 8 1c0-3-4.134-5-8-5z" />
//             </svg>
//           </div>

//           <div className="flex-1">
//             <h1 className="text-2xl font-bold text-green-800">Sống Xanh — Trợ lý AI</h1>
//           </div>

//           <div className="flex items-center gap-2">
//             <button onClick={setUserIdPrompt} className="text-sm px-3 py-1 border rounded">Đổi user</button>
//             <button onClick={exportHistory} className="text-sm px-3 py-1 border rounded">Export</button>
//             <label className="text-sm px-3 py-1 border rounded cursor-pointer">
//               Import
//               <input type="file" accept="application/json" onChange={importHistory} className="hidden" />
//             </label>
//             <button onClick={clearHistory} className="text-sm px-3 py-1 border rounded text-red-600">Clear</button>
//           </div>
//         </header>

//         <main className="bg-white rounded-2xl shadow p-4 h-[68vh] flex flex-col overflow-hidden">
//           <div className="flex-1 overflow-y-auto pr-2 space-y-4">
//             {messages.map((m, i) => (
//               <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
//                 <div className={`${m.role === "user" ? "bg-green-600 text-white" : "bg-green-50 text-green-900"} max-w-[80%] px-4 py-3 rounded-xl shadow-sm whitespace-pre-wrap`}>
//                   {m.content}
//                 </div>
//               </div>
//             ))}

//             {loading && (
//               <div className="flex justify-start">
//                 <div className="bg-green-50 text-green-900 max-w-[70%] px-4 py-3 rounded-xl shadow-sm flex items-center gap-3">
//                   <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
//                     <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
//                     <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
//                   </svg>
//                   <span>Đang trả lời...</span>
//                 </div>
//               </div>
//             )}

//             <div ref={bottomRef} />
//           </div>

//           <div className="mt-4 pt-4 border-t border-green-100">
//             {error && <div className="text-sm text-red-600 mb-2">Lỗi: {error}</div>}

//             <div className="flex gap-3">
//               <textarea
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 onKeyDown={onKeyDown}
//                 placeholder="Gõ câu hỏi của bạn... (Enter gửi, Shift+Enter xuống dòng)"
//                 className="flex-1 resize-none h-20 rounded-xl border border-green-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-200"
//               />

//               <button
//                 onClick={sendMessage}
//                 disabled={loading}
//                 className="h-12 w-12 flex-shrink-0 rounded-xl bg-green-600 hover:bg-green-700 active:scale-95 text-white flex items-center justify-center shadow"
//                 title="Gửi"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5l7 7-7 7M5 12h14" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

'use client';
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

  // ---- VIDEO RANDOM SETUP ----
  // Thay mảng này bằng link của bạn (mp4/webm/ogg hoặc YouTube link)
  const videoLinks = [
    'https://www.youtube.com/watch?si=wTOQlpOCn-CVYJHu&v=wiOmECm6kjI&feature=youtu.be',
    'https://youtu.be/wiOmECm6kjI?si=wTOQlpOCn-CVYJHu',
    'https://youtu.be/jdzhSu6dO24?si=y-AddEDQzsO8TVOh',
    'https://www.youtube.com/watch?si=y-AddEDQzsO8TVOh&v=jdzhSu6dO24&feature=youtu.be',
    'https://youtu.be/ANULMme_ecc?si=O4taKVTBnVC8MsmQ',
    'https://www.youtube.com/watch?si=O4taKVTBnVC8MsmQ&v=ANULMme_ecc&feature=youtu.be',
    'https://youtu.be/CKzsnAHcMYE?si=Au2jbXEQIXlNp9pZ',
    'https://www.youtube.com/watch?si=Au2jbXEQIXlNp9pZ&v=CKzsnAHcMYE&feature=youtu.be',
  ];

  const [selectedVideo, setSelectedVideo] = useState(null);

  // chuyển YouTube url sang dạng embed
  const toYouTubeEmbed = (url) => {
    if (!url) return null;
    const m = url.match(
      /(?:youtube(?:-nocookie)?\.com\/(?:watch\?.*v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
    );
    return m && m[1] ? `https://www.youtube.com/embed/${m[1]}?rel=0` : null;
  };

  const normalizeVideo = (url) => {
    if (!url) return null;
    const s = String(url).trim();
    if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(s)) return { kind: 'file', src: s };
    const yt = toYouTubeEmbed(s);
    if (yt) return { kind: 'youtube', src: yt };
    return { kind: 'iframe', src: s };
  };

  useEffect(() => {
    if (!videoLinks || videoLinks.length === 0) {
      setSelectedVideo(null);
      return;
    }
    const pick = videoLinks[Math.floor(Math.random() * videoLinks.length)];
    setSelectedVideo(pick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // chỉ chạy 1 lần khi mount

  const pickAnotherVideo = () => {
    if (!videoLinks || videoLinks.length <= 1) return;
    let next = videoLinks[Math.floor(Math.random() * videoLinks.length)];
    if (next === selectedVideo) {
      next = videoLinks[Math.floor(Math.random() * videoLinks.length)];
    }
    setSelectedVideo(next);
  };
  // ---- END VIDEO SETUP ----

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
      // build contents từ newMessages (không cần push trimmed nữa vì newMessages đã có)
      const contents = buildContentsFromMessages(newMessages, null); // sửa hàm để nếu currentUserText = null thì không append

      const payload = {
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

  // render normalized video
  const normalized = normalizeVideo(selectedVideo);

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
            <button onClick={setUserIdPrompt} className="text-sm px-3 py-1 border rounded">Đổi user</button>
            <button onClick={exportHistory} className="text-sm px-3 py-1 border rounded">Export</button>
            <label className="text-sm px-3 py-1 border rounded cursor-pointer">
              Import
              <input type="file" accept="application/json" onChange={importHistory} className="hidden" />
            </label>
            <button onClick={clearHistory} className="text-sm px-3 py-1 border rounded text-red-600">Clear</button>
          </div>
        </header>

        {/* --- VIDEO NGẪU NHIÊN: HIỂN THỊ NGAY DƯỚI HEADER --- */}
        {normalized && (
          <section className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="w-full aspect-video bg-black rounded-md overflow-hidden">
              {normalized.kind === 'file' && (
                <video
                  controls
                  src={normalized.src}
                  className="w-full h-full object-cover"
                  playsInline
                />
              )}

              {normalized.kind === 'youtube' && (
                <iframe
                  title="youtube-video"
                  src={normalized.src}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}

              {normalized.kind === 'iframe' && (
                <iframe
                  title="embed-video"
                  src={normalized.src}
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                />
              )}
            </div>
          </section>
        )}

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
          </div>
        </main>
      </div>
    </div>
  );
}
