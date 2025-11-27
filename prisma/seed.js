<<<<<<< HEAD
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

  // Khởi tạo các nhiệm vụ hàng ngày
  const dailyMissions = [
    {
      title: 'Hôm nay ăn chay',
      description: 'Bữa trưa hoặc tối ăn chay để giảm khí thải carbon',
      points: 10,
      icon: '🥗',
      category: 'Ăn uống',
    },
    {
      title: 'Dọn dẹp khu vực xung quanh',
      description: 'Dọn rác quanh nhà hoặc trường học',
      points: 15,
      icon: '🧹',
      category: 'Hành động',
    },
    {
      title: 'Tuyên truyền sống xanh với 2 bạn',
      description: 'Chia sẻ về bảo vệ môi trường với ít nhất 2 người',
      points: 20,
      icon: '💬',
      category: 'Truyền thông',
    },
    {
      title: 'Sử dụng bình nước cá nhân',
      description: 'Mang theo bình nước riêng thay vì mua chai nhựa',
      points: 5,
      icon: '🚰',
      category: 'Giảm rác thải',
    },
    {
      title: 'Tắt thiết bị điện không dùng',
      description: 'Kiểm tra và tắt các thiết bị điện không sử dụng',
      points: 5,
      icon: '💡',
      category: 'Tiết kiệm năng lượng',
    },
  ];

  for (const mission of dailyMissions) {
    const createdMission = await prisma.dailyMission.create({
      data: mission,
    });
    console.log(`Đã tạo nhiệm vụ: ${createdMission.title}`);
  }

  console.log(`Đã tạo ${dailyMissions.length} nhiệm vụ hàng ngày`);

  // Khởi tạo các phần quà
  const rewards = [
    {
      title: 'Bút bi xanh',
      description: 'Bút bi thân thiện môi trường',
      points: 20,
      image: '/rewards/pen.png',
      category: 'Văn phòng phẩm',
      stock: 50,
    },
    {
      title: 'Sổ tay tái chế',
      description: 'Sổ tay làm từ giấy tái chế',
      points: 30,
      image: '/rewards/notebook.png',
      category: 'Văn phòng phẩm',
      stock: 30,
    },
    {
      title: 'Túi vải canvas',
      description: 'Túi vải có thể tái sử dụng',
      points: 50,
      image: '/rewards/bag.png',
      category: 'Đồ dùng',
      stock: 20,
    },
    {
      title: 'Bình nước inox',
      description: 'Bình nước giữ nhiệt 500ml',
      points: 100,
      image: '/rewards/bottle.png',
      category: 'Đồ dùng',
      stock: 15,
    },
    {
      title: 'Hộp cơm tre',
      description: 'Hộp đựng thực phẩm làm từ tre tự nhiên',
      points: 80,
      image: '/rewards/lunchbox.png',
      category: 'Đồ dùng',
      stock: 10,
    },
    {
      title: 'Cây xanh mini',
      description: 'Cây sen đá nhỏ trong chậu',
      points: 40,
      image: '/rewards/plant.png',
      category: 'Cây xanh',
      stock: 25,
    },
    {
      title: 'Voucher nhà sách 50k',
      description: 'Phiếu mua sách trị giá 50.000đ',
      points: 150,
      image: '/rewards/voucher.png',
      category: 'Voucher',
      stock: 10,
    },
  ];

  for (const reward of rewards) {
    const createdReward = await prisma.reward.create({
      data: reward,
    });
    console.log(`Đã tạo phần quà: ${createdReward.title}`);
  }

  console.log(`Đã tạo ${rewards.length} phần quà`);

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
=======
const { PrismaClient } = require('../src/generated/prisma/client')
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
>>>>>>> c9a6028 (add database)
  });