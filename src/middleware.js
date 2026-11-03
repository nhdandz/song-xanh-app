import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth-token";

// Những trang đã ẩn khỏi phần người dùng. Giữ nguyên code và dữ liệu,
// chỉ chặn truy cập bằng đường dẫn để học sinh chỉ còn thấy 3 nội dung
// chính: Hành động, Quét sản phẩm, Trò chơi.
// Danh sách này phải khớp với HIDDEN_USER_PATHS trong src/lib/app-config.js
// (viết lại ở đây vì matcher của middleware phải là hằng số tĩnh).
const HIDDEN_USER_PATHS = [
  "/thong-ke",
  "/thach-thuc",
  "/so-sanh",
  "/huy-hieu",
  "/tin-tuc",
  "/ban-do",
  "/du-an",
  "/bao-cao",
  "/tiet-kiem",
  "/y-tuong",
  "/chat-bot",
  "/doi-qua",
  "/cai-dat",
];

function laTrangDaAn(pathname) {
  return HIDDEN_USER_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

// Chặn ở tầng điều hướng: chưa đăng nhập thì về trang đăng nhập,
// đăng nhập rồi nhưng không phải admin thì về trang chủ.
// Đây chỉ là lớp thứ nhất — từng route /api/admin/* vẫn tự kiểm tra lại.
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  // Trang đã ẩn: người dùng thường bị đưa về trang chủ.
  // Admin vẫn xem được vì đây là nội dung họ quản lý.
  if (laTrangDaAn(pathname)) {
    if (session?.role === "ADMIN") {
      return NextResponse.next();
    }

    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/dang-nhap";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (session.role !== "ADMIN") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/thong-ke",
    "/thach-thuc",
    "/so-sanh",
    "/huy-hieu",
    "/tin-tuc",
    "/tin-tuc/:path*",
    "/ban-do",
    "/du-an",
    "/bao-cao",
    "/tiet-kiem",
    "/y-tuong",
    "/chat-bot",
    "/doi-qua",
    "/cai-dat",
  ],
};
