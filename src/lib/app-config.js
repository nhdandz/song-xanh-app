// Cấu hình chung của ứng dụng.
// Đổi tên ứng dụng ở đây là đổi ở mọi nơi hiển thị cho người dùng.
export const APP_NAME = 'Đánh Giá Xanh';

export const APP_DESCRIPTION =
  'Ghi nhận hành động xanh, quét sản phẩm và chơi trò chơi môi trường.';

// Ba nội dung chính mà người dùng được thấy (ngoài trang đăng nhập).
// Danh sách này là nguồn duy nhất cho thanh điều hướng.
export const USER_FEATURES = [
  { path: '/hanh-vi-xanh', label: 'Hành động', hint: 'Ghi nhận việc tốt mỗi ngày' },
  { path: '/quet-ma', label: 'Quét sản phẩm', hint: 'Xem sản phẩm có xanh không' },
  { path: '/tro-choi', label: 'Trò chơi', hint: 'Câu đố, trồng cây, phân loại rác' },
];

// Những trang cũ đã ẩn khỏi phần người dùng (middleware sẽ chặn truy cập
// trực tiếp bằng đường dẫn). Nội dung vẫn còn trong database và trang admin.
export const HIDDEN_USER_PATHS = [
  '/thong-ke',
  '/thach-thuc',
  '/so-sanh',
  '/huy-hieu',
  '/tin-tuc',
  '/ban-do',
  '/du-an',
  '/bao-cao',
  '/tiet-kiem',
  '/y-tuong',
  '/chat-bot',
  '/doi-qua',
  '/cai-dat',
];
