// File: app/api/streak/route.js
import prisma from "@/lib/prisma";

// Hàm lấy ngày (chỉ YYYY-MM-DD) để so sánh streak
function getDateOnly(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// GET: Trả về dữ liệu streak 7 ngày
export async function GET(req) {
  const userId = "demo_user"; // sau này bạn thay bằng id từ auth

  let streak = await prisma.streak.findUnique({
    where: { userId },
  });

  // Nếu chưa có bản ghi streak → tạo mới
  if (!streak) {
    streak = await prisma.streak.create({
      data: {
        userId,
        currentStreak: 0,
        lastCheckIn: null,
      },
    });
  }

  return Response.json(streak);
}

// POST: Điểm danh ngày hôm nay
export async function POST(req) {
  const userId = "demo_user"; // thay bằng auth thực tế

  let streak = await prisma.streak.findUnique({
    where: { userId },
  });

  // Nếu chưa có streak → tạo mới
  if (!streak) {
    streak = await prisma.streak.create({
      data: {
        userId,
        currentStreak: 1,
        lastCheckIn: getDateOnly(),
      },
    });

    return Response.json(streak);
  }

  const today = getDateOnly();
  const lastCheckIn = streak.lastCheckIn ? getDateOnly(streak.lastCheckIn) : null;

  let newStreak = streak.currentStreak;

  // 1) Nếu đã điểm danh hôm nay → không tăng nữa
  if (lastCheckIn && today.getTime() === lastCheckIn.getTime()) {
    return Response.json({
      ...streak,
      message: "Hôm nay đã điểm danh!",
    });
  }

  // 2) Nếu hôm qua có điểm danh → tăng streak
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (lastCheckIn && lastCheckIn.getTime() === yesterday.getTime()) {
    newStreak += 1;
  } else {
    // 3) Nếu bỏ 1 ngày → reset streak
    newStreak = 1;
  }

  // Lưu lại
  streak = await prisma.streak.update({
    where: { userId },
    data: {
      currentStreak: newStreak,
      lastCheckIn: today,
    },
  });

  return Response.json(streak);
}
