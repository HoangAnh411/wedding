"use client";

import { useState } from "react";

interface CheckIn {
  id: string;
  guestName: string;
  tableNumber: number | null;
  checkedInAt: string;
}

export default function CheckinClient({
  checkins: initial,
  totalGuests,
}: {
  checkins: CheckIn[];
  totalGuests: number;
  weddingId: string;
}) {
  const [checkins] = useState(initial);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Check-in</h1>
          <p className="mt-1 text-sm text-gray-500">QR check-in khách mời tại tiệc cưới</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-600">Đã check-in</p>
          <p className="text-2xl font-bold text-green-600">{checkins.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Tổng khách</p>
          <p className="text-2xl font-bold text-gray-900">{totalGuests}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Chưa đến</p>
          <p className="text-2xl font-bold text-yellow-600">{totalGuests - checkins.length}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Khách mời</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Bàn</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Giờ check-in</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {checkins.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{c.guestName}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{c.tableNumber ? `Bàn ${c.tableNumber}` : "-"}</td>
                <td className="px-4 py-3 text-sm text-green-600">✅ {new Date(c.checkedInAt).toLocaleString("vi-VN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}