import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth-token";

// Chặn ở tầng điều hướng: chưa đăng nhập thì về trang đăng nhập,
// đăng nhập rồi nhưng không phải admin thì về trang chủ.
// Đây chỉ là lớp thứ nhất — từng route /api/admin/* vẫn tự kiểm tra lại.
export async function middleware(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

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
  matcher: ["/admin/:path*"],
};
