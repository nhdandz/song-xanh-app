# Hướng dẫn Setup Tính năng Quét Mã với AI

## Tổng quan

Tính năng quét mã đã được nâng cấp để sử dụng Gemini AI đánh giá sản phẩm thực tế. Khi quét mã sản phẩm:

1. **Kiểm tra cơ sở dữ liệu local** - Nếu sản phẩm đã có trong database mẫu, hiển thị ngay
2. **Sử dụng Gemini AI** - Nếu không tìm thấy, gọi API Gemini để phân tích và đánh giá độ xanh của sản phẩm

## Cài đặt

### 1. Thêm GEMINI_API_KEY vào file .env

Mở file `.env` và thêm dòng sau:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**Lấy API key từ đâu?**
- Truy cập: https://aistudio.google.com/app/apikey
- Đăng nhập bằng tài khoản Google
- Tạo API key mới
- Copy và paste vào file .env

### 2. Cài đặt dependencies (đã có sẵn)

```bash
npm install
# hoặc
yarn install
```

Các package cần thiết:
- `html5-qrcode` - Quét QR/barcode từ camera
- `@google/generative-ai` - Gemini AI SDK

### 3. Khởi động ứng dụng

```bash
npm run dev
# hoặc
yarn dev
```

Truy cập: http://localhost:3000/quet-ma

## Cách sử dụng

### Quét mã bằng Camera
1. Nhấn nút "Mở máy ảnh để quét"
2. Cho phép trình duyệt truy cập camera
3. Hướng camera vào mã vạch/QR code
4. Đợi AI phân tích (2-5 giây)
5. Xem kết quả đánh giá

### Quét mã từ Ảnh
1. Nhấn nút "Chọn ảnh"
2. Chọn ảnh có mã vạch/QR code
3. AI sẽ tự động phân tích

### Nhập mã thủ công
1. Nhập mã vạch vào ô tìm kiếm
2. Nhấn Enter hoặc nút "Tìm"
3. AI sẽ đánh giá sản phẩm

## Tính năng AI

### Gemini AI đánh giá:
- **Điểm xanh** (0-10): Mức độ thân thiện môi trường
- **Khả năng tái chế**: Có thể tái chế không?
- **Phân hủy sinh học**: Có phân hủy tự nhiên không?
- **Không nhựa**: Sản phẩm có chứa nhựa không?
- **Gợi ý**: Cách sử dụng hoặc thay thế tốt hơn
- **Phân tích**: Giải thích chi tiết từ AI

### API Endpoint

**POST** `/api/evaluate-product`

Request body:
```json
{
  "barcode": "8938507968047",
  "productName": "Nước khoáng Lavie 500ml",
  "category": "Đồ uống",
  "packaging": "Chai nhựa"
}
```

Response:
```json
{
  "barcode": "8938507968047",
  "name": "Nước khoáng Lavie 500ml",
  "greenScore": 6.5,
  "recyclable": true,
  "biodegradable": false,
  "plasticFree": false,
  "recommendation": "Tái chế vỏ chai sau khi sử dụng",
  "category": "Đồ uống",
  "packaging": "Chai nhựa",
  "analysis": "Chai nhựa PET có thể tái chế...",
  "brand": "Lavie"
}
```

## Lưu ý

### Bảo mật
- API key được lưu trên server (.env), không lộ ra client
- Tất cả request đi qua proxy `/api/evaluate-product`

### Performance
- Response time: 2-5 giây (tùy mạng)
- Cache: Lịch sử quét lưu trong localStorage
- Giới hạn: Tối đa 50 lịch sử quét

### Trình duyệt hỗ trợ
- **Chrome/Edge**: Đầy đủ (BarcodeDetector API + Camera)
- **Firefox**: Tốt (html5-qrcode)
- **Safari**: Tốt (html5-qrcode)
- **Mobile**: Hỗ trợ tốt trên cả iOS và Android

## Troubleshooting

### Lỗi "GEMINI_API_KEY chưa cấu hình"
- Kiểm tra file `.env` có GEMINI_API_KEY
- Restart server: `npm run dev`

### Camera không hoạt động
- Kiểm tra quyền camera trong browser settings
- Thử trình duyệt khác (Chrome recommended)
- Dùng HTTPS hoặc localhost (HTTP không hỗ trợ camera)

### AI không phản hồi
- Kiểm tra API key còn hiệu lực
- Kiểm tra network console (F12)
- Thử lại sau vài giây

### Quét mã không chính xác
- Đảm bảo mã vạch rõ nét, đủ sáng
- Giữ camera ổn định
- Thử chụp ảnh và upload thay vì quét trực tiếp

## Cải tiến trong tương lai

- [ ] Lưu kết quả AI vào database để tái sử dụng
- [ ] Cho phép người dùng sửa/bổ sung thông tin sản phẩm
- [ ] Tích hợp API tra cứu mã vạch online (barcodelookup.com)
- [ ] Thêm tính năng so sánh sản phẩm
- [ ] Tích hợp image recognition để phân tích bao bì

## Liên hệ

Nếu có vấn đề hoặc đề xuất, vui lòng tạo issue trên GitHub.
