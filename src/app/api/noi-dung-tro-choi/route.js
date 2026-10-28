import prisma from "@/lib/prisma";

// Nội dung cho các trò chơi ở trang /tro-choi.
//
// Trước đây ba bộ dữ liệu này nằm cắm cứng trong mã nguồn, muốn thêm một câu
// hỏi là phải sửa file rồi build lại. Nay chúng nằm trong database và quản
// trị viên tự sửa được ở /admin/du-lieu, nên trang học sinh đọc qua API này.
//
// GET để công khai, giống /api/articles và /api/rewards: đây là nội dung học
// tập, không có gì riêng tư. Việc thêm/sửa/xoá đi qua /api/admin/data và vẫn
// đòi quyền quản trị.

export async function GET() {
  try {
    const [questions, wasteItems, behaviors] = await Promise.all([
      prisma.quizQuestion.findMany({
        where: { active: true },
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          question: true,
          options: true,
          correctAnswer: true,
          explanation: true,
          topic: true,
        },
      }),
      prisma.wasteItem.findMany({
        where: { active: true },
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        select: { id: true, name: true, emoji: true, category: true },
      }),
      prisma.behaviorItem.findMany({
        where: { active: true },
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        select: { id: true, text: true, label: true, explain: true },
      }),
    ]);

    return Response.json({ questions, wasteItems, behaviors });
  } catch (err) {
    console.error("/api/noi-dung-tro-choi error:", err?.message || err);
    return Response.json({ error: "Không tải được nội dung trò chơi" }, { status: 500 });
  }
}
