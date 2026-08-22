"use client";

import { useState } from "react";

interface Vendor {
  id: string;
  weddingId: string;
  name: string;
  category: string;
  contactName: string | null;
  contactPhone: string | null;
  status: string | null;
  contractValue: number | null;
  paidAmount: number | null;
}

export default function VendorsClient({
  vendors: initial,
  weddingId,
  categories,
}: {
  vendors: Vendor[];
  weddingId: string;
  categories: readonly string[];
}) {
  const [vendors, setVendors] = useState(initial);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ weddingId, name: "", category: categories[0], contactName: "", contactPhone: "", contractValue: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, contractValue: form.contractValue ? parseFloat(form.contractValue) : null }),
      });
      if (!res.ok) throw new Error();
      const { data } = await res.json();
      setVendors((prev) => [data, ...prev]);
      setShowAdd(false);
      setForm({ weddingId, name: "", category: categories[0], contactName: "", contactPhone: "", contractValue: "" });
    } catch {}
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa nhà cung cấp này?")) return;
    await fetch(`/api/vendors/${id}`, { method: "DELETE" });
    setVendors((prev) => prev.filter((v) => v.id !== id));
  };

  const STATUS_LABELS: Record<string, string> = { contacted: "Đã liên hệ", booked: "Đã book", paid: "Đã thanh toán" };
  const STATUS_COLORS: Record<string, string> = { contacted: "bg-yellow-100 text-yellow-800", booked: "bg-blue-100 text-blue-800", paid: "bg-green-100 text-green-800" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nhà cung cấp</h1>
          <p className="mt-1 text-sm text-gray-500">Quản lý các dịch vụ cho đám cưới</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700">+ Thêm nhà cung cấp</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {categories.slice(0, 3).map((cat) => (
          <div key={cat} className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm font-medium text-gray-500">{cat}</p>
            <p className="text-2xl font-bold text-gray-900">{vendors.filter((v) => v.category === cat).length}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Tên</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Danh mục</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Liên hệ</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Trạng thái</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Hợp đồng</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Đã trả</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {vendors.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{v.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{v.category}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{v.contactName || "-"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[v.status || "contacted"]}`}>
                    {STATUS_LABELS[v.status || "contacted"]}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{v.contractValue ? `${v.contractValue.toLocaleString()}đ` : "-"}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{v.paidAmount ? `${v.paidAmount.toLocaleString()}đ` : "-"}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(v.id)} className="text-xs text-red-400 hover:text-red-600">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="mx-4 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">Thêm nhà cung cấp</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tên *</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Danh mục</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                    {categories.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Người liên hệ" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                <input type="text" placeholder="SĐT" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <input type="number" placeholder="Giá trị hợp đồng (VNĐ)" value={form.contractValue} onChange={(e) => setForm({ ...form, contractValue: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowAdd(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Hủy</button>
                <button type="submit" disabled={loading} className="rounded-lg bg-rose-600 px-4 py-2 text-sm text-white hover:bg-rose-700 disabled:opacity-50">
                  {loading ? "Đang thêm..." : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}