"use client";

import { useState } from "react";

interface Wish {
  id: string;
  guestName: string;
  phone: string | null;
  content: string;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export default function WishesClient({
  wishes: initial,
  weddingId,
}: {
  wishes: Wish[];
  weddingId: string;
}) {
  const [wishes, setWishes] = useState(initial);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchWishes = async (pageToFetch: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/wishes?weddingId=${weddingId}&page=${pageToFetch}&limit=50`);
      const json = await res.json();
      if (res.ok) {
        setWishes(json.data);
        if (json.meta) {
          setTotalPages(json.meta.totalPages);
          setPage(json.meta.page);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleApproved = async (id: string, current: boolean) => {
    setLoadingId(id);
    try {
      const res = await fetch("/api/wishes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isApproved: !current }),
      });
      if (res.ok) {
        setWishes((prev) =>
          prev.map((w) => (w.id === id ? { ...w, isApproved: !current } : w))
        );
      }
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lời chúc</h1>
          <p className="mt-1 text-sm text-gray-500">Quản lý lời chúc từ khách mời</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Khách</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Nội dung</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Ngày</th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {wishes.map((w) => (
              <tr key={w.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{w.guestName}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{w.content}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{new Date(w.createdAt).toLocaleDateString("vi-VN")}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    disabled={loadingId === w.id}
                    onClick={() => toggleApproved(w.id, w.isApproved)}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      w.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    } disabled:opacity-50`}
                  >
                    {w.isApproved ? "Đã duyệt" : "Chưa duyệt"}
                  </button>
                </td>
              </tr>
            ))}
            {wishes.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">
                  Chưa có lời chúc nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            disabled={page === 1 || loading}
            onClick={() => fetchWishes(page - 1)}
            className="rounded-lg border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
          >
            Trước
          </button>
          <span className="text-sm text-gray-600">Trang {page} / {totalPages}</span>
          <button
            disabled={page === totalPages || loading}
            onClick={() => fetchWishes(page + 1)}
            className="rounded-lg border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
