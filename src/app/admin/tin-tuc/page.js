// File: src/components/AdminTinTuc.jsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useRouter } from "next/navigation";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// Quill toolbar + formats
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link", "image"],
    ["clean"],
  ],
};
const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "align",
  "link",
  "image",
];

export default function AdminTinTuc() {
  const router = useRouter();

  // form state
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");

  // cards
  const [cards, setCards] = useState([]);
  const cardTitleRef = useRef();
  const cardBulletsRef = useRef();

  // editor ref
  const quillRef = useRef(null);

  // admin list + delete
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoadingArticles(true);
      const res = await fetch("/api/articles");
      const data = await res.json();
      // API returns { items, total, ... } or an array
      const list = Array.isArray(data) ? data : data.items || [];
      setArticles(list);
    } catch (err) {
      console.error(err);
      alert("Lấy danh sách thất bại");
    } finally {
      setLoadingArticles(false);
    }
  };

  // ---------- cards logic ----------
  const addCard = () => {
    const t = cardTitleRef.current?.value?.trim();
    const bRaw = cardBulletsRef.current?.value || "";
    const bullets = bRaw
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);
    if (!t) return alert("Nhập tiêu đề card");
    setCards((p) => [...p, { id: Date.now(), title: t, bullets }]);
    if (cardTitleRef.current) cardTitleRef.current.value = "";
    if (cardBulletsRef.current) cardBulletsRef.current.value = "";
  };

  const removeCard = (id) => setCards((p) => p.filter((c) => c.id !== id));
  const clearCards = () => setCards([]);

  function escapeHtml(str) {
    return String(str || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  // generate cards HTML with data-* attributes (useful if you still want cards in content)
  const generateCardsHtml = () => {
    if (!cards || cards.length === 0) return "";
    return `
      <div data-cards="true">
        ${cards
          .map(
            (c, idx) => `
          <div data-card="true" data-card-index="${idx + 1}">
            <div data-card-header="true">
              <div data-card-num>${idx + 1}</div>
              <div data-card-title>${escapeHtml(c.title)}</div>
            </div>
            <ul>
              ${c.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}
            </ul>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  };

  // insert into quill at cursor
  const insertCardsIntoEditor = () => {
    const html = generateCardsHtml();
    if (!html) return alert("Chưa có card nào để chèn");

    const editor = quillRef.current?.getEditor();
    if (!editor) {
      setContent((prev) => prev + html);
      return;
    }

    const range = editor.getSelection(true) || { index: editor.getLength() };
    try {
      editor.clipboard.dangerouslyPasteHTML(range.index, html);
      editor.setSelection(range.index + 1);
      setTimeout(() => setContent(editor.root.innerHTML), 120);
    } catch (err) {
      console.error("Insert cards error:", err);
      alert("Không thể chèn cards vào editor");
    }
  };

  const appendCardsToContent = () => {
    const html = generateCardsHtml();
    if (!html) return alert("Chưa có card nào để chèn");
    setContent((prev) => prev + html);
  };

  // ---------- submit + delete ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert("Tiêu đề và nội dung là bắt buộc");
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, excerpt, content, image, category, readTime: "", cards }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        console.error("API error:", err);
        throw new Error("Lỗi khi tạo bài");
      }
      const created = await res.json();
      alert("Đăng bài thành công");
      setTitle("");
      setExcerpt("");
      setContent("");
      setImage("");
      clearCards();
      router.push(`/tin-tuc/${created.id}`);
    } catch (err) {
      console.error(err);
      alert("Đăng thất bại");
    }
  };

  const deleteArticle = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa bài này?")) return;
    try {
      setDeletingId(id);
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Xóa thất bại");
      setArticles((p) => p.filter((a) => String(a.id) !== String(id)));
      alert("Xóa thành công");
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý Tin Tức — Đăng mới</h1>

      <section className="mb-6">
        <h2 className="font-semibold mb-2">Danh sách bài (Admin)</h2>
        {loadingArticles ? (
          <div>Đang tải...</div>
        ) : (
          <div className="space-y-2">
            {articles.length === 0 && <div>Chưa có bài nào</div>}
            {articles.map((a) => (
              <div key={a.id} className="flex items-center gap-3 border p-3 rounded">
                <div className="flex-1">
                  <div className="font-medium">{a.title}</div>
                  <div className="text-sm text-gray-500">{a.excerpt}</div>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => router.push(`/admin/tin-tuc/edit/${a.id}`)} className="px-3 py-1 border rounded">
                    Sửa
                  </button>
                  <button type="button" onClick={() => deleteArticle(a.id)} className="px-3 py-1 bg-red-600 text-white rounded" disabled={String(deletingId) === String(a.id)}>
                    {String(deletingId) === String(a.id) ? "Đang xóa..." : "Xóa"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tiêu đề" className="w-full border rounded p-2" />
        <input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Tóm tắt (excerpt)" className="w-full border rounded p-2" />

        <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Link ảnh (ví dụ /images/xxx.jpg)" className="w-full border rounded p-2" />

        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Danh mục" className="w-full border rounded p-2" />

        <div>
          <label className="font-semibold">Nội dung</label>
          <div className="mt-2 mb-3 flex gap-2">
            <button type="button" onClick={insertCardsIntoEditor} className="px-3 py-1 bg-blue-600 text-white rounded">
              Chèn cards vào vị trí con trỏ
            </button>
            <button type="button" onClick={appendCardsToContent} className="px-3 py-1 border rounded">
              (Fallback) Chèn cards vào cuối nội dung
            </button>
          </div>

          <ReactQuill ref={quillRef} theme="snow" value={content} onChange={(v) => setContent(v)} modules={quillModules} formats={quillFormats} />
        </div>

        <div className="mt-4 border p-3 rounded bg-white">
          <h3 className="font-semibold mb-2">Tạo bộ thẻ (cards)</h3>
          <input ref={cardTitleRef} placeholder="Tiêu đề card" className="w-full border rounded p-2 mb-2" />
          <textarea ref={cardBulletsRef} placeholder="Mỗi dòng 1 bullet" className="w-full border rounded p-2 mb-2" rows={4} />

          <div className="flex gap-2">
            <button type="button" onClick={addCard} className="bg-green-600 text-white px-3 py-1 rounded">
              Thêm card
            </button>
            <button type="button" onClick={insertCardsIntoEditor} className="bg-blue-600 text-white px-3 py-1 rounded">
              Chèn cards vào editor
            </button>
            <button type="button" onClick={() => { if(confirm('Xoá tất cả card preview?')) clearCards(); }} className="px-3 py-1 border rounded">
              Xoá tất cả
            </button>
          </div>

          <div className="mt-3">
            <h4 className="font-medium">Preview cards</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {cards.map((c, i) => (
                <div key={c.id} className="border p-3 rounded bg-green-50">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">{i + 1}</div>
                    <div className="font-semibold text-green-700">{c.title}</div>
                    <button type="button" onClick={() => removeCard(c.id)} className="ml-auto text-red-600">
                      Xóa
                    </button>
                  </div>
                  <ul className="mt-2 list-disc ml-6 text-sm">{c.bullets.map((b, idx) => <li key={idx}>{b}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">
            Đăng bài
          </button>
        </div>
      </form>
    </div>
  );
}
