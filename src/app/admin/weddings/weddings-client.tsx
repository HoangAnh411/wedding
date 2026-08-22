"use client";

import { useState } from "react";
import Link from "next/link";

interface WeddingSummary {
  id: string;
  slug: string;
  title: string;
  groomName: string;
  brideName: string;
  weddingDate: string | null;
  venueName: string | null;
  coverImage: string | null;
  guestCount: number;
  confirmedCount: number;
}

export default function WeddingsClient({
  weddings: initialWeddings,
  userId,
}: {
  weddings: WeddingSummary[];
  userId: string;
}) {
  const [weddings, setWeddings] = useState(initialWeddings);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ groomName: "", brideName: "", weddingDate: "", venueName: "", clientEmail: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/weddings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to create");
      const { data } = await res.json();
      setWeddings((prev) => [data, ...prev]);
      setShowCreate(false);
      setForm({ groomName: "", brideName: "", weddingDate: "", venueName: "", clientEmail: "" });
    } catch {
      setError("Có lỗi xảy ra");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Đám cưới</h1>
          <p className="mt-1 text-sm text-gray-500">Quản lý các đám cưới của bạn</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-700"
        >
          + Tạo đám cưới mới
        </button>
      </div>

      {weddings.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
          <div className="mb-4 text-4xl">💒</div>
          <h3 className="text-lg font-semibold text-gray-900">Chưa có đám cưới nào</h3>
          <p className="mt-2 text-sm text-gray-500">Tạo đám cưới đầu tiên để bắt đầu quản lý</p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-4 rounded-lg bg-rose-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-700"
          >
            Tạo đám cưới mới
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {weddings.map((w) => (
            <Link
              key={w.id}
              href={`/admin/weddings/${w.id}`}
              className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              {w.coverImage ? (
                <img src={w.coverImage} alt="" className="mb-4 h-40 w-full rounded-lg object-cover" />
              ) : (
                <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-gradient-to-br from-rose-100 to-pink-100">
                  <span className="text-4xl">💒</span>
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-rose-600">
                {w.groomName} & {w.brideName}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {w.weddingDate ? new Date(w.weddingDate).toLocaleDateString("vi-VN") : "Chưa có ngày"}
              </p>
              {w.venueName && <p className="mt-1 text-xs text-gray-400">{w.venueName}</p>}
              <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                <span>👥 {w.guestCount} khách</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="mx-4 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">Tạo đám cưới mới</h2>
            <p className="mt-1 text-sm text-gray-500">Điền thông tin cơ bản để bắt đầu</p>
            {error && <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
            <form className="mt-6 space-y-4" onSubmit={handleCreate}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tên chú rể *</label>
                  <input type="text" required value={form.groomName}
                    onChange={(e) => setForm({ ...form, groomName: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    placeholder="Nguyễn Văn A" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tên cô dâu *</label>
                  <input type="text" required value={form.brideName}
                    onChange={(e) => setForm({ ...form, brideName: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    placeholder="Trần Thị B" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ngày cưới</label>
                <input type="date" value={form.weddingDate}
                  onChange={(e) => setForm({ ...form, weddingDate: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Địa điểm</label>
                <input type="text" value={form.venueName}
                  onChange={(e) => setForm({ ...form, venueName: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  placeholder="Tên nhà hàng / khách sạn" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email nhận tài khoản (Tùy chọn)</label>
                <input type="email" value={form.clientEmail}
                  onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  placeholder="email@example.com" />
                <p className="mt-1 text-xs text-gray-500">Nếu nhập, hệ thống sẽ tự động tạo tài khoản và gửi email cho người dùng.</p>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowCreate(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                  Hủy
                </button>
                <button type="submit" disabled={loading}
                  className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-50">
                  {loading ? "Đang tạo..." : "Tạo đám cưới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}