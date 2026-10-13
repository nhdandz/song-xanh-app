const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Bắt đầu tạo dữ liệu mẫu...');

  // Khởi tạo người dùng mẫu
  const user1 = await prisma.user.upsert({
    where: { email: 'hocsinh@example.com' },
    update: {},
    create: {
      name: 'Học Sinh',
      email: 'hocsinh@example.com',
      password: 'password123',
      school: 'THPT Nguyễn Huệ',
      points: 0,
      level: 'Người khởi đầu xanh',
      settings: {
        create: {
          reminderOn: true,
          reminderTime: '18:00',
        },
      },
    },
  });

  console.log('Đã tạo người dùng mẫu:', user1.name);

  // Khởi tạo các hoạt động xanh
  const activities = [
    { name: 'Mang chai nước cá nhân', description: 'Giảm sử dụng chai nhựa dùng một lần', points: 1, icon: 'water-bottle' },
    { name: 'Tắt điện khi ra khỏi phòng', description: 'Tiết kiệm năng lượng điện', points: 1, icon: 'light-off' },
    { name: 'Phân loại rác đúng cách', description: 'Giúp tái chế hiệu quả', points: 1, icon: 'recycle-bin' },
    { name: 'Không dùng ống hút nhựa', description: 'Giảm rác thải nhựa', points: 1, icon: 'no-straw' },
    { name: 'Đi học bằng xe đạp/đi bộ', description: 'Giảm khí thải carbon', points: 1, icon: 'bicycle' },
    { name: 'Trồng một cây xanh', description: 'Tăng cường không gian xanh', points: 3, icon: 'plant' },
    { name: 'Tham gia dọn rác cộng đồng', description: 'Dọn dẹp môi trường', points: 5, icon: 'cleanup' },
  ];

  for (const activity of activities) {
    const createdActivity = await prisma.greenActivity.create({
      data: activity,
    });
    console.log(`Đã tạo hoạt động: ${createdActivity.name}`);
  }

  console.log(`Đã tạo ${activities.length} hoạt động xanh`);

  // Khởi tạo các huy hiệu
  const badges = [
    { title: 'Người khởi đầu xanh', description: 'Đạt 10 điểm xanh đầu tiên', points: 10 },
    { title: 'Nhà môi trường nhỏ', description: 'Đạt 30 điểm xanh', points: 30 },
    { title: 'Chiến binh xanh', description: 'Đạt 50 điểm xanh', points: 50 },
    { title: 'Đại sứ môi trường', description: 'Đạt 100 điểm xanh', points: 100 },
    { title: 'Người bảo vệ trái đất', description: 'Đạt 200 điểm xanh', points: 200 },
  ];

  for (const badge of badges) {
    const createdBadge = await prisma.badge.create({
      data: badge,
    });
    console.log(`Đã tạo huy hiệu: ${createdBadge.title}`);
  }

  console.log(`Đã tạo ${badges.length} huy hiệu`);

  // Khởi tạo các thách thức
  const challenges = [
    {
      title: 'Tuần không túi ni-lông',
      description: 'Không sử dụng túi ni-lông trong 7 ngày liên tiếp.',
      points: 50,
      days: 7,
      difficulty: 'Trung bình',
      category: 'Giảm rác thải',
    },
    {
      title: 'Người tiết kiệm điện',
      description: 'Tắt điện khi không sử dụng trong 5 ngày liên tiếp.',
      points: 30,
      days: 5,
      difficulty: 'Dễ',
      category: 'Tiết kiệm năng lượng',
    },
    {
      title: '30 ngày sống xanh',
      description: 'Thực hiện ít nhất 3 hành vi xanh mỗi ngày trong 30 ngày.',
      points: 200,
      days: 30,
      difficulty: 'Khó',
      category: 'Tổng hợp',
      requiredPoints: 100,
    },
  ];

  for (const challenge of challenges) {
    const createdChallenge = await prisma.challenge.create({
      data: challenge,
    });
    console.log(`Đã tạo thách thức: ${createdChallenge.title}`);
  }

  console.log(`Đã tạo ${challenges.length} thách thức`);

  // Khởi tạo các nhóm
  const groups = [
    {
      name: 'Lớp 10A1',
      description: 'Nhóm học sinh lớp 10A1',
      type: 'class',
    },
    {
      name: 'CLB Môi trường',
      description: 'Câu lạc bộ Môi trường của trường',
      type: 'club',
    },
  ];

  for (const group of groups) {
    const createdGroup = await prisma.group.create({
      data: group,
    });
    console.log(`Đã tạo nhóm: ${createdGroup.name}`);
  }

  console.log(`Đã tạo ${groups.length} nhóm`);

  // Khởi tạo sản phẩm mẫu
  const products = [
    {
      barcode: '8938507968047',
      name: 'Nước khoáng Lavie 500ml',
      brand: 'Lavie',
      category: 'Đồ uống',
      packaging: 'Chai nhựa',
      greenScore: 6.5,
      recyclable: true,
      biodegradable: false,
      plasticFree: false,
      recommendation: 'Tái chế vỏ chai sau khi sử dụng. Hoặc thay thế bằng bình nước cá nhân.',
    },
    {
      barcode: '8934563138165',
      name: 'Ống hút giấy ECO 100 cái',
      brand: 'ECO',
      category: 'Đồ dùng',
      packaging: 'Hộp giấy',
      greenScore: 8.7,
      recyclable: true,
      biodegradable: true,
      plasticFree: true,
      recommendation: 'Sản phẩm thân thiện với môi trường, thay thế tốt cho ống hút nhựa.',
    },
  ];

  for (const product of products) {
    const createdProduct = await prisma.product.create({
      data: product,
    });
    console.log(`Đã tạo sản phẩm: ${createdProduct.name}`);
  }

  console.log(`Đã tạo ${products.length} sản phẩm`);

  // Khởi tạo quà tặng cho trang Đổi quà
  const rewards = [
    {
      title: 'Bút chì gỗ tái chế',
      description: 'Bộ 5 bút chì làm từ gỗ tái chế, thân thiện với môi trường.',
      points: 20,
      category: 'Văn phòng phẩm',
      stock: 50,
    },
    {
      title: 'Sổ tay giấy tái chế',
      description: 'Sổ tay 100 trang làm từ giấy tái chế 100%.',
      points: 40,
      category: 'Văn phòng phẩm',
      stock: 30,
    },
    {
      title: 'Bình nước cá nhân',
      description: 'Bình nước inox 500ml, dùng thay cho chai nhựa một lần.',
      points: 120,
      category: 'Đồ dùng',
      stock: 20,
    },
    {
      title: 'Túi vải canvas Sống Xanh',
      description: 'Túi vải dùng nhiều lần, thay thế túi ni-lông khi đi mua sắm.',
      points: 80,
      category: 'Đồ dùng',
      stock: 25,
    },
    {
      title: 'Hạt giống cây xanh',
      description: 'Gói hạt giống kèm hướng dẫn trồng và chăm sóc.',
      points: 30,
      category: 'Cây xanh',
      stock: 60,
    },
    {
      title: 'Cây xương rồng mini',
      description: 'Chậu xương rồng mini để bàn học, dễ chăm sóc.',
      points: 90,
      category: 'Cây xanh',
      stock: 15,
    },
    {
      title: 'Voucher nhà sách 50.000đ',
      description: 'Phiếu mua sách giảm giá 50.000đ tại nhà sách liên kết.',
      points: 200,
      category: 'Voucher',
      stock: 10,
    },
    {
      title: 'Bộ dụng cụ học tập xanh',
      description: 'Bộ thước, gọt bút và cục gôm làm từ vật liệu tái chế.',
      points: 150,
      category: 'Dụng cụ học tập',
      stock: 12,
    },
  ];

  for (const reward of rewards) {
    const createdReward = await prisma.reward.create({
      data: reward,
    });
    console.log(`Đã tạo quà tặng: ${createdReward.title}`);
  }

  console.log(`Đã tạo ${rewards.length} quà tặng`);

  console.log('Tạo dữ liệu mẫu hoàn tất!');
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
