"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeftIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  CircleStackIcon,
} from "@heroicons/react/24/outline";

const INPUT_CLASS =
  "w-full px-4 py-2.5 rounded-xl border-[1.5px] border-line bg-paper focus:outline-none focus:border-brand transition-colors";

/** Lấy giá trị theo đường dẫn lồng nhau, ví dụ "user.name" hoặc "_count.likes". */
function getPath(row, path) {
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), row);
}

function formatCell(value, type) {
  if (value === null || value === undefined || value === "") return "-";
  if (type === "boolean") return value ? "Có" : "Không";
  if (type === "datetime") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString("vi-VN");
  }
  if (typeof value === "boolean") return value ? "Có" : "Không";
  if (typeof value === "object") return JSON.stringify(value);

  const text = String(value);
  return text.length > 60 ? `${text.slice(0, 60)}…` : text;
}

/** Giá trị mặc định của form cho một bản ghi (hoặc rỗng khi thêm mới). */
function toFormState(fields, row) {
  const state = {};

  for (const field of fields) {
    const value = row ? row[field.name] : undefined;

    if (value === null || value === undefined) {
      // Khi thêm mới, dùng giá trị mặc định của schema (ví dụ "Cho phép đổi" = bật)
      state[field.name] =
        field.type === "boolean" ? Boolean(row ? false : field.default) : "";
      continue;
    }

    if (field.type === "boolean") {
      state[field.name] = Boolean(value);
    } else if (field.type === "datetime") {
      // input datetime-local cần định dạng YYYY-MM-DDTHH:mm theo giờ địa phương
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        state[field.name] = "";
      } else {
        const offset = date.getTimezoneOffset() * 60000;
        state[field.name] = new Date(date.getTime() - offset).toISOString().slice(0, 16);
      }
    } else if (field.type === "json") {
      state[field.name] = JSON.stringify(value, null, 2);
    } else {
      state[field.name] = String(value);
    }
  }

  return state;
}

export default function AdminDataModelPage() {
  const params = useParams();
  const slug = params.model;

  const [meta, setMeta] = useState(null);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [refOptions, setRefOptions] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchRows = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError("");

      const url = `/api/admin/data/${slug}?page=${page}&pageSize=${pageSize}${
        query ? `&q=${encodeURIComponent(query)}` : ""
      }`;
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Không thể tải dữ liệu");

      setMeta({
        label: data.label,
        description: data.description,
        columns: data.columns,
        fields: data.fields,
        searchable: data.searchable,
      });
      setRows(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, [slug, page, pageSize, query]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  // Tải danh sách lựa chọn cho các field liên kết
  useEffect(() => {
    if (!meta?.fields) return;

    const refNames = [
      ...new Set(
        meta.fields.filter((f) => f.type === "ref" && f.refModel).map((f) => f.refModel)
      ),
    ];

    refNames.forEach(async (name) => {
      if (refOptions[name]) return;
      try {
        const res = await fetch(`/api/admin/refs?name=${name}`);
        if (res.ok) {
          const options = await res.json();
          setRefOptions((prev) => ({ ...prev, [name]: options }));
        }
      } catch (err) {
        console.error(`Failed to fetch refs for ${name}:`, err);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta]);

  const openCreateForm = () => {
    setEditingId(null);
    setFormData(toFormState(meta.fields, null));
    setShowForm(true);
  };

  const openEditForm = (row) => {
    setEditingId(row.id);
    setFormData(toFormState(meta.fields, row));
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    try {
      setSaving(true);

      const url = editingId
        ? `/api/admin/data/${slug}/${editingId}`
        : `/api/admin/data/${slug}`;

      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lưu thất bại");

      alert(editingId ? "Đã cập nhật" : "Đã thêm mới");
      closeForm();
      fetchRows();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa bản ghi này?`)) return;

    try {
      const res = await fetch(`/api/admin/data/${slug}/${row.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Xóa thất bại");

      alert("Đã xóa");
      fetchRows();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQuery(search.trim());
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const renderField = (field) => {
    const value = formData[field.name];
    const onChange = (newValue) =>
      setFormData((prev) => ({ ...prev, [field.name]: newValue }));

    if (field.type === "boolean") {
      return (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 text-brand rounded border-line focus:border-brand"
          />
          <span className="text-sm text-ink-soft">{field.label}</span>
        </label>
      );
    }

    const label = (
      <label className="block text-sm text-ink-soft mb-1">
        {field.label}
        {field.required && <span className="text-red-500"> *</span>}
      </label>
    );

    if (field.type === "select") {
      return (
        <div>
          {label}
          <select
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className={INPUT_CLASS}
            required={field.required}
          >
            <option value="">-- Chọn --</option>
            {(field.options || []).map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      );
    }

    if (field.type === "ref") {
      const options = refOptions[field.refModel];
      return (
        <div>
          {label}
          <select
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className={INPUT_CLASS}
            required={field.required}
            disabled={!options}
          >
            <option value="">{options ? "-- Chọn --" : "Đang tải..."}</option>
            {(options || []).map((option) => (
              <option key={option.id} value={option.id}>{option.label}</option>
            ))}
          </select>
        </div>
      );
    }

    if (field.type === "textarea" || field.type === "json") {
      return (
        <div>
          {label}
          <textarea
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className={`${INPUT_CLASS} ${field.type === "json" ? "font-mono text-sm" : ""}`}
            rows={field.type === "json" ? 6 : 3}
            required={field.required}
            placeholder={field.type === "json" ? '{ "key": "value" }' : undefined}
          />
        </div>
      );
    }

    const inputType =
      field.type === "number" || field.type === "float"
        ? "number"
        : field.type === "datetime"
        ? "datetime-local"
        : "text";

    return (
      <div>
        {label}
        <input
          type={inputType}
          step={field.type === "float" ? "any" : undefined}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className={INPUT_CLASS}
          required={field.required}
        />
      </div>
    );
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/du-lieu"
          className="inline-flex items-center text-brand mb-4"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Quay lại Quản lý Dữ liệu
        </Link>

        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-ink">
              {meta?.label || "Đang tải..."}
            </h1>
            <p className="text-ink-soft mt-1">
              {meta?.description}
              {meta && ` · Tổng số: ${total.toLocaleString("vi-VN")}`}
            </p>
          </div>

          {meta && (
            <button
              onClick={openCreateForm}
              className="sx-btn sx-btn-primary"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Thêm mới
            </button>
          )}
        </div>
      </div>

      {meta?.searchable && (
        <form onSubmit={handleSearch} className="mb-6 flex gap-2">
          <div className="flex-1 min-w-[260px] relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${INPUT_CLASS} pl-10`}
            />
          </div>
          <button
            type="submit"
            className="sx-btn sx-btn-primary"
          >
            Tìm
          </button>
        </form>
      )}

      {showForm && meta && (
        <div className="mb-6 sx-card p-6">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? `Sửa ${meta.label}` : `Thêm ${meta.label}`}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {meta.fields.map((field) => (
                <div
                  key={field.name}
                  className={
                    field.type === "textarea" || field.type === "json"
                      ? "md:col-span-2"
                      : ""
                  }
                >
                  {renderField(field)}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="sx-btn sx-btn-primary disabled:bg-gray-300"
              >
                {saving ? "Đang lưu..." : editingId ? "Lưu thay đổi" : "Thêm mới"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="sx-btn sx-btn-outline"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {loadError && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          {loadError}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand border-t-transparent"></div>
          <p className="mt-4 text-ink-soft">Đang tải dữ liệu...</p>
        </div>
      ) : meta ? (
        <div className="sx-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-canvas">
                <tr>
                  {meta.columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-6 py-3 text-left text-xs font-medium text-ink-faint uppercase tracking-wider"
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right text-xs font-medium text-ink-faint uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-paper divide-y divide-gray-200">
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={meta.columns.length + 1}
                      className="px-6 py-12 text-center text-ink-faint"
                    >
                      <CircleStackIcon className="w-12 h-12 mx-auto mb-2 text-ink-faint" />
                      Chưa có dữ liệu
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} className="hover:bg-canvas">
                      {meta.columns.map((column) => (
                        <td
                          key={column.key}
                          className="px-6 py-4 text-sm text-ink whitespace-nowrap"
                        >
                          {formatCell(getPath(row, column.key), column.type)}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openEditForm(row)}
                          className="text-brand hover:text-green-900"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(row)}
                          className="text-red-600 hover:text-red-900 ml-4"
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

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-line">
              <span className="text-sm text-ink-soft">
                Trang {page} / {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-4 py-2 border border-line rounded-lg hover:bg-canvas disabled:opacity-40"
                >
                  Trước
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-4 py-2 border border-line rounded-lg hover:bg-canvas disabled:opacity-40"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
