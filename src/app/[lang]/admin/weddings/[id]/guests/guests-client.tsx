"use client";

import { useTranslation } from "@/components/i18n-provider";

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
  rsvpResponses?: {
    id: string;
    eventId: string | null;
    isAttending: boolean;
    guestCount: number;
    message: string | null;
  }[];
}

interface GuestsClientProps {
  guests: Guest[];
  timelineEvents?: { id: string; name: string }[];
  weddingId: string;
}

export default function GuestsClient({ guests: initialGuests, timelineEvents = [], weddingId }: GuestsClientProps) {
  const dict = useTranslation();
  const [search, setSearch] = useState("");
  const [sideFilter, setSideFilter] = useState(dict.admin.guests.filters.all);
  const [groupFilter, setGroupFilter] = useState(dict.admin.guests.filters.all);
  const [statusFilter, setStatusFilter] = useState(dict.admin.guests.filters.all);
  const [guests, setGuests] = useState(initialGuests);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; total: number; errors: { row: number; error: string }[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", familySide: dict.admin.guests.filters.groomSide, groupName: dict.admin.guests.filters.family, phone: "", email: "" });
  const [addLoading, setAddLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchGuests = async (pageToFetch: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/guests?weddingId=${weddingId}&page=${pageToFetch}&limit=50`);
      const json = await res.json();
      if (res.ok) {
        setGuests(json.data);
        if (json.meta) {
          setTotalPages(json.meta.totalPages);
          setPage(json.meta.page);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredGuests = guests.filter((g) => {
    if (search && !g.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (sideFilter !== dict.admin.guests.filters.all && g.familySide !== sideFilter) return false;
    if (groupFilter !== dict.admin.guests.filters.all && g.groupName !== groupFilter) return false;
    if (statusFilter === dict.admin.guests.filters.confirmed && g.isAttending !== true) return false;
    if (statusFilter === dict.admin.guests.filters.pending && g.isAttending !== null) return false;
    if (statusFilter === dict.admin.guests.filters.declined && g.isAttending !== false) return false;
    if (statusFilter === dict.admin.guests.filters.notSent && g.hasSentInvitation !== false) return false;
    return true;
  });

  const confirmed = guests.filter((g) => g.isAttending === true).length;
  const pending = guests.filter((g) => g.isAttending === null).length;
  const declined = guests.filter((g) => g.isAttending === false).length;

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !weddingId) return;

    setImporting(true);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("weddingId", weddingId);

      const res = await fetch("/api/guests/import", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Import failed");

      setImportResult(json.data);
      if (json.data.imported > 0) {
        fetchGuests(1);
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
          <h1 className="text-2xl font-bold text-gray-900">{dict.admin.guests.title}</h1>
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
            {importing ? dict.admin.guests.importing : dict.admin.guests.importExcel}
          </button>
          
          <button
            onClick={async () => {
              if (!confirm(dict.admin.guests.alerts.confirmSendAll)) return;
              try {
                const res = await fetch("/api/guests/send-invitations", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ weddingId }),
                });
                const json = await res.json();
                if (json.success) {
                  alert(dict.admin.guests.alerts.sendSuccess.replace("${sent}", json.data.sent.toString()).replace("${failed}", json.data.failed.toString()));
                } else {
                  alert(json.error);
                }
              } catch (e) {
                alert(dict.admin.guests.alerts.sendError);
              }
            }}
            className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
          >
            {dict.admin.guests.sendInvites}
          </button>
          
          <button
            onClick={async () => {
              if (!confirm(dict.admin.guests.alerts.confirmThankYou)) return;
              try {
                const res = await fetch("/api/guests/send-thank-you", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ weddingId }),
                });
                const json = await res.json();
                if (json.success) {
                  alert(`Đã gửi thành công ${json.data.sent} email. Thất bại: ${json.data.failed}`);
                } else {
                  alert(json.error);
                }
              } catch (e) {
                alert(dict.admin.guests.alerts.sendError);
              }
            }}
            className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
          >
            {dict.admin.guests.sendThankYou}
          </button>

          <button 
            onClick={() => setShowAddModal(true)}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-rose-700"
          >
            + Thêm khách
          </button>
        </div>
      </div>

      {importResult && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {dict.admin.guests.importResult} {importResult.imported}/{importResult.total} khách
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
          <p className="text-sm text-green-600">{dict.admin.guests.stats.confirmed}</p>
        </div>
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-2xl font-bold text-yellow-700">{pending}</p>
          <p className="text-sm text-yellow-600">{dict.admin.guests.stats.pending}</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-2xl font-bold text-red-700">{declined}</p>
          <p className="text-sm text-red-600">{dict.admin.guests.stats.declined}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 rounded-xl border border-gray-200 bg-white p-4">
        <input
          type="text"
          placeholder={dict.admin.guests.searchPlaceholder}
          className="min-w-[200px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm" value={sideFilter} onChange={(e) => setSideFilter(e.target.value)}>
          <option>{dict.admin.guests.filters.all}</option>
          <option>{dict.admin.guests.filters.groomSide}</option>
          <option>{dict.admin.guests.filters.brideSide}</option>
        </select>
        <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm" value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)}>
          <option>{dict.admin.guests.filters.all}</option>
          <option>{dict.admin.guests.filters.family}</option>
          <option>{dict.admin.guests.filters.friends}</option>
          <option>{dict.admin.guests.filters.colleagues}</option>
        </select>
        <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option>{dict.admin.guests.filters.all}</option>
          <option>{dict.admin.guests.stats.confirmed}</option>
          <option>{dict.admin.guests.filters.pending}</option>
          <option>{dict.admin.guests.stats.declined}</option>
          <option>{dict.admin.guests.filters.notSent}</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">{dict.admin.guests.table.name}</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">{dict.admin.guests.table.side}</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">{dict.admin.guests.table.group}</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">{dict.admin.guests.table.phone}</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">{dict.admin.guests.table.table}</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">{dict.admin.guests.table.status}</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">{dict.admin.guests.table.invite}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredGuests.map((g) => (
              <tr key={g.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">{g.name}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    g.familySide === dict.admin.guests.filters.groomSide ? "bg-blue-50 text-blue-700" : g.familySide === dict.admin.guests.filters.brideSide ? "bg-pink-50 text-pink-700" : "bg-gray-50 text-gray-500"
                  }`}>
                    {g.familySide || dict.admin.guests.table.unclassified}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{g.groupName || "-"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">{g.phone || "-"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">{g.tableNumber || "-"}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  {timelineEvents.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {timelineEvents.map(ev => {
                        const r = g.rsvpResponses?.find(res => res.eventId === ev.id);
                        if (!r) return <span key={ev.id} className="text-xs text-gray-500">• {ev.name}: <span className="text-yellow-600">{dict.admin.guests.table.pending}</span></span>;
                        return r.isAttending ? 
                          <span key={ev.id} className="text-xs font-medium text-green-700">• {ev.name}: {dict.admin.guests.table.attending} ({r.guestCount})</span> : 
                          <span key={ev.id} className="text-xs text-red-600">• {ev.name}: {dict.admin.guests.table.declined}</span>;
                      })}
                    </div>
                  ) : (
                    <>
                      {g.isAttending === true && <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">{dict.admin.guests.stats.confirmed}</span>}
                      {g.isAttending === null && <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">{dict.admin.guests.table.pending}</span>}
                      {g.isAttending === false && <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">{dict.admin.guests.stats.declined}</span>}
                    </>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {g.hasSentInvitation ? (
                    <span className="text-xs text-green-600">{dict.admin.guests.table.sent}</span>
                  ) : (
                    <span className="text-xs text-gray-400">{dict.admin.guests.table.notSent}</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredGuests.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
                  {dict.admin.guests.table.notFound}
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
            onClick={() => fetchGuests(page - 1)}
            className="rounded-lg border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
          >
            {dict.admin.guests.pagination.prev}
          </button>
          <span className="text-sm text-gray-600">{dict.admin.guests.pagination.page} {page} / {totalPages}</span>
          <button
            disabled={page === totalPages || loading}
            onClick={() => fetchGuests(page + 1)}
            className="rounded-lg border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
          >
            {dict.admin.guests.pagination.next}
          </button>
        </div>
      )}

      {/* Modal Thêm Khách */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{dict.admin.guests.addModal.title}</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">{dict.admin.guests.addModal.name}</label>
                <input type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none"
                  value={addForm.name} onChange={e => setAddForm({...addForm, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">{dict.admin.guests.table.side}</label>
                  <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none"
                    value={addForm.familySide} onChange={e => setAddForm({...addForm, familySide: e.target.value})}>
                    <option value={dict.admin.guests.filters.groomSide}>{dict.admin.guests.filters.groomSide}</option>
                    <option value={dict.admin.guests.filters.brideSide}>{dict.admin.guests.filters.brideSide}</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">{dict.admin.guests.table.group}</label>
                  <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none"
                    value={addForm.groupName} onChange={e => setAddForm({...addForm, groupName: e.target.value})}>
                    <option value={dict.admin.guests.filters.family}>{dict.admin.guests.filters.family}</option>
                    <option value={dict.admin.guests.filters.friends}>{dict.admin.guests.filters.friends}</option>
                    <option value={dict.admin.guests.filters.colleagues}>{dict.admin.guests.filters.colleagues}</option>
                    <option value={dict.admin.guests.filters.others}>{dict.admin.guests.filters.others}</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">{dict.admin.guests.addModal.phone}</label>
                  <input type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none"
                    value={addForm.phone} onChange={e => setAddForm({...addForm, phone: e.target.value})} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">{dict.admin.guests.addModal.email}</label>
                  <input type="email" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none"
                    value={addForm.email} onChange={e => setAddForm({...addForm, email: e.target.value})} />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={() => setShowAddModal(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                {dict.common.cancel}
              </button>
              <button 
                disabled={!addForm.name || addLoading}
                onClick={async () => {
                  setAddLoading(true);
                  try {
                    const res = await fetch("/api/guests", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ ...addForm, weddingId })
                    });
                    if (res.ok) {
                      setShowAddModal(false);
                      setAddForm({ name: "", familySide: dict.admin.guests.filters.groomSide, groupName: dict.admin.guests.filters.family, phone: "", email: "" });
                      fetchGuests(1);
                    } else {
                      const json = await res.json();
                      alert(json.error || dict.admin.guests.alerts.addError);
                    }
                  } finally {
                    setAddLoading(false);
                  }
                }}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {addLoading ? dict.admin.guests.addModal.saving : dict.admin.guests.addModal.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}