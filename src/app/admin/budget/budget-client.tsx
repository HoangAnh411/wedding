"use client";

import { useState } from "react";

interface BudgetItem {
  id: string;
  weddingId: string;
  category: string;
  itemName: string;
  estimatedCost: number | null;
  actualCost: number | null;
  isPaid: boolean;
  vendorName: string | null;
}

export default function BudgetClient({
  items: initial,
  weddings,
  categories,
}: {
  items: BudgetItem[];
  weddings: { id: string; groomName: string; brideName: string }[];
  categories: readonly string[];
}) {
  const [items, setItems] = useState(initial);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ weddingId: "", category: categories[0], itemName: "", estimatedCost: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, estimatedCost: form.estimatedCost ? parseFloat(form.estimatedCost) : null }),
      });
      if (res.ok) {
        const { data } = await res.json();
        setItems((prev) => [data, ...prev]);
        setShowAdd(false);
        setForm({ weddingId: "", category: categories[0], itemName: "", estimatedCost: "" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa?")) return;
    await fetch(`/api/budget/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const totalEstimated = items.reduce((s, i) => s + (i.estimatedCost || 0), 0);
  const totalActual = items.reduce((s, i) => s + (i.actualCost || 0), 0);
  const totalPaid = items.filter((i) => i.isPaid).reduce((s, i) => s + (i.actualCost || i.estimatedCost || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ngân sách</h1>
          <p className="mt-1 text-sm text-gray-500">Theo dõi chi phí đám cưới</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700">+ Thêm khoản chi</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Dự kiến</p>
          <p className="text-2xl font-bold text-gray-900">{totalEstimated.toLocaleString()}đ</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Thực tế</p>
          <p className="text-2xl font-bold text-rose-600">{totalActual.toLocaleString()}đ</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Đã thanh toán</p>
          <p className="text-2xl font-bold text-green-600">{totalPaid.toLocaleString()}đ</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Khoản chi</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Danh mục</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Dự kiến</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Thực tế</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">TT</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((i) => {
              const diff = (i.actualCost || 0) - (i.estimatedCost || 0);
              return (
                <tr key={i.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{i.itemName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{i.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{i.estimatedCost ? `${i.estimatedCost.toLocaleString()}đ` : "-"}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{i.actualCost ? `${i.actualCost.toLocaleString()}đ` : "-"}</td>
                  <td className="px-4 py-3">{i.isPaid ? <span className="text-green-600">✅</span> : <span className="text-gray-300">⏳</span>}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(i.id)} className="text-xs text-red-400 hover:text-red-600">Xóa</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="mx-4 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">Thêm khoản chi</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <select required value={form.weddingId} onChange={(e) => setForm({ ...form, weddingId: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                <option value="">Chọn đám cưới</option>
                {weddings.map((w) => <option key={w.id} value={w.id}>{w.groomName} & {w.brideName}</option>)}
              </select>
              <input type="text" required placeholder="Tên khoản chi" value={form.itemName} onChange={(e) => setForm({ ...form, itemName: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <div className="grid grid-cols-2 gap-4">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
                <input type="number" placeholder="Số tiền dự kiến" value={form.estimatedCost} onChange={(e) => setForm({ ...form, estimatedCost: e.target.value })}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowAdd(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Hủy</button>
                <button type="submit" disabled={loading} className="rounded-lg bg-rose-600 px-4 py-2 text-sm text-white hover:bg-rose-700">Thêm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}