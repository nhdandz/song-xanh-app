const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const data = require('./seed-data');

const prisma = new PrismaClient();

// Tài khoản mẫu lấy từ biến môi trường; có mặc định để clone về chạy được ngay.
// Mật khẩu luôn được hash trước khi ghi vào DB.
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@songxanh.local';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'admin-doi-mat-khau';
const USER_EMAIL = process.env.SEED_USER_EMAIL || 'hocsinh@example.com';
const USER_PASSWORD = process.env.SEED_USER_PASSWORD || 'hocsinh-doi-mat-khau';

/**
 * Tạo bản ghi nếu chưa có, cập nhật nếu đã có.
 * Dùng cho các model không có khóa duy nhất ngoài id — tìm theo một field
 * làm "khóa nghiệp vụ" (vd: tên, tiêu đề) để chạy lại seed không bị nhân đôi.
 */
async function upsertBy(model, key, rows, label) {
  let created = 0;
  let updated = 0;

  for (const row of rows) {
    const existing = await model.findFirst({ where: { [key]: row[key] } });

    if (existing) {
      await model.update({ where: { id: existing.id }, data: row });
      updated += 1;
    } else {
      await model.create({ data: row });
      created += 1;
    }
  }

  console.log(`${label}: thêm mới ${created}, cập nhật ${updated}`);
}

async function main() {
  console.log('Bắt đầu cập nhật dữ liệu mẫu...\n');

  // --- Tài khoản học sinh mẫu ---
  // update cũng đặt lại mật khẩu + vai trò, để chạy lại seed là chuẩn hoá
  // được tài khoản cũ (ví dụ mật khẩu còn lưu dạng plaintext).
  const userPasswordHash = await bcrypt.hash(USER_PASSWORD, 10);
  const user = await prisma.user.upsert({
    where: { email: USER_EMAIL },
    update: { password: userPasswordHash, role: 'USER' },
    create: {
      name: 'Học Sinh',
      email: USER_EMAIL,
      password: userPasswordHash,
      role: 'USER',
      school: 'THPT Nguyễn Huệ',
      points: 0,
      level: 'Người khởi đầu xanh',
      settings: {
        create: { reminderOn: true, reminderTime: '18:00' },
      },
    },
  });
  console.log(`Tài khoản học sinh: ${user.email}`);

  // --- Tài khoản quản trị ---
  const adminPasswordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { password: adminPasswordHash, role: 'ADMIN' },
    create: {
      name: 'Quản trị viên',
      email: ADMIN_EMAIL,
      password: adminPasswordHash,
      role: 'ADMIN',
      points: 0,
      settings: {
        create: { reminderOn: false, reminderTime: '18:00' },
      },
    },
  });
  console.log(`Tài khoản quản trị: ${admin.email}\n`);

  // --- Nhóm / lớp ---
  await upsertBy(
    prisma.group,
    'name',
    [
      { name: 'Lớp 10A1', description: 'Nhóm học sinh lớp 10A1', type: 'class' },
      { name: 'Lớp 10A2', description: 'Nhóm học sinh lớp 10A2', type: 'class' },
      { name: 'CLB Môi trường', description: 'Câu lạc bộ Môi trường của trường', type: 'club' },
    ],
    'Nhóm'
  );

  // --- Nội dung chính ---
  await upsertBy(prisma.greenActivity, 'name', data.GREEN_ACTIVITIES, 'Hoạt động xanh');
  await upsertBy(prisma.badge, 'title', data.BADGES, 'Huy hiệu');
  await upsertBy(prisma.challenge, 'title', data.CHALLENGES, 'Thách thức');
  await upsertBy(prisma.dailyMission, 'title', data.DAILY_MISSIONS, 'Nhiệm vụ hằng ngày');
  await upsertBy(prisma.device, 'name', data.DEVICES, 'Thiết bị');
  await upsertBy(prisma.reward, 'title', data.REWARDS, 'Quà tặng');

  // --- Nội dung trò chơi: trước nằm cắm cứng trong mã nguồn, nay nằm ở DB
  // để quản trị viên tự thêm/sửa được ---
  await upsertBy(prisma.quizQuestion, 'question', data.QUIZ_QUESTIONS, 'Câu hỏi trắc nghiệm');
  await upsertBy(prisma.wasteItem, 'name', data.WASTE_ITEMS, 'Món rác phân loại');
  await upsertBy(prisma.behaviorItem, 'text', data.BEHAVIOR_ITEMS, 'Hành vi xanh');

  // --- Sản phẩm: barcode là khóa duy nhất nên dùng upsert thẳng ---
  let productCreated = 0;
  let productUpdated = 0;
  for (const product of data.PRODUCTS) {
    const existing = await prisma.product.findUnique({ where: { barcode: product.barcode } });
    await prisma.product.upsert({
      where: { barcode: product.barcode },
      update: product,
      create: product,
    });
    existing ? (productUpdated += 1) : (productCreated += 1);
  }
  console.log(`Sản phẩm: thêm mới ${productCreated}, cập nhật ${productUpdated}`);

  // --- Bài viết: giữ nguyên ngày tạo nếu đã có ---
  let articleCreated = 0;
  let articleUpdated = 0;
  for (const article of data.ARTICLES) {
    const existing = await prisma.article.findFirst({ where: { title: article.title } });

    if (existing) {
      await prisma.article.update({ where: { id: existing.id }, data: article });
      articleUpdated += 1;
    } else {
      await prisma.article.create({ data: { ...article, date: new Date() } });
      articleCreated += 1;
    }
  }
  console.log(`Bài viết: thêm mới ${articleCreated}, cập nhật ${articleUpdated}`);

  console.log('\nCập nhật dữ liệu hoàn tất!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
