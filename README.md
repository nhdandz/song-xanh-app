# Song Xanh App (Cuộc Sống Xanh)

Nền tảng bảo vệ môi trường toàn diện được xây dựng bằng Next.js, giúp người dùng theo dõi các hoạt động xanh, giảm lượng khí thải carbon và kết nối với cộng đồng yêu môi trường.

## Tổng Quan

Song Xanh (Cuộc Sống Xanh) là ứng dụng web full-stack được thiết kế để nâng cao nhận thức về môi trường và cuộc sống bền vững. Người dùng có thể theo dõi các hoạt động thân thiện với môi trường, kiếm điểm và huy hiệu, tham gia thử thách, quét sản phẩm để xem tác động môi trường, giám sát sử dụng tài nguyên và kết nối với những người cùng chí hướng.

## Tính Năng Chính

### Tương Tác Người Dùng
- **Hệ Thống Điểm & Cấp Độ**: Kiếm điểm khi hoàn thành các hoạt động xanh và mở khóa cấp độ mới
- **Huy Hiệu & Thành Tích**: Thu thập huy hiệu làm phần thưởng khi đạt các mốc quan trọng
- **Thử Thách**: Tham gia các thử thách môi trường hàng ngày và hàng tuần
- **Bảng Xếp Hạng**: So sánh tác động môi trường của bạn với bạn bè và nhóm

### Theo Dõi Hoạt Động Xanh
- **Ghi Nhận Hoạt Động**: Ghi lại và theo dõi các hành động thân thiện với môi trường (tái chế, sử dụng phương tiện công cộng, v.v.)
- **Thống Kê Cá Nhân**: Trực quan hóa tác động môi trường của bạn theo thời gian bằng biểu đồ
- **Giám Sát Tài Nguyên**: Theo dõi mức sử dụng điện và nước thông qua các thiết bị được kết nối
- **Dấu Chân Carbon**: Giám sát lượng phát thải carbon và sử dụng nước của bạn

### Tính Bền Vững Sản Phẩm
- **Quét Mã Vạch/QR**: Quét sản phẩm để xem đánh giá môi trường của chúng
- **Điểm Xanh**: Xem các chỉ số bền vững bao gồm khả năng tái chế, phân hủy sinh học và không chứa nhựa
- **Đề Xuất**: Nhận gợi ý cho các sản phẩm thay thế bền vững hơn

### Tính Năng Cộng Đồng
- **Bảng Tin Xã Hội**: Chia sẻ hoạt động xanh của bạn và kết nối với cộng đồng
- **Nhóm**: Tham gia hoặc tạo nhóm (trường học, câu lạc bộ, lớp học)
- **Bạn Bè**: Thêm bạn bè và xem hoạt động môi trường của họ
- **Bình Luận & Thích**: Tương tác với các bài đăng và ý tưởng của cộng đồng

### Hành Động Môi Trường
- **Báo Cáo Vấn Đề**: Báo cáo các vấn đề môi trường trong khu vực của bạn với ảnh và vị trí
- **Đề Xuất Ý Tưởng**: Đề xuất và bình chọn các sáng kiến môi trường
- **Bản Đồ Tương Tác**: Xem các vấn đề được báo cáo và sự kiện trên bản đồ
- **Sự Kiện**: Khám phá và tham gia các sự kiện môi trường địa phương

### Trò Chơi Hóa
- **Trò Chơi Mini**: Tìm hiểu về tính bền vững thông qua các trò chơi tương tác
- **Theo Dõi Tiến Độ**: Giám sát việc hoàn thành thử thách và chuỗi hoạt động

### Bảng Quản Trị
- **Trang Tổng Quan**: Quản lý người dùng, hoạt động, thử thách và nội dung
- **Phân Tích**: Xem số liệu thống kê và mức độ tương tác của người dùng trên toàn nền tảng

## Công Nghệ Sử Dụng

### Frontend
- **Framework**: Next.js 15.3.2
- **Thư Viện UI**: React 19
- **Styling**: Tailwind CSS 4
- **Biểu Đồ**: Chart.js + react-chartjs-2
- **Icons**: React Icons
- **Quét QR**: html5-qrcode

### Backend
- **Runtime**: Node.js
- **Cơ Sở Dữ Liệu**: PostgreSQL
- **ORM**: Prisma
- **API**: Next.js API Routes

### Công Cụ Phát Triển
- **Ngôn Ngữ**: TypeScript
- **Linting**: ESLint
- **Quản Lý Package**: npm

## Bắt Đầu

### Yêu Cầu

- Node.js 18+ đã được cài đặt
- Cơ sở dữ liệu PostgreSQL
- Trình quản lý package npm hoặc yarn

### Cài Đặt

1. Clone repository:
```bash
git clone <repository-url>
cd song-xanh-app
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Thiết lập biến môi trường:

Tạo file `.env` trong thư mục gốc:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/songxanh"
```

4. Thiết lập cơ sở dữ liệu:
```bash
# Tạo Prisma client
npm run prisma:generate

# Chạy migrations
npm run prisma:migrate

# Seed database (tùy chọn)
npm run prisma:seed
```

5. Chạy máy chủ phát triển:
```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## Các Lệnh Khả Dụng

- `npm run dev` - Khởi động máy chủ phát triển với Turbopack
- `npm run build` - Build ứng dụng production
- `npm start` - Khởi động máy chủ production
- `npm run lint` - Chạy ESLint
- `npm run prisma:generate` - Tạo Prisma client
- `npm run prisma:migrate` - Chạy database migrations
- `npm run prisma:seed` - Seed database
- `npm run prisma:studio` - Mở Prisma Studio

## Schema Cơ Sở Dữ Liệu

Ứng dụng sử dụng schema cơ sở dữ liệu toàn diện bao gồm:

- **Quản Lý Người Dùng**: Users, Settings, Friends
- **Hoạt Động Xanh**: GreenActivity, UserActivity
- **Trò Chơi Hóa**: Badges, UserBadge, Challenges, UserChallenge
- **Xã Hội**: Posts, Comments, Likes
- **Cộng Đồng**: Groups, GroupMembers
- **Môi Trường**: Reports, Ideas, Events
- **Sản Phẩm**: Product, ScanHistory
- **Tài Nguyên**: Device, DeviceUsage

Để biết thông tin chi tiết về schema, xem `prisma/schema.prisma`.

## Cấu Trúc Dự Án

```
song-xanh-app/
├── src/
│   ├── app/                 # Thư mục app Next.js
│   │   ├── admin/          # Trang quản trị
│   │   ├── api/            # API routes
│   │   ├── ban-do/         # Tính năng bản đồ
│   │   ├── bao-cao/        # Báo cáo vấn đề
│   │   ├── cai-dat/        # Cài đặt
│   │   ├── dang-ky/        # Đăng ký
│   │   ├── dang-nhap/      # Đăng nhập
│   │   ├── du-an/          # Ý tưởng/dự án
│   │   ├── hanh-vi-xanh/   # Hoạt động xanh
│   │   ├── huy-hieu/       # Huy hiệu
│   │   ├── quet-ma/        # Quét mã QR/vạch
│   │   ├── so-sanh/        # Bảng xếp hạng
│   │   ├── thach-thuc/     # Thử thách
│   │   ├── thong-ke/       # Thống kê
│   │   ├── tiet-kiem/      # Tiết kiệm tài nguyên
│   │   ├── tin-tuc/        # Bảng tin
│   │   ├── tro-choi/       # Trò chơi
│   │   └── welcome/        # Trang chào mừng
│   ├── components/         # Các component React có thể tái sử dụng
│   ├── context/            # React context providers
│   ├── lib/                # Các hàm tiện ích
│   └── middleware/         # Next.js middleware
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.js             # Database seeder
└── public/                 # Tài nguyên tĩnh
```

## Chi Tiết Tính Năng

### Xác Thực & Quản Lý Người Dùng
- Đăng ký và đăng nhập người dùng an toàn
- Kiểm soát truy cập dựa trên vai trò (người dùng, quản trị viên)
- Hồ sơ người dùng với cài đặt có thể tùy chỉnh
- Thông báo nhắc nhở cho các hoạt động hàng ngày

### Theo Dõi Hoạt Động
- Các hoạt động xanh được xác định trước với giá trị điểm
- Tạo hoạt động tùy chỉnh
- Lịch sử hoạt động và chuỗi liên tiếp
- Trực quan hóa tác động bằng biểu đồ

### Hệ Thống Thử Thách
- Nhiều cấp độ khó (Dễ, Trung bình, Khó)
- Thử thách theo danh mục
- Theo dõi tiến độ
- Phần thưởng điểm tự động khi hoàn thành

### Quét Sản Phẩm
- Quét mã vạch theo thời gian thực
- Các chỉ số môi trường toàn diện
- Đề xuất sản phẩm thay thế
- Lịch sử quét để tham khảo trong tương lai

### Giám Sát Tài Nguyên
- Theo dõi mức sử dụng điện theo thiết bị
- Giám sát tiêu thụ nước
- Mẫu sử dụng và đề xuất
- Tính toán dấu chân carbon và nước

## Đóng Góp

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng làm theo các bước sau:

1. Fork repository
2. Tạo nhánh tính năng (`git checkout -b feature/tinh-nang-tuyet-voi`)
3. Commit các thay đổi của bạn (`git commit -m 'Thêm tính năng tuyệt vời'`)
4. Push lên nhánh (`git push origin feature/tinh-nang-tuyet-voi`)
5. Mở Pull Request

## Biến Môi Trường

Các biến môi trường bắt buộc:

- `DATABASE_URL` - Chuỗi kết nối PostgreSQL

## Triển Khai

### Vercel (Khuyến Nghị)

Cách dễ nhất để triển khai là sử dụng [Vercel](https://vercel.com):

1. Đẩy code của bạn lên GitHub
2. Import dự án trong Vercel
3. Cấu hình biến môi trường
4. Triển khai

### Triển Khai Thủ Công

1. Build ứng dụng:
```bash
npm run build
```

2. Khởi động máy chủ production:
```bash
npm start
```

## Giấy Phép

Dự án này là riêng tư và độc quyền.

## Hỗ Trợ

Đối với các vấn đề, câu hỏi hoặc đóng góp, vui lòng mở một issue trong repository.

## Lời Cảm Ơn

Được xây dựng bằng Next.js, Prisma và các công nghệ web mới nhất để tạo ra một tương lai bền vững.

---

**Lưu ý**: Ứng dụng này chủ yếu bằng tiếng Việt để phục vụ cộng đồng Việt Nam trong hành trình bảo vệ môi trường bền vững.
