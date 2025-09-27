// // File: src/app/tin-tuc/[id]/page.jsx
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import DOMPurify from "isomorphic-dompurify";

// export default function ArticleDetail() {
//   const params = useParams();
//   const id = params?.id;
//   const router = useRouter();

//   const [article, setArticle] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) return;
//     (async () => {
//       try {
//         const res = await fetch(`/api/articles/${id}`);
//         if (!res.ok) throw new Error("Không tìm thấy");
//         const data = await res.json();
//         setArticle(data);
//       } catch (err) {
//         console.error(err);
//         router.replace("/tin-tuc");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [id, router]);

//   // remove inline width/height and width declarations in style
//   const normalizeRaw = (raw = "") => {
//     raw = raw.replace(/\s*(width|height)=["']?\d+%?["']?/gi, "");
//     raw = raw.replace(/style=["']([^"']*?)["']/gi, (m, inner) => {
//       const cleaned = inner.replace(/(?:^|;)\s*width\s*:\s*[^;]+;?/gi, "").trim();
//       if (!cleaned) return "";
//       return `style="${cleaned}"`;
//     });
//     return raw;
//   };

//   // sanitize article.content for safe rendering
//   const sanitizedHtml = useMemo(() => {
//     if (!article?.content) return "";
//     const raw = normalizeRaw(article.content || "");
//     return DOMPurify.sanitize(raw, {
//       ALLOWED_TAGS: [
//         "p","br","strong","b","em","i","u","h1","h2","h3","h4",
//         "ul","ol","li","a","img","blockquote","code","pre","div","span"
//       ],
//       ALLOWED_ATTR: ["href","src","alt","title","target","rel","class","data-*"]
//     });
//   }, [article?.content]);

//   // Safely extract cards array (article.cards may be Array, JSON string, or null)
//   const getCards = () => {
//     if (!article) return null;
//     const raw = article.cards;
//     if (!raw) return null;
//     if (Array.isArray(raw)) return raw;
//     try {
//       return typeof raw === "string" ? JSON.parse(raw) : raw;
//     } catch (err) {
//       console.warn("Cannot parse article.cards:", err);
//       return null;
//     }
//   };

//   // Card renderer component
//   function RenderCards({ cards }) {
//     if (!cards || !Array.isArray(cards) || cards.length === 0) return null;
//     return (
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18, margin: "12px 0" }}>
//         {cards.map((c, idx) => (
//           <div
//             key={idx}
//             style={{
//               border: "1px solid #d8f0e6",
//               background: "#f7fff9",
//               padding: 18,
//               borderRadius: 10,
//               boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
//             }}
//           >
//             <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
//               <div
//                 style={{
//                   width: 34,
//                   height: 34,
//                   borderRadius: "50%",
//                   background: "#0b9d4f",
//                   color: "#fff",
//                   display: "inline-flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontWeight: 700,
//                 }}
//               >
//                 {idx + 1}
//               </div>
//               <div style={{ fontWeight: 700, color: "#0f7b44" }}>{c.title}</div>
//             </div>

//             <ul style={{ margin: "8px 0 0 18px", color: "#214e37", paddingLeft: 0 }}>
//               {Array.isArray(c.bullets)
//                 ? c.bullets.map((b, i) => (
//                     <li key={i} style={{ marginBottom: 6 }}>
//                       {b}
//                     </li>
//                   ))
//                 : null}
//             </ul>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (loading) return <div className="p-6">Đang tải...</div>;
//   if (!article) return null;

//   const cards = getCards();

//   return (
//     <div style={{ maxWidth: 800, margin: "0 auto", padding: "1.5rem" }}>
//       <Link href="/tin-tuc" className="text-green-600 mb-4 inline-block">
//         ← Quay lại
//       </Link>

//       <h1 style={{ fontSize: "1.9rem", fontWeight: 700, color: "#0f7b44", marginBottom: 8 }}>{article.title}</h1>

//       <div style={{ fontSize: "0.9rem", color: "#6b7280", marginBottom: 16 }}>
//         {article.createdAt ? new Date(article.createdAt).toLocaleString("vi-VN") : ""}
//         {" • "}
//         {article.readTime ?? ""}
//       </div>

//       {article.image && (
//         <img
//           src={article.image}
//           alt={article.title}
//           loading="lazy"
//           style={{ width: "100%", borderRadius: 8, marginBottom: 18, maxHeight: 480, objectFit: "cover" }}
//         />
//       )}

//       {/* If cards JSON exists, render them first */}
//       {cards && <RenderCards cards={cards} />}

//       {/* Then render sanitized HTML content */}
//       {sanitizedHtml ? (
//         <div
//           style={{ lineHeight: 1.7, fontSize: 16, color: "#0f2d1f" }}
//           dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
//         />
//       ) : null}
//     </div>
//   );
// }

// File: src/app/tin-tuc/[id]/page.jsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
// import css của Quill để nội dung trông giống admin (admin import quill.snow.css)
import "react-quill-new/dist/quill.snow.css";

export default function ArticleDetail() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/articles/${id}`);
        if (!res.ok) throw new Error("Không tìm thấy");
        const data = await res.json();
        setArticle(data);
      } catch (err) {
        console.error(err);
        router.replace("/tin-tuc");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  // --- normalize raw HTML: loại bỏ chỉ width/height nhưng giữ các style khác ---
  const normalizeRaw = (raw = "") => {
    raw = String(raw || "");
    // remove width/height attributes like width="600" width='50%'
    raw = raw.replace(/\s*(width|height)=["']?\d+%?["']?/gi, "");
    // remove only width declarations inside style attr, keep other style rules
    raw = raw.replace(/style=["']([^"']*?)["']/gi, (m, inner) => {
      const cleaned = inner.replace(/(?:^|;)\s*width\s*:\s*[^;]+;?/gi, "").trim();
      if (!cleaned) return "";
      return `style="${cleaned}"`;
    });
    return raw;
  };

  // --- Configure DOMPurify: cho phép data-* và style ---
  // (Chạy trên client; safe vì file này là "use client")
  if (typeof window !== "undefined" && DOMPurify && !DOMPurify.__v_custom_hook_added) {
    try {
      DOMPurify.addHook("uponSanitizeAttribute", (node, data) => {
        // cho phép tất cả data-* attrs
        if (data.attrName && data.attrName.startsWith("data-")) {
          data.allowed = true;
        }
        // cho phép style attr (một số trình sanitize có thể cần đánh dấu explicitly)
        if (data.attrName === "style") {
          data.allowed = true;
        }
      });
      // mark so we don't add hook multiple times
      DOMPurify.__v_custom_hook_added = true;
    } catch (err) {
      console.warn("DOMPurify hook error:", err);
    }
  }

  // --- sanitize và tách cards nếu có ---
  const { sanitizedHtml, parsedCards, contentWithoutCards } = useMemo(() => {
    if (!article?.content) return { sanitizedHtml: "", parsedCards: null, contentWithoutCards: "" };

    const raw = normalizeRaw(article.content || "");

    const sanitized = DOMPurify.sanitize(raw, {
      ALLOWED_TAGS: [
        "p","br","strong","b","em","i","u","h1","h2","h3","h4",
        "ul","ol","li","a","img","blockquote","code","pre","div","span","figure","figcaption"
      ],
      ALLOWED_ATTR: ["href","src","alt","title","target","rel","class","style","loading","width","height","data-*"]
    });

    // parse cards from sanitized HTML (fallback if article.cards not present)
    let cards = null;
    let contentNoCards = sanitized;

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(sanitized, "text/html");

      // tìm container data-cards="true"
      const container = doc.querySelector('[data-cards="true"]');
      if (container) {
        const cardNodes = Array.from(container.querySelectorAll('[data-card="true"]'));
        if (cardNodes.length) {
          cards = cardNodes.map((node, idx) => {
            // tìm title trong node: ưu tiên [data-card-title], fallback first div
            const titleEl = node.querySelector('[data-card-title]') || node.querySelector('div');
            const title = titleEl ? titleEl.textContent.trim() : `Card ${idx + 1}`;
            const bullets = Array.from(node.querySelectorAll('li')).map(li => li.textContent.trim());
            return { title, bullets };
          });
        }
        // loại bỏ phần container khỏi nội dung để tránh hiển thị 2 lần
        container.remove();
        contentNoCards = doc.body.innerHTML;
      }
    } catch (err) {
      console.warn("parseCardsFromHtml error:", err);
    }

    return { sanitizedHtml: sanitized, parsedCards: cards, contentWithoutCards: contentNoCards };
  }, [article?.content]);

  // --- getCards: ưu tiên article.cards nếu server trả array ---
  const getCards = () => {
    if (!article) return null;
    const raw = article.cards;
    if (!raw) {
      // fallback: parsedCards từ content
      return parsedCards;
    }
    if (Array.isArray(raw)) return raw;
    // nếu server trả string JSON
    try {
      return JSON.parse(raw);
    } catch (err) {
      // fallback dùng parsedCards
      return parsedCards;
    }
  };

  // --- RenderCards giống style admin ---
  function RenderCards({ cards }) {
    if (!cards || !Array.isArray(cards) || cards.length === 0) return null;
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18, margin: "12px 0" }}>
        {cards.map((c, idx) => (
          <div
            key={idx}
            style={{
              border: "1px solid #d8f0e6",
              background: "#f7fff9",
              padding: 18,
              borderRadius: 10,
              boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "#0b9d4f",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                }}
              >
                {idx + 1}
              </div>
              <div style={{ fontWeight: 700, color: "#0f7b44" }}>{c.title}</div>
            </div>

            <ul style={{ margin: "8px 0 0 18px", color: "#214e37", paddingLeft: 0 }}>
              {Array.isArray(c.bullets)
                ? c.bullets.map((b, i) => (
                    <li key={i} style={{ marginBottom: 6 }}>
                      {b}
                    </li>
                  ))
                : null}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  // small debug (bật khi cần)
  useEffect(() => {
    if (article) {
      // console.log("DEBUG article:", article);
      // console.log("DEBUG sanitizedHtml:", sanitizedHtml);
      // console.log("DEBUG parsedCards:", parsedCards);
    }
  }, [article, sanitizedHtml, parsedCards]);

  if (loading) return <div className="p-6">Đang tải...</div>;
  if (!article) return null;

  const cards = getCards();

  return (
    <div style={{ maxWidth: 840, margin: "0 auto", padding: "1.5rem" }}>
      <Link href="/tin-tuc" className="text-green-600 mb-4 inline-block">
        ← Quay lại
      </Link>

      <h1 style={{ fontSize: "1.9rem", fontWeight: 700, color: "#0f7b44", marginBottom: 8 }}>{article.title}</h1>

      <div style={{ fontSize: "0.9rem", color: "#6b7280", marginBottom: 16 }}>
        {article.createdAt ? new Date(article.createdAt).toLocaleString("vi-VN") : ""}
        {" • "}
        {article.readTime ?? ""}
      </div>

      {article.image && (
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          style={{ width: "100%", borderRadius: 8, marginBottom: 18, maxHeight: 480, objectFit: "cover" }}
        />
      )}

      {/* Nếu có cards (từ article.cards hoặc parse từ content) thì render bằng component */}
      {cards && <RenderCards cards={cards} />}

      {/* Hiển thị phần nội dung còn lại (đã sanitize và đã remove phần cards nếu được parse) */}
      {contentWithoutCards ? (
        <div
          className="ql-editor" // dùng class ql-editor để hưởng style của quill.snow.css
          style={{ lineHeight: 1.7, fontSize: 16, color: "#0f2d1f" }}
          dangerouslySetInnerHTML={{ __html: contentWithoutCards }}
        />
      ) : sanitizedHtml ? (
        <div
          className="ql-editor"
          style={{ lineHeight: 1.7, fontSize: 16, color: "#0f2d1f" }}
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      ) : null}
    </div>
  );
}
