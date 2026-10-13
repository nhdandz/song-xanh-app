// File: src/lib/adminData.js
// Chuyển dữ liệu từ form admin sang dữ liệu Prisma, chỉ nhận đúng các field
// được khai báo trong src/lib/adminModels.js.

export class AdminDataError extends Error {
  constructor(message) {
    super(message);
    this.name = "AdminDataError";
  }
}

function isEmpty(value) {
  return value === undefined || value === null || value === "";
}

function coerce(field, raw) {
  switch (field.type) {
    case "number": {
      const num = Number(raw);
      if (!Number.isInteger(num)) {
        throw new AdminDataError(`"${field.label}" phải là số nguyên`);
      }
      return num;
    }
    case "float": {
      const num = Number(raw);
      if (Number.isNaN(num)) {
        throw new AdminDataError(`"${field.label}" phải là số`);
      }
      return num;
    }
    case "boolean":
      return raw === true || raw === "true" || raw === 1 || raw === "1";
    case "datetime": {
      const date = new Date(raw);
      if (Number.isNaN(date.getTime())) {
        throw new AdminDataError(`"${field.label}" không phải thời gian hợp lệ`);
      }
      return date;
    }
    case "json": {
      if (typeof raw === "object") return raw;
      try {
        return JSON.parse(raw);
      } catch {
        throw new AdminDataError(`"${field.label}" phải là JSON hợp lệ`);
      }
    }
    case "select":
      if (field.options && !field.options.includes(String(raw))) {
        throw new AdminDataError(`"${field.label}" không thuộc danh sách cho phép`);
      }
      return String(raw);
    default:
      return String(raw);
  }
}

/**
 * Dựng object data cho prisma.create / prisma.update.
 * partial = true (PUT/PATCH): chỉ xử lý những field có mặt trong body.
 */
export function buildData(config, body, { partial = false } = {}) {
  const data = {};

  for (const field of config.fields) {
    const present = Object.prototype.hasOwnProperty.call(body, field.name);

    if (partial && !present) continue;

    const raw = body[field.name];

    if (isEmpty(raw)) {
      if (field.required && !partial) {
        throw new AdminDataError(`Thiếu "${field.label}"`);
      }
      if (field.required && partial && present) {
        throw new AdminDataError(`"${field.label}" không được để trống`);
      }
      // Bỏ trống một field cho phép null nghĩa là xóa giá trị cũ.
      // Các field khác (có giá trị mặc định trong schema) thì giữ nguyên /
      // để Prisma tự điền khi tạo mới.
      if (field.nullable) data[field.name] = null;
      continue;
    }

    data[field.name] = coerce(field, raw);
  }

  if (Object.keys(data).length === 0) {
    throw new AdminDataError("Không có dữ liệu để lưu");
  }

  return data;
}

/** Thông báo lỗi tiếng Việt cho các mã lỗi Prisma thường gặp. */
export function prismaErrorMessage(error, fallback) {
  if (error?.code === "P2002") {
    return "Dữ liệu đã tồn tại (trùng khóa duy nhất)";
  }
  if (error?.code === "P2003" || error?.code === "P2025") {
    return "Bản ghi liên kết không tồn tại";
  }
  return fallback;
}
