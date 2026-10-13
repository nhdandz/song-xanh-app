// Import theo nhánh hẹp thay vì "jose": bản gốc kéo theo cả nhánh JWE,
// vốn dùng CompressionStream và không chạy được trong Edge Runtime.
// Ở đây chỉ cần ký/verify JWS nên hai module này là đủ.
import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";

// File này chạy được cả trong middleware (edge runtime) nên tuyệt đối
// không import bcryptjs, prisma hay next/headers ở đây.

export const SESSION_COOKIE = "session";
export const SESSION_MAX_AGE = 8 * 60 * 60; // giây

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET chưa được cấu hình trong biến môi trường");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken({ id, role }) {
  return new SignJWT({ role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

// Trả về { id, role } nếu token hợp lệ, null nếu sai chữ ký / hết hạn / không có.
export async function verifySessionToken(token) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    });
    if (!payload.sub || !payload.role) return null;
    return { id: payload.sub, role: payload.role };
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}
