"use client";

import { useState } from "react";

interface PaymentConfig {
  id: string;
  gatewayType: string;
  accountNumber: string | null;
  accountName: string | null;
  bankName: string | null;
  qrCodeUrl: string | null;
  isActive: boolean;
}

export default function PaymentClient({
  configs: initialConfigs,
  weddingId,
}: {
  configs: PaymentConfig[];
  weddingId: string;
}) {
  const [configs, setConfigs] = useState(initialConfigs);
  const [loading, setLoading] = useState(false);
  
  const bankConfig = configs.find(c => c.gatewayType === "BANK_TRANSFER") || {
    gatewayType: "BANK_TRANSFER",
    accountNumber: "",
    accountName: "",
    bankName: "",
    qrCodeUrl: "",
    isActive: true as boolean,
  };

  const [form, setForm] = useState(bankConfig);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, weddingId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Lỗi lưu cấu hình");
      
      setConfigs(prev => {
        const idx = prev.findIndex(c => c.gatewayType === form.gatewayType);
        if (idx >= 0) {
          const newConfigs = [...prev];
          newConfigs[idx] = json.data;
          return newConfigs;
        }
        return [...prev, json.data];
      });
      setMessage({ type: "success", text: "Lưu cấu hình thành công" });
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Có lỗi xảy ra" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cấu hình thanh toán</h1>
        <p className="mt-1 text-sm text-gray-500">Thiết lập tài khoản nhận tiền mừng (QR code, chuyển khoản)</p>
      </div>

      {message && (
        <div className={`rounded-lg p-4 text-sm ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message.text}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Chuyển khoản ngân hàng</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngân hàng</label>
              <input type="text" value={form.bankName || ""} onChange={e => setForm({ ...form, bankName: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="VD: Vietcombank" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số tài khoản</label>
              <input type="text" value={form.accountNumber || ""} onChange={e => setForm({ ...form, accountNumber: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Số tài khoản" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên chủ tài khoản</label>
              <input type="text" value={form.accountName || ""} onChange={e => setForm({ ...form, accountName: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="VD: NGUYEN VAN A" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Mã QR</label>
              <input type="text" value={form.qrCodeUrl || ""} onChange={e => setForm({ ...form, qrCodeUrl: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="https://..." />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
            <label htmlFor="isActive" className="text-sm text-gray-700">Kích hoạt phương thức này</label>
          </div>
          <div className="pt-4 flex justify-end">
            <button type="submit" disabled={loading} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50">
              {loading ? "Đang lưu..." : "Lưu cấu hình"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
