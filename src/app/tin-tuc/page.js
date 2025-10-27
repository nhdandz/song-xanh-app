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

        if (data.ok && data.data) {
          setArticles(data.data);
          setTotalPages(data.meta?.totalPages || 1);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Tin tức & Bài viết
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá những thông tin hữu ích về môi trường, tái chế và lối sống xanh
          </p>
        </div>

        {/* Empty state */}
        {articles.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Chưa có bài viết nào</h3>
            <p className="text-gray-600">Hãy quay lại sau để đọc những bài viết mới nhất!</p>
          </div>
        ) : (
          <>
            {/* Articles List - Horizontal Layout */}
            <div className="space-y-6 mb-6">
              {articles.map((a) => (
                <Link
                  key={a.id}
                  href={`/tin-tuc/${a.id}`}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row md:h-56"
                >
                  {/* Image - Left side on desktop */}
                  {a.image ? (
                    <div className="relative h-48 md:h-full md:w-48 flex-shrink-0 overflow-hidden bg-gray-200">
                      <img
                        src={a.image}
                        alt={a.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {a.category && (
                        <div className="absolute top-3 right-3">
                          <span className="inline-block bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                            {a.category}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative h-48 md:h-full md:w-48 flex-shrink-0 bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                      <svg className="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                      {a.category && (
                        <div className="absolute top-3 right-3">
                          <span className="inline-block bg-white text-green-600 text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                            {a.category}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Content - Right side on desktop */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                        {a.title}
                      </h2>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {a.excerpt || (a.content?.replace(/<[^>]*>/g, '').slice(0, 120) + "...")}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-4 mt-2 border-t border-gray-100">
                      <span className="text-green-600 font-semibold flex items-center gap-2">
                        Đọc tiếp
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                      {(a.readTime || a.createdAt) && (
                        <span className="text-gray-400 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {a.readTime || new Date(a.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-6 py-3 bg-white text-green-600 font-semibold rounded-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-50 transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Trang trước
                </button>

                <div className="bg-white px-6 py-3 rounded-lg shadow-lg">
                  <span className="text-gray-700 font-semibold">
                    Trang <span className="text-green-600">{page}</span> / {totalPages}
                  </span>
                </div>

                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-all duration-200 flex items-center gap-2"
                >
                  Trang sau
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
