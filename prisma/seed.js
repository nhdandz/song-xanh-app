const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Bắt đầu tạo dữ liệu mẫu...');

  // Khởi tạo tài khoản admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin',
      password: 'admin123',
      role: 'admin',
      school: 'Hệ thống',
      points: 0,
      level: 'Quản trị viên',
      settings: {
        create: {
          reminderOn: true,
          reminderTime: '18:00',
        },
      },
    },
  });

  console.log('Đã tạo tài khoản admin:', admin.email);

  // Khởi tạo người dùng mẫu
  const user1 = await prisma.user.upsert({
    where: { email: 'hocsinh@example.com' },
    update: {},
    create: {
      name: 'Học Sinh',
      email: 'hocsinh@example.com',
      password: 'password123',
      role: 'user',
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
      packaging: 'Chai nhựa PET',
      greenScore: 6.5,
      recyclable: true,
      biodegradable: false,
      plasticFree: false,
      carbonFootprint: 0.15,
      waterUsage: 2.5,
      recommendation: 'Tái chế vỏ chai sau khi sử dụng. Nên chuyển sang sử dụng bình nước cá nhân để giảm rác thải nhựa.',
    },
    {
      barcode: '8934563138165',
      name: 'Ống hút giấy ECO 100 cái',
      brand: 'ECO',
      category: 'Đồ dùng',
      packaging: 'Hộp giấy tái chế',
      greenScore: 8.7,
      recyclable: true,
      biodegradable: true,
      plasticFree: true,
      carbonFootprint: 0.05,
      waterUsage: 0.8,
      recommendation: 'Sản phẩm thân thiện với môi trường, thay thế hoàn hảo cho ống hút nhựa.',
    },
    {
      barcode: '8938506547828',
      name: 'Túi ni lông đen 1kg',
      brand: 'Nhựa Hoàng Long',
      category: 'Đồ dùng',
      packaging: 'Túi nhựa PE',
      greenScore: 2.1,
      recyclable: false,
      biodegradable: false,
      plasticFree: false,
      carbonFootprint: 6.5,
      waterUsage: 1.2,
      recommendation: 'Sản phẩm không thân thiện với môi trường. Nên thay thế bằng túi vải, túi giấy hoặc túi sinh học.',
    },
    {
      barcode: '8936036021578',
      name: 'Bình nước thủy tinh 1L',
      brand: 'Lock&Lock',
      category: 'Đồ dùng',
      packaging: 'Hộp giấy',
      greenScore: 8.5,
      recyclable: true,
      biodegradable: false,
      plasticFree: true,
      carbonFootprint: 0.8,
      waterUsage: 3.0,
      recommendation: 'Sản phẩm bền vững, có thể sử dụng lâu dài. Thủy tinh là vật liệu an toàn và tái chế được hoàn toàn.',
    },
    {
      barcode: '8936099460019',
      name: 'Túi vải canvas tái chế',
      brand: 'EcoLife',
      category: 'Đồ dùng',
      packaging: 'Không bao bì',
      greenScore: 9.0,
      recyclable: true,
      biodegradable: true,
      plasticFree: true,
      carbonFootprint: 0.3,
      waterUsage: 5.0,
      recommendation: 'Sản phẩm tuyệt vời cho môi trường! Có thể sử dụng hàng ngàn lần, giảm đáng kể rác thải nhựa.',
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
  });