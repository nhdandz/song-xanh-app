"use client";

import { useState, useEffect } from "react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    barcode: "",
    name: "",
    brand: "",
    category: "",
    packaging: "",
    greenScore: 5,
    recyclable: false,
    biodegradable: false,
    plasticFree: false,
    recommendation: ""
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
      alert("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.barcode || !formData.name) {
      alert("Vui lòng nhập barcode và tên sản phẩm");
      return;
    }

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          greenScore: parseFloat(formData.greenScore)
        })
      });

      if (res.ok) {
        alert("Đã thêm sản phẩm");
        setShowAddForm(false);
        setFormData({
          barcode: "",
          name: "",
          brand: "",
          category: "",
          packaging: "",
          greenScore: 5,
          recyclable: false,
          biodegradable: false,
          plasticFree: false,
          recommendation: ""
        });
        fetchProducts();
      } else {
        const error = await res.json();
        throw new Error(error.error || "Thêm thất bại");
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
        alert("Đã xóa sản phẩm");
      } else {
        throw new Error("Xóa thất bại");
      }
    } catch (err) {
      console.error(err);
      alert("Không thể xóa sản phẩm");
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.barcode.includes(searchQuery) ||
    (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getScoreColor = (score) => {
    if (score >= 8) return "text-brand bg-brand-wash";
    if (score >= 5) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-ink">Quản lý Sản phẩm</h1>
            <p className="text-ink-soft mt-1">Tổng số: {products.length} sản phẩm</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="sx-btn sx-btn-primary"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Thêm sản phẩm mới
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="mb-6 sx-card p-6">
          <h2 className="text-xl font-bold mb-4">Thêm sản phẩm mới</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Barcode *"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                className="px-4 py-2.5 rounded-xl border-[1.5px] border-line bg-paper focus:outline-none focus:border-brand transition-colors"
                required
              />
              <input
                type="text"
                placeholder="Tên sản phẩm *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-2.5 rounded-xl border-[1.5px] border-line bg-paper focus:outline-none focus:border-brand transition-colors"
                required
              />
              <input
                type="text"
                placeholder="Thương hiệu"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="px-4 py-2.5 rounded-xl border-[1.5px] border-line bg-paper focus:outline-none focus:border-brand transition-colors"
              />
              <input
                type="text"
                placeholder="Danh mục"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="px-4 py-2.5 rounded-xl border-[1.5px] border-line bg-paper focus:outline-none focus:border-brand transition-colors"
              />
              <input
                type="text"
                placeholder="Bao bì"
                value={formData.packaging}
                onChange={(e) => setFormData({ ...formData, packaging: e.target.value })}
                className="px-4 py-2.5 rounded-xl border-[1.5px] border-line bg-paper focus:outline-none focus:border-brand transition-colors"
              />
              <div>
                <label className="block text-sm text-ink-soft mb-1">Điểm xanh (0-10)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.greenScore}
                  onChange={(e) => setFormData({ ...formData, greenScore: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-[1.5px] border-line bg-paper focus:outline-none focus:border-brand transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.recyclable}
                  onChange={(e) => setFormData({ ...formData, recyclable: e.target.checked })}
                  className="mr-2 w-4 h-4 text-brand"
                />
                Tái chế được
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.biodegradable}
                  onChange={(e) => setFormData({ ...formData, biodegradable: e.target.checked })}
                  className="mr-2 w-4 h-4 text-brand"
                />
                Phân hủy sinh học
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.plasticFree}
                  onChange={(e) => setFormData({ ...formData, plasticFree: e.target.checked })}
                  className="mr-2 w-4 h-4 text-brand"
                />
                Không nhựa
              </label>
            </div>

            <textarea
              placeholder="Khuyến nghị"
              value={formData.recommendation}
              onChange={(e) => setFormData({ ...formData, recommendation: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border-[1.5px] border-line bg-paper focus:outline-none focus:border-brand transition-colors"
              rows="3"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                className="sx-btn sx-btn-primary"
              >
                Thêm sản phẩm
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="sx-btn sx-btn-outline"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, barcode, hoặc thương hiệu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-line rounded-lg focus:ring-2 focus:border-brand focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand border-t-transparent"></div>
          <p className="mt-4 text-ink-soft">Đang tải danh sách sản phẩm...</p>
        </div>
      ) : (
        <div className="sx-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-canvas">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ink-faint uppercase">Barcode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ink-faint uppercase">Sản phẩm</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ink-faint uppercase">Thương hiệu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ink-faint uppercase">Danh mục</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ink-faint uppercase">Điểm xanh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ink-faint uppercase">Thuộc tính</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-ink-faint uppercase">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-paper divide-y divide-gray-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-ink-faint">
                      Không tìm thấy sản phẩm nào
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-canvas">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-ink">
                        {product.barcode}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-ink">{product.name}</div>
                        {product.packaging && (
                          <div className="text-xs text-ink-faint">Bao bì: {product.packaging}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-ink">
                        {product.brand || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-ink">
                        {product.category || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getScoreColor(product.greenScore)}`}>
                          {product.greenScore.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {product.recyclable && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">Tái chế</span>
                          )}
                          {product.biodegradable && (
                            <span className="px-2 py-1 text-xs bg-brand-wash text-brand rounded">Phân hủy</span>
                          )}
                          {product.plasticFree && (
                            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">Không nhựa</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
