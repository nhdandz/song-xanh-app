import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>Chào mừng bạn đến trang quản trị.</p>

      <Link
        href="/admin/tin-tuc"
        className="text-blue-600 underline hover:text-blue-800"
      >
        → Quản lý Tin tức
      </Link>
    </div>
  );
}
