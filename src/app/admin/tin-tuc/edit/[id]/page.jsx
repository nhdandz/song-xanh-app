// File: src/app/admin/tin-tuc/edit/[id]/page.jsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useRouter, useParams } from "next/navigation";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const quillModules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ["blockquote", "code-block"],
      ["link", "image"],
      ["clean"],
    ],
  },
};
const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "align",
  "color",
  "background",
  "blockquote",
  "code-block",
  "link",
  "image",
];

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const quillRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/articles/${id}`);
        if (!res.ok) throw new Error("Không thể lấy bài");
        const data = await res.json();
        if (!mounted) return;
        setTitle(data.title || "");
        setExcerpt(data.excerpt || "");
        setContent(data.content || "");
        setImage(data.image || "");
      } catch (err) {
        console.error(err);
        alert("Lỗi khi tải bài");
        router.push("/admin/tin-tuc");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, [id, router]);

  const isValidImageUrl = (url) => {
    if (!url) return false;
    try {
      const u = new URL(url, typeof window !== "undefined" ? window.location.origin : "http://localhost");
      return /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(u.pathname);
    } catch {
      return false;
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert("Tiêu đề và nội dung là bắt buộc");
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, excerpt, content, image }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        console.error("Update error:", err);
        throw new Error("Cập nhật thất bại");
      }
      const updated = await res.json();
      alert("Cập nhật thành công");
      router.push(`/tin-tuc/${updated.id}`);
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bạn chắc chắn muốn xoá bài này?")) return;

    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });

      if (!res.ok) {
        // cố gắng lấy body lỗi nếu có
        const errBody = await res.json().catch(() => null);
        console.error("Delete error:", errBody);

        if (res.status === 404) {
          alert("Bài không tồn tại");
          router.push("/admin/tin-tuc");
          return;
        }

        throw new Error("Xóa thất bại");
      }

      alert("Đã xoá");
      router.push("/admin/tin-tuc");
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại");
    }
  };

  if (loading) return <div className="p-6">Đang tải...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Sửa bài viết</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tiêu đề" className="w-full border rounded p-2" />
        <input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Tóm tắt (excerpt)" className="w-full border rounded p-2" />

        <div>
          <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Link ảnh tiêu đề" className="w-full border rounded p-2" />
          <div className="mt-2">
            {image ? (
              isValidImageUrl(image) ? (
                <img src={image} alt="preview" className="w-full max-h-48 object-cover rounded" />
              ) : (
                <div className="text-sm text-yellow-600">Link không phải file ảnh hợp lệ — vẫn sẽ lưu nhưng có thể không hiển thị.</div>
              )
            ) : (
              <div className="text-sm text-gray-500">Chưa có ảnh cover.</div>
            )}
          </div>
        </div>

        <div>
          <label className="font-semibold">Nội dung</label>
          <div className="mt-2 mb-3">
            <ReactQuill ref={quillRef} theme="snow" value={content} onChange={(value) => setContent(value)} modules={quillModules} formats={quillFormats} />
          </div>
        </div>

        <div className="flex gap-2">
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">
            Lưu
          </button>
          <button type="button" onClick={() => router.push("/admin/tin-tuc")} className="px-4 py-2 border rounded">
            Huỷ
          </button>
          <button type="button" onClick={handleDelete} className="ml-auto text-red-600 px-3 py-2 border rounded">
            Xoá
          </button>
        </div>
      </form>
    </div>
  );
}
