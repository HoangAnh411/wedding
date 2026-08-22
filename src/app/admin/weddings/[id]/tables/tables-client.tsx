"use client";

import { useState } from "react";

interface Table {
  id: string;
  weddingId: string;
  tableNumber: number;
  tableName: string | null;
  capacity: number;
  isHeadTable: boolean;
  guests: string[];
}

export default function TablesClient({
  tables: initial,
  weddingId,
}: {
  tables: Table[];
  weddingId: string;
}) {
  const [tables, setTables] = useState(initial);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ weddingId: weddingId, tableNumber: "", tableName: "", capacity: "10" });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tableNumber: parseInt(form.tableNumber), capacity: parseInt(form.capacity) }),
      });
      if (res.ok) {
        const { data } = await res.json();
        setTables((prev) => [...prev, { ...data, guests: [] }]);
        setShowAdd(false);
        setForm({ weddingId: weddingId, tableNumber: "", tableName: "", capacity: "10" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa bàn này?")) return;
    await fetch(`/api/tables/${id}`, { method: "DELETE" });
    setTables((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sơ đồ bàn</h1>
          <p className="mt-1 text-sm text-gray-500">Sắp xếp chỗ ngồi cho khách mời</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700">+ Thêm bàn</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tables.map((t) => (
          <div key={t.id} className={`rounded-xl border p-5 ${t.isHeadTable ? "border-rose-300 bg-rose-50" : "border-gray-200 bg-white"}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Bàn {t.tableNumber}</h3>
              <div className="flex items-center gap-2">
                {t.isHeadTable && <span className="rounded-full bg-rose-200 px-2 py-0.5 text-xs font-medium text-rose-800">Cỗ VIP</span>}
                <button onClick={() => handleDelete(t.id)} className="text-xs text-gray-300 hover:text-red-500">✕</button>
              </div>
            </div>
            {t.tableName && <p className="mt-1 text-sm text-gray-500">{t.tableName}</p>}
            <p className="mt-1 text-xs text-gray-400">Sức chứa: {t.capacity} người</p>
            {t.guests.length > 0 && (
              <div className="mt-3 space-y-1">
                {t.guests.map((name, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-md bg-gray-50 px-2 py-1 text-sm text-gray-700">
                    <span className="text-xs">👤</span> {name}
                  </div>
                ))}
              </div>
            )}
            {t.guests.length === 0 && <p className="mt-3 text-xs italic text-gray-400">Chưa có khách</p>}
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="mx-4 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">Thêm bàn</h2>
            <form onSubmit={handleAdd} className="mt-4 space-y-4">

              <div className="grid grid-cols-2 gap-4">
                <input type="number" required placeholder="Số bàn" value={form.tableNumber} onChange={(e) => setForm({ ...form, tableNumber: e.target.value })}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                <input type="number" placeholder="Sức chứa" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <input type="text" placeholder="Tên bàn (VD: Bàn gia đình)" value={form.tableName} onChange={(e) => setForm({ ...form, tableName: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
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