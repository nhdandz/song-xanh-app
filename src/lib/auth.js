import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth-token";

// Dùng trong route handler và server component. Không import file này
// từ middleware — bcryptjs không chạy được ở edge runtime.

export async function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain, hash) {
  if (!plain || !hash) return false;
  return bcrypt.compare(plain, hash);
}

// Đọc phiên từ cookie. Trả về { id, role } hoặc null.
export async function getSession() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

// Cách dùng trong route handler:
//   const { error, session } = await requireAuth();
//   if (error) return error;
export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    return {
      error: NextResponse.json(
        { error: "Bạn cần đăng nhập để thực hiện thao tác này" },
        { status: 401 }
      ),
    };
  }

  return { session };
}

export async function requireAdmin() {
  const { error, session } = await requireAuth();
  if (error) return { error };

  if (session.role !== "ADMIN") {
    return {
      error: NextResponse.json(
        { error: "Bạn không có quyền truy cập chức năng này" },
        { status: 403 }
      ),
    };
  }

  return { session };
}

// Cho các thao tác trên dữ liệu của chính mình: chủ sở hữu hoặc admin.
export async function requireSelfOrAdmin(userId) {
  const { error, session } = await requireAuth();
  if (error) return { error };

  if (session.role !== "ADMIN" && session.id !== userId) {
    return {
      error: NextResponse.json(
        { error: "Bạn chỉ có thể thao tác trên dữ liệu của mình" },
        { status: 403 }
      ),
    };
  }

  return { session };
}
