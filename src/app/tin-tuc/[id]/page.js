// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import DOMPurify from "isomorphic-dompurify";
// import parse, { domToReact } from "html-react-parser";

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

//   // small sanitizer-normalizer to remove dangerous inline widths
//   const normalizeRaw = (raw = "") => {
//     // remove width/height attributes like width="600" height="400"
//     raw = raw.replace(/\s*(width|height)=["']?\d+%?["']?/gi, "");
//     // remove style width declarations but keep other styles
//     raw = raw.replace(/style=["']([^"']*?)["']/gi, (m, inner) => {
//       const cleaned = inner.replace(/(?:^|;)\s*width\s*:\s*[^;]+;?/gi, "").trim();
//       if (!cleaned) return "";
//       return `style="${cleaned}"`;
//     });
//     return raw;
//   };

//   // sanitize, allow data-* and class
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

//   // inline styles used only in this component (adjust as you like)
//   const S = {
//     container: { maxWidth: 800, margin: "0 auto" },
//     title: { fontSize: "1.9rem", fontWeight: 700, color: "#0f7b44", marginBottom: 8 },
//     meta: { fontSize: "0.9rem", color: "#6b7280", marginBottom: 16 },
//     featureImg: { width: "100%", borderRadius: 8, marginBottom: 18, maxHeight: 480, objectFit: "cover" },
//     p: { margin: "0.6rem 0", lineHeight: 1.7, fontSize: 16, color: "#0f2d1f" },
//     h1: { fontSize: 28, margin: "1rem 0 0.6rem" },
//     h2: { fontSize: 22, margin: "0.9rem 0 0.5rem" },
//     ul: { margin: "0.6rem 0 0.6rem 1.2rem" },
//     img: { maxWidth: "100%", display: "block", margin: "1rem auto", borderRadius: 8, objectFit: "cover" },
//     // card styles:
//     cardsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18, margin: "12px 0" },
//     card: { border: "1px solid #d8f0e6", background: "#f7fff9", padding: 16, borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.03)" },
//     cardHeader: { display: "flex", alignItems: "center", gap: 12, marginBottom: 8 },
//     badge: { width: 34, height: 34, borderRadius: "50%", background: "#0b9d4f", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700 },
//     cardTitle: { fontWeight: 700, color: "#0f7b44" },
//     cardList: { margin: "8px 0 0 18px", color: "#214e37" },
//     li: { marginBottom: 6, lineHeight: 1.45 },
//   };

//   // parse & transform into React elements with inline styles (cards & images transformed)
//   const contentNode = useMemo(() => {
//     if (!sanitizedHtml) return null;

//     const options = {
//       replace: (node) => {
//         if (!node || node.type !== "tag") return;

//         // images -> normalized <img />
//         if (node.name === "img") {
//           const src = node.attribs?.src || "";
//           const alt = node.attribs?.alt || "";
//           return <img src={src} alt={alt} loading="lazy" style={S.img} />;
//         }

//         // detect cards grid by data attribute or class
//         const classAttr = (node.attribs && node.attribs.class) || "";
//         const isCardsGrid = (node.attribs && (node.attribs["data-cards"] === "true")) || /\b(cards-grid|sx-cards)\b/.test(classAttr);
//         if (node.name === "div" && isCardsGrid) {
//           return <div style={S.cardsGrid}>{domToReact(node.children, options)}</div>;
//         }

//         // detect single card
//         const isCard = (node.attribs && node.attribs["data-card"] === "true") || /\b(card-item|sx-card)\b/.test(classAttr);
//         if (node.name === "div" && isCard) {
//           return <div style={S.card}>{domToReact(node.children, options)}</div>;
//         }

//         // card header
//         if (node.name === "div" && (node.attribs && node.attribs["data-card-header"] === "true" || /\b(card-number|sx-card-header)\b/.test(classAttr))) {
//           return <div style={S.cardHeader}>{domToReact(node.children, options)}</div>;
//         }

//         // badge/number
//         if (node.name === "div" && (node.attribs && (node.attribs["data-card-num"] || node.attribs["data-card-index"])) ) {
//           return <div style={S.badge}>{domToReact(node.children, options)}</div>;
//         }

//         // card title (if data attribute or class)
//         if ((node.name === "div" || node.name === "h4" || node.name === "strong" || node.name === "span") &&
//             (node.attribs && node.attribs["data-card-title"] === "true" || /\b(sx-card-title|title|card-title)\b/.test(classAttr))) {
//           return <div style={S.cardTitle}>{domToReact(node.children, options)}</div>;
//         }

//         // lists inside cards: style li
//         if (node.name === "ul" && (node.parent && (node.parent.attribs && (node.parent.attribs["data-card"] === "true" || (node.parent.attribs.class||"").includes("card-item"))))) {
//           return <ul style={S.cardList}>{domToReact(node.children, options)}</ul>;
//         }

//         if (node.name === "li") {
//           return <li style={S.li}>{domToReact(node.children, options)}</li>;
//         }

//         // headings & paragraphs (non-card) -> apply inline styles so look nice without global CSS
//         if (node.name === "p") return <p style={S.p}>{domToReact(node.children, options)}</p>;
//         if (node.name === "h1") return <h1 style={S.h1}>{domToReact(node.children, options)}</h1>;
//         if (node.name === "h2") return <h2 style={S.h2}>{domToReact(node.children, options)}</h2>;
//         if (node.name === "ul") return <ul style={S.ul}>{domToReact(node.children, options)}</ul>;
//         if (node.name === "ol") return <ol style={S.ul}>{domToReact(node.children, options)}</ol>;

//         // otherwise keep default (let parser output original elements)
//         return undefined;
//       }
//     };

//     return parse(sanitizedHtml, options);
//   }, [sanitizedHtml]);

//   if (loading) return <div className="p-6">Đang tải...</div>;
//   if (!article) return null;

//   return (
//     <div style={S.container}>
//       <Link href="/tin-tuc" className="text-green-600 mb-4 inline-block">← Quay lại</Link>

//       <h1 style={S.title}>{article.title}</h1>
//       <div style={S.meta}>
//         {article.createdAt ? new Date(article.createdAt).toLocaleString("vi-VN") : ""}
//         {" • "}{article.readTime ?? ""}
//       </div>

//       {article.image && <img src={article.image} alt={article.title} loading="lazy" style={S.featureImg} />}

//       <div>
//         {/* Render the parsed & transformed content */}
//         {contentNode}
//       </div>
//     </div>
//   );
// }

// File: src/app/tin-tuc/[id]/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";

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

  // remove inline width/height and width declarations in style
  const normalizeRaw = (raw = "") => {
    raw = raw.replace(/\s*(width|height)=["']?\d+%?["']?/gi, "");
    raw = raw.replace(/style=["']([^"']*?)["']/gi, (m, inner) => {
      const cleaned = inner.replace(/(?:^|;)\s*width\s*:\s*[^;]+;?/gi, "").trim();
      if (!cleaned) return "";
      return `style="${cleaned}"`;
    });
    return raw;
  };

  // sanitize article.content for safe rendering
  const sanitizedHtml = useMemo(() => {
    if (!article?.content) return "";
    const raw = normalizeRaw(article.content || "");
    return DOMPurify.sanitize(raw, {
      ALLOWED_TAGS: [
        "p","br","strong","b","em","i","u","h1","h2","h3","h4",
        "ul","ol","li","a","img","blockquote","code","pre","div","span"
      ],
      ALLOWED_ATTR: ["href","src","alt","title","target","rel","class","data-*"]
    });
  }, [article?.content]);

  // Safely extract cards array (article.cards may be Array, JSON string, or null)
  const getCards = () => {
    if (!article) return null;
    const raw = article.cards;
    if (!raw) return null;
    if (Array.isArray(raw)) return raw;
    try {
      return typeof raw === "string" ? JSON.parse(raw) : raw;
    } catch (err) {
      console.warn("Cannot parse article.cards:", err);
      return null;
    }
  };

  // Card renderer component
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

  if (loading) return <div className="p-6">Đang tải...</div>;
  if (!article) return null;

  const cards = getCards();

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "1.5rem" }}>
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

      {/* If cards JSON exists, render them first */}
      {cards && <RenderCards cards={cards} />}

      {/* Then render sanitized HTML content */}
      {sanitizedHtml ? (
        <div
          style={{ lineHeight: 1.7, fontSize: 16, color: "#0f2d1f" }}
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      ) : null}
    </div>
  );
}
