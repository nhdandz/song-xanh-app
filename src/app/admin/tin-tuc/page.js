"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, NewspaperIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

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
      // API returns { ok, data, meta } format
      const list = data.ok ? data.data : (Array.isArray(data) ? data : data.items || []);
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
      const response = await res.json();
      const created = response.ok ? response.data : response;
      alert("Đăng bài thành công");
      setTitle("");
      setExcerpt("");
      setContent("");
      setImage("");
      setCategory("");
      clearCards();
      fetchArticles(); // Refresh list
      // router.push(`/tin-tuc/${created.id}`);
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
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link href="/admin" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Quay lại Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <NewspaperIcon className="w-10 h-10 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý Tin Tức</h1>
            <p className="text-gray-600 mt-1">Tạo, chỉnh sửa và xóa bài viết</p>
          </div>
        </div>
      </div>

      <section className="mb-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Danh sách bài viết ({articles.length})</h2>
        {loadingArticles ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Đang tải...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {articles.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <NewspaperIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                Chưa có bài viết nào
              </div>
            )}
            {articles.map((a) => (
              <div key={a.id} className="flex items-center gap-4 border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                {a.image && (
                  <img src={a.image} alt={a.title} className="w-20 h-20 object-cover rounded" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate">{a.title}</div>
                  <div className="text-sm text-gray-500 line-clamp-2">{a.excerpt || "Không có tóm tắt"}</div>
                  <div className="flex gap-2 mt-1">
                    {a.category && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{a.category}</span>
                    )}
                    <span className="text-xs text-gray-400">
                      {new Date(a.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => router.push(`/admin/tin-tuc/edit/${a.id}`)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <PencilIcon className="w-4 h-4 mr-1" />
                    Sửa
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteArticle(a.id)}
                    className="inline-flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    disabled={String(deletingId) === String(a.id)}
                  >
                    <TrashIcon className="w-4 h-4 mr-1" />
                    {String(deletingId) === String(a.id) ? "Đang xóa..." : "Xóa"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Tạo bài viết mới</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề bài viết"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tóm tắt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Nhập tóm tắt ngắn gọn về bài viết"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Link ảnh đại diện</label>
              <input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="/images/article.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Môi trường, Tái chế, ..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung bài viết *</label>
            <div className="mb-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={insertCardsIntoEditor}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Chèn cards vào vị trí con trỏ
              </button>
              <button
                type="button"
                onClick={appendCardsToContent}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Chèn cards vào cuối nội dung
              </button>
            </div>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={content}
                onChange={(v) => setContent(v)}
                modules={quillModules}
                formats={quillFormats}
                className="bg-white"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tạo bộ thẻ thông tin (Cards)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề card</label>
                <input
                  ref={cardTitleRef}
                  placeholder="Ví dụ: Lợi ích của tái chế"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung (mỗi dòng một bullet point)</label>
                <textarea
                  ref={cardBulletsRef}
                  placeholder="Giảm lượng rác thải&#10;Tiết kiệm tài nguyên thiên nhiên&#10;Bảo vệ môi trường"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={4}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={addCard}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Thêm card
                </button>
                <button
                  type="button"
                  onClick={insertCardsIntoEditor}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Chèn tất cả cards vào editor
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Xoá tất cả card preview?")) clearCards();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Xoá tất cả
                </button>
              </div>

              {cards.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Preview Cards ({cards.length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cards.map((c, i) => (
                      <div key={c.id} className="border-2 border-green-200 p-4 rounded-lg bg-green-50">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                            {i + 1}
                          </div>
                          <div className="flex-1 font-semibold text-green-900">{c.title}</div>
                          <button
                            type="button"
                            onClick={() => removeCard(c.id)}
                            className="text-red-600 hover:text-red-800 font-medium text-sm"
                          >
                            Xóa
                          </button>
                        </div>
                        <ul className="space-y-1 ml-11">
                          {c.bullets.map((b, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start">
                              <span className="text-green-600 mr-2">•</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t">
            <button
              type="submit"
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-lg"
            >
              Đăng bài viết
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm("Bạn có chắc muốn xóa tất cả và làm mới?")) {
                  setTitle("");
                  setExcerpt("");
                  setContent("");
                  setImage("");
                  setCategory("");
                  clearCards();
                }
              }}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Làm mới
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
