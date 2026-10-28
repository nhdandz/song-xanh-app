import prisma from "@/lib/prisma";

// Danh mục sản phẩm cho trang /quet-ma.
//
// Trước đây trang quét mã dùng mảng PRODUCTS cắm cứng 3 sản phẩm và không
// hề đọc database, nên những sản phẩm quản trị viên thêm ở /admin/san-pham
// không bao giờ xuất hiện. Route này nối lại hai đầu đó.
//
// GET để công khai giống /api/articles và /api/rewards; việc thêm/sửa/xoá
// vẫn đi qua /api/admin/products và đòi quyền quản trị.

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const barcode = searchParams.get("barcode");

    if (barcode) {
      const product = await prisma.product.findUnique({ where: { barcode } });
      if (!product) {
        return Response.json({ error: "Không tìm thấy sản phẩm" }, { status: 404 });
      }
      return Response.json({ product });
    }

    const products = await prisma.product.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    return Response.json({ products });
  } catch (err) {
    console.error("/api/products error:", err?.message || err);
    return Response.json({ error: "Không tải được danh sách sản phẩm" }, { status: 500 });
  }
}
