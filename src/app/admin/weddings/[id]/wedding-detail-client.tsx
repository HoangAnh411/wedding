"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface WeddingDetail {
  id: string;
  slug: string;
  groomName: string;
  brideName: string;
  weddingDate: string | null;
  venueName: string | null;
  venueAddress: string | null;
  story: string | null;
  guestCount: number;
  vendorCount: number;
  confirmedCount: number;
  _count: { guests: number; vendors: number; checklistItems: number; tables: number; moneyGifts: number };
  timelineEvents: { id: string; name: string; eventType: string | null; eventDate: string | null; eventTime: string | null; location: string | null }[];
  paymentConfigs: { id: string; gatewayType: string; bankName: string | null; accountNumber: string | null; accountName: string | null }[];
}

export default function WeddingDetailClient({ wedding: initial }: { wedding: WeddingDetail }) {
  const params = useParams();
  const [origin, setOrigin] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [wedding, setWedding] = useState(initial);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailResult, setEmailResult] = useState<{ sent: number; failed: number; results: { name: string; success: boolean; message: string }[] } | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const invitationUrl = origin ? `${origin}/${wedding.slug}` : `/${wedding.slug}`;

  const tabs = [
    { id: "overview", label: "Tổng quan" },
    { id: "info", label: "Thông tin" },
    { id: "send", label: "Gửi thiệp" },
    { id: "preview", label: "Xem trước" },
  ];

  const handleSendAllEmail = async () => {
    if (!confirm("Gửi thiệp cho tất cả khách chưa nhận thiệp?")) return;

    setSendingEmail(true);
    setEmailResult(null);

    try {
      const res = await fetch("/api/guests/send-invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weddingId: wedding.id }),
      });
      const json = await res.json();
      if (json.data) {
        setEmailResult(json.data);
      }
    } catch (err) {
      setEmailResult({
        sent: 0,
        failed: 1,
        results: [{ name: "", success: false, message: "Lỗi kết nối" }],
      });
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/weddings" className="text-sm text-rose-600 hover:text-rose-700">
            ← Quay lại
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            {wedding.groomName} & {wedding.brideName}
          </h1>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 pb-3 text-sm font-medium transition ${
                activeTab === tab.id ? "border-rose-600 text-rose-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-500">Khách mời</p>
            <p className="text-2xl font-bold text-gray-900">{wedding._count.guests}</p>
          </div>
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="text-sm text-green-600">Đã xác nhận</p>
            <p className="text-2xl font-bold text-green-700">{wedding.confirmedCount}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-500">Nhà cung cấp</p>
            <p className="text-2xl font-bold text-gray-900">{wedding._count.vendors}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-500">Ngày cưới</p>
            <p className="text-xl font-bold text-gray-900">
              {wedding.weddingDate ? new Date(wedding.weddingDate).toLocaleDateString("vi-VN") : "Chưa có"}
            </p>
          </div>
        </div>
      )}

      {activeTab === "info" && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-500">Tên chú rể</label>
              <p className="mt-1 text-gray-900">{wedding.groomName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Tên cô dâu</label>
              <p className="mt-1 text-gray-900">{wedding.brideName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Ngày cưới</label>
              <p className="mt-1 text-gray-900">{wedding.weddingDate ? new Date(wedding.weddingDate).toLocaleDateString("vi-VN") : "Chưa có"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Địa điểm</label>
              <p className="mt-1 text-gray-900">{wedding.venueName || "Chưa có"}</p>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-500">Địa chỉ</label>
              <p className="mt-1 text-gray-900">{wedding.venueAddress || "Chưa có"}</p>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-500">Link thiệp cưới</label>
              <div className="mt-1 flex items-center gap-2">
                <input type="text" readOnly value={invitationUrl} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600" />
                <button onClick={() => navigator.clipboard.writeText(invitationUrl)} className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200">Copy</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "send" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900">Gửi thiệp qua Email</h3>
            <p className="mt-1 text-sm text-gray-500">Gửi thiệp mời đến email của khách</p>
            <button
              onClick={handleSendAllEmail}
              disabled={sendingEmail}
              className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
            >
              {sendingEmail ? "Đang gửi..." : "Gửi cho tất cả khách chưa nhận thiệp"}
            </button>
            {emailResult && (
              <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-900">
                  Đã gửi: {emailResult.sent} / Thất bại: {emailResult.failed}
                </p>
                {emailResult.results.filter((r) => !r.success).length > 0 && (
                  <div className="mt-2 max-h-40 overflow-y-auto">
                    {emailResult.results.filter((r) => !r.success).map((r, i) => (
                      <p key={i} className="text-xs text-red-500">
                        {r.name}: {r.message}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900">Gửi thiệp qua Zalo</h3>
            <p className="mt-1 text-sm text-gray-500">Gửi thông báo thiệp cưới qua Zalo OA</p>
            <button className="mt-4 rounded-lg border border-rose-300 bg-white px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50">Gửi qua Zalo</button>
          </div>
        </div>
      )}

      {activeTab === "preview" && (
        <div className="text-center">
          <p className="mb-4 text-sm text-gray-500">Xem trước thiệp cưới trên thiết bị di động</p>
          <div className="mx-auto max-w-sm overflow-hidden rounded-3xl border-4 border-gray-800 shadow-xl">
            <div className="aspect-[9/16] bg-gradient-to-b from-rose-900 to-rose-500 p-4">
              <div className="flex h-full items-center justify-center text-center text-white">
                <div>
                  <p className="text-sm text-rose-200">Wedding Invitation</p>
                  <p className="mt-2 font-serif text-2xl font-bold">{wedding.groomName}</p>
                  <p className="text-rose-200">&</p>
                  <p className="font-serif text-2xl font-bold">{wedding.brideName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}