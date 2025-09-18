// src/app/tin-tuc/[id]/layout.js
export default function ArticleLayout({ children }) {
  return (
    <div className="min-h-screen bg-green-50 py-12">
      <main className="max-w-5xl mx-auto px-4">
        {children}
      </main>
    </div>
  );
}
