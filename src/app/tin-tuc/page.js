// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";

// export default function TinTucList() {
//   const [articles, setArticles] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await fetch("/api/articles");
//         const data = await res.json();
//         // nếu API trả array
//         setArticles(Array.isArray(data) ? data : data.items ?? []);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   if (loading) return <div className="p-6">Đang tải...</div>;
//   if (articles.length === 0) return <div className="p-6">Chưa có bài viết.</div>;

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <h1 className="text-3xl font-bold text-green-800 mb-4">Tin tức & Bài viết</h1>
//       <div className="grid gap-6">
//         {articles.map((a) => (
//           <div key={a.id} className="bg-white rounded-lg shadow-md overflow-hidden">
//             {a.image && <img src={a.image} alt={a.title} className="w-full h-56 object-cover" />}
//             <div className="p-4">
//               <h2 className="text-2xl font-semibold text-green-800 mb-2">{a.title}</h2>
//               <p className="text-gray-600 mb-3">{a.excerpt ?? (a.content?.slice(0, 140) + "...")}</p>
//               <div className="flex justify-between items-center">
//                 <Link href={`/tin-tuc/${a.id}`} className="text-green-600 font-medium">Đọc tiếp</Link>
//                 <span className="text-sm text-gray-400">{a.readTime ?? ""}</span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TinTucList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6); // số bài mỗi trang
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/articles?page=${page}&pageSize=${pageSize}`);
        const data = await res.json();

        if (data && data.items) {
          setArticles(data.items);
          setTotalPages(data.totalPages || 1);
        } else {
          setArticles([]);
        }
      } catch (err) {
        console.error(err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [page, pageSize]);

  if (loading) return <div className="p-6">Đang tải...</div>;
  if (articles.length === 0) return <div className="p-6">Chưa có bài viết.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-800 mb-6">Tin tức & Bài viết</h1>

      {/* Danh sách bài viết */}
      <div className="grid gap-6">
        {articles.map((a) => (
          <div key={a.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {a.image && (
              <img
                src={a.image}
                alt={a.title}
                className="w-full h-56 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-2xl font-semibold text-green-800 mb-2">
                {a.title}
              </h2>
              <p className="text-gray-600 mb-3">
                {a.excerpt ?? (a.content?.slice(0, 140) + "...")}
              </p>
              <div className="flex justify-between items-center">
                <Link
                  href={`/tin-tuc/${a.id}`}
                  className="text-green-600 font-medium"
                >
                  Đọc tiếp
                </Link>
                <span className="text-sm text-gray-400">
                  {a.readTime ?? ""}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Phân trang */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          ← Trước
        </button>

        <span className="text-gray-700">
          Trang {page} / {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          Sau →
        </button>
      </div>
    </div>
  );
}
