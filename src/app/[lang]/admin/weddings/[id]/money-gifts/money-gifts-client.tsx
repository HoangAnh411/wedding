"use client";

import { useState } from "react";

interface MoneyGift {
  id: string;
  weddingId: string;
  guestName: string;
  phone: string | null;
  amount: number;
  paymentMethod: string | null;
  receivedAt: string | null;
}

export default function MoneyGiftsClient({
  gifts: initial,
  weddingId,
}: {
  gifts: MoneyGift[];
  weddingId: string;
}) {
  const [gifts, setGifts] = useState(initial);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ weddingId, guestName: "", amount: "", paymentMethod: "Tiền mặt" });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/money-gifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: parseFloat(form.amount) }),
      });
      if (res.ok) {
        const { data } = await res.json();
        setGifts((prev) => [data, ...prev]);
        setShowAdd(false);
        setForm({ weddingId, guestName: "", amount: "", paymentMethod: "Tiền mặt" });
      }
    } finally {
      setLoading(false);
    }
  };

  const total = gifts.reduce((s, g) => s + g.amount, 0);
  const cash = gifts.filter((g) => g.paymentMethod === "Tiền mặt").reduce((s, g) => s + g.amount, 0);
  const transfer = gifts.filter((g) => g.paymentMethod !== "Tiền mặt").reduce((s, g) => s + g.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tiền mừng cưới</h1>
          <p className="mt-1 text-sm text-gray-500">Quản lý tiền mừng từ khách</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700">+ Thêm</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-600">Tổng tiền mừng</p>
          <p className="text-2xl font-bold text-green-700">{total.toLocaleString()}đ</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Tiền mặt</p>
          <p className="text-2xl font-bold text-gray-900">{cash.toLocaleString()}đ</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Chuyển khoản</p>
          <p className="text-2xl font-bold text-gray-900">{transfer.toLocaleString()}đ</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Khách</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Số tiền</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Phương thức</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Ngày</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {gifts.map((g) => (
              <tr key={g.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{g.guestName}</td>
                <td className="px-4 py-3 text-sm font-semibold text-rose-600">{g.amount.toLocaleString()}đ</td>
                <td className="px-4 py-3 text-sm text-gray-500">{g.paymentMethod || "-"}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{g.receivedAt ? new Date(g.receivedAt).toLocaleDateString("vi-VN") : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="mx-4 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">Thêm tiền mừng</h2>
            <form onSubmit={handleAdd} className="mt-4 space-y-4">
              <input type="hidden" value={form.weddingId} />
              <input type="text" required placeholder="Tên khách" value={form.guestName} onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" required placeholder="Số tiền" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
                  <option>Tiền mặt</option>
                  <option>Chuyển khoản</option>
                  <option>MoMo</option>
                </select>
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