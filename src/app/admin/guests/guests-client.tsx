"use client";

import { useState, useRef } from "react";

interface Guest {
  id: string;
  weddingId: string;
  familySide: string | null;
  name: string;
  phone: string | null;
  email: string | null;
  groupName: string | null;
  inviteCode: string | null;
  tableNumber: number | null;
  isAttending: boolean | null;
  plusOne: boolean;
  plusOneName: string | null;
  mealChoice: string | null;
  dietaryRestrictions: string | null;
  hasSentInvitation: boolean;
  hasOpenedInvitation: boolean;
  rsvpAt: string | null;
  thankYouSent: boolean;
}

interface GuestsClientProps {
  guests: Guest[];
  weddings: { id: string; groomName: string; brideName: string }[];
}

export default function GuestsClient({ guests: initialGuests, weddings }: GuestsClientProps) {
  const [search, setSearch] = useState("");
  const [sideFilter, setSideFilter] = useState("Tất cả");
  const [groupFilter, setGroupFilter] = useState("Tất cả");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [guests, setGuests] = useState(initialGuests);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; total: number; errors: { row: number; error: string }[] } | null>(null);
  const [importWeddingId, setImportWeddingId] = useState(weddings[0]?.id || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredGuests = guests.filter((g) => {
    if (search && !g.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (sideFilter !== "Tất cả" && g.familySide !== sideFilter) return false;
    if (groupFilter !== "Tất cả" && g.groupName !== groupFilter) return false;
    if (statusFilter === "Đã xác nhận" && g.isAttending !== true) return false;
    if (statusFilter === "Chưa xác nhận" && g.isAttending !== null) return false;
    if (statusFilter === "Từ chối" && g.isAttending !== false) return false;
    if (statusFilter === "Chưa gửi thiệp" && g.hasSentInvitation !== false) return false;
    return true;
  });

  const confirmed = guests.filter((g) => g.isAttending === true).length;
  const pending = guests.filter((g) => g.isAttending === null).length;
  const declined = guests.filter((g) => g.isAttending === false).length;

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !importWeddingId) return;

    setImporting(true);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("weddingId", importWeddingId);

      const res = await fetch("/api/guests/import", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Import failed");

      setImportResult(json.data);
      if (json.data.imported > 0) {
        const newGuests = await fetch("/api/guests?weddingId=" + importWeddingId).then((r) => r.json());
        setGuests(newGuests.data || []);
      }
    } catch (err) {
      setImportResult({
        imported: 0,
        total: 0,
        errors: [{ row: 0, error: err instanceof Error ? err.message : "Lỗi import" }],
      });
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Khách mời</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý danh sách khách mời
          </p>
        </div>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleImport}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            {importing ? "Đang import..." : "📥 Import Excel"}
          </button>
          <button className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-rose-700">
            + Thêm khách
          </button>
        </div>
      </div>

      {importResult && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Kết quả import: {importResult.imported}/{importResult.total} khách
              </p>
              {importResult.errors.length > 0 && (
                <p className="mt-1 text-xs text-red-500">
                  {importResult.errors.length} lỗi
                </p>
              )}
            </div>
            <button
              onClick={() => setImportResult(null)}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          {importResult.errors.length > 0 && (
            <div className="mt-2 max-h-32 overflow-y-auto">
              {importResult.errors.map((e, i) => (
                <p key={i} className="text-xs text-red-500">
                  Dòng {e.row}: {e.error}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-2xl font-bold text-green-700">{confirmed}</p>
          <p className="text-sm text-green-600">Đã xác nhận</p>
        </div>
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-2xl font-bold text-yellow-700">{pending}</p>
          <p className="text-sm text-yellow-600">Chờ xác nhận</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-2xl font-bold text-red-700">{declined}</p>
          <p className="text-sm text-red-600">Từ chối</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 rounded-xl border border-gray-200 bg-white p-4">
        <input
          type="text"
          placeholder="Tìm kiếm khách mời..."
          className="min-w-[200px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm" value={sideFilter} onChange={(e) => setSideFilter(e.target.value)}>
          <option>Tất cả</option>
          <option>Nhà trai</option>
          <option>Nhà gái</option>
        </select>
        <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm" value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)}>
          <option>Tất cả</option>
          <option>Gia đình</option>
          <option>Bạn bè</option>
          <option>Đồng nghiệp</option>
        </select>
        <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option>Tất cả</option>
          <option>Đã xác nhận</option>
          <option>Chưa xác nhận</option>
          <option>Từ chối</option>
          <option>Chưa gửi thiệp</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Tên</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Phân loại</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Nhóm</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">SĐT</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Bàn</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Trạng thái</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Thiệp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredGuests.map((g) => (
              <tr key={g.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">{g.name}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    g.familySide === "Nhà trai" ? "bg-blue-50 text-blue-700" : g.familySide === "Nhà gái" ? "bg-pink-50 text-pink-700" : "bg-gray-50 text-gray-500"
                  }`}>
                    {g.familySide || "Chưa phân loại"}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{g.groupName || "-"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">{g.phone || "-"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">{g.tableNumber || "-"}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  {g.isAttending === true && <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">Đã xác nhận</span>}
                  {g.isAttending === null && <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">Chờ</span>}
                  {g.isAttending === false && <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">Từ chối</span>}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {g.hasSentInvitation ? (
                    <span className="text-xs text-green-600">✅ Đã gửi</span>
                  ) : (
                    <span className="text-xs text-gray-400">⏳ Chưa gửi</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredGuests.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
                  Không tìm thấy khách mời nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}