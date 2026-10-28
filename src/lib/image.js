// Tiện ích xử lý ảnh phía client, dùng cho tính năng nhận diện sản phẩm.
//
// Ảnh chụp từ điện thoại thường 3-8 MB và cạnh dài 4000px, trong khi mô
// hình chỉ cần khoảng 1024px là đủ đọc chữ trên bao bì. Nén trước khi gửi
// giúp giảm thời gian tải lên và lượng token mô hình phải xử lý.

const DEFAULT_MAX_SIZE = 1024;
const DEFAULT_QUALITY = 0.8;

// Vẽ ảnh ra canvas đã thu nhỏ. Tách riêng để hai nhánh giải mã bên dưới
// dùng chung.
function drawToCanvas(source, width, height, maxSize) {
  const scale = Math.min(1, maxSize / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);

  const ctx = canvas.getContext("2d");
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);

  return canvas;
}

// Safari cũ và một số định dạng (HEIC) không qua được createImageBitmap,
// nên có nhánh dự phòng dùng thẻ <img>.
async function decodeViaImageElement(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Trình duyệt không đọc được định dạng ảnh này"));
      el.src = url;
    });
    return { source: img, width: img.naturalWidth, height: img.naturalHeight, cleanup: null };
  } finally {
    // Giải phóng sau khi ảnh đã vẽ xong ở hàm gọi, nên hoãn một nhịp.
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}

/**
 * Nén ảnh và trả về base64 thuần (không kèm tiền tố data URL).
 *
 * @returns {Promise<{base64: string, mimeType: string, width: number, height: number, bytes: number}>}
 */
export async function compressImageToBase64(file, options = {}) {
  const maxSize = options.maxSize || DEFAULT_MAX_SIZE;
  const quality = options.quality || DEFAULT_QUALITY;

  if (!file || !file.type?.startsWith("image/")) {
    throw new Error("Tệp được chọn không phải ảnh");
  }

  let canvas;

  try {
    const bitmap = await createImageBitmap(file);
    canvas = drawToCanvas(bitmap, bitmap.width, bitmap.height, maxSize);
    bitmap.close?.();
  } catch {
    const { source, width, height } = await decodeViaImageElement(file);
    if (!width || !height) throw new Error("Không đọc được kích thước ảnh");
    canvas = drawToCanvas(source, width, height, maxSize);
  }

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Không nén được ảnh"))),
      "image/jpeg",
      quality
    );
  });

  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      resolve(dataUrl.slice(dataUrl.indexOf(",") + 1));
    };
    reader.onerror = () => reject(new Error("Không đọc được dữ liệu ảnh"));
    reader.readAsDataURL(blob);
  });

  return {
    base64,
    mimeType: "image/jpeg",
    width: canvas.width,
    height: canvas.height,
    bytes: blob.size,
  };
}
