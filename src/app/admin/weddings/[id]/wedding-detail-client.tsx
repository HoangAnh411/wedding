"use client";

import { useState, useEffect } from "react";
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
}

export default function WeddingDetailClient({ wedding }: { wedding: WeddingDetail }) {
  const [origin, setOrigin] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailResult, setEmailResult] = useState<{ sent: number; failed: number; results: { name: string; success: boolean; message: string }[] } | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const invitationUrl = origin ? `${origin}/${wedding.slug}` : `/${wedding.slug}`;

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(invitationUrl);
    alert("Đã copy link!");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-rose-600 to-pink-600 p-8 md:p-10 text-white shadow-xl">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-rose-400 opacity-20 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-rose-100 font-medium tracking-wider text-sm uppercase mb-2">Đám cưới của</p>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 drop-shadow-md">
                {wedding.groomName} <span className="text-rose-200 font-light">&</span> {wedding.brideName}
              </h1>
              
              <div className="flex flex-wrap gap-4 text-sm font-medium">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {wedding.weddingDate ? new Date(wedding.weddingDate).toLocaleDateString("vi-VN") : "Chưa xác định"}
                </div>
                {wedding.venueName && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {wedding.venueName}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 px-5 py-3 text-sm font-semibold transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Link Thiệp
              </button>
              <button 
                onClick={handleSendAllEmail}
                disabled={sendingEmail}
                className="flex items-center gap-2 rounded-xl bg-white text-rose-600 hover:bg-rose-50 px-5 py-3 text-sm font-bold shadow-sm transition-all duration-300 disabled:opacity-70"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                {sendingEmail ? "Đang gửi..." : "Gửi Thiệp Mời"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {emailResult && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="font-medium text-gray-900">Kết quả gửi email thiệp mời:</p>
          <div className="mt-2 flex gap-4 text-sm">
            <span className="text-green-600 font-medium">Thành công: {emailResult.sent}</span>
            <span className="text-red-600 font-medium">Thất bại: {emailResult.failed}</span>
          </div>
          {emailResult.results.filter((r) => !r.success).length > 0 && (
            <div className="mt-4 max-h-40 overflow-y-auto space-y-2 border-t border-gray-100 pt-3">
              {emailResult.results.filter((r) => !r.success).map((r, i) => (
                <p key={i} className="text-sm text-red-500">
                  <span className="font-medium">{r.name || "Khách"}:</span> {r.message}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatsCard 
          title="Tổng khách mời" 
          value={wedding._count.guests} 
          icon="👥"
          bgClass="bg-blue-50 text-blue-600"
          borderClass="border-blue-100"
          href={`/admin/weddings/${wedding.id}/guests`}
        />
        <StatsCard 
          title="Đã xác nhận" 
          value={wedding.confirmedCount} 
          icon="✅"
          bgClass="bg-green-50 text-green-600"
          borderClass="border-green-100"
          href={`/admin/weddings/${wedding.id}/guests?status=confirmed`}
        />
        <StatsCard 
          title="Bàn tiệc" 
          value={wedding._count.tables} 
          icon="🪑"
          bgClass="bg-orange-50 text-orange-600"
          borderClass="border-orange-100"
          href={`/admin/weddings/${wedding.id}/tables`}
        />
        <StatsCard 
          title="Công việc" 
          value={wedding._count.checklistItems} 
          icon="📋"
          bgClass="bg-purple-50 text-purple-600"
          borderClass="border-purple-100"
          href={`/admin/weddings/${wedding.id}/checklist`}
        />
        <StatsCard 
          title="Nhà cung cấp" 
          value={wedding._count.vendors} 
          icon="🤝"
          bgClass="bg-indigo-50 text-indigo-600"
          borderClass="border-indigo-100"
          href={`/admin/weddings/${wedding.id}/vendors`}
        />
        <StatsCard 
          title="Quà mừng" 
          value={wedding._count.moneyGifts} 
          icon="🎁"
          bgClass="bg-rose-50 text-rose-600"
          borderClass="border-rose-100"
          href={`/admin/weddings/${wedding.id}/money-gifts`}
        />
      </div>

      {/* Quick Access Menu */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          Truy cập nhanh
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <QuickLink href={`/admin/weddings/${wedding.id}/guests`} icon="👥" label="Khách mời" />
          <QuickLink href={`/admin/weddings/${wedding.id}/tables`} icon="🪑" label="Bàn tiệc" />
          <QuickLink href={`/admin/weddings/${wedding.id}/budget`} icon="💰" label="Ngân sách" />
          <QuickLink href={`/admin/weddings/${wedding.id}/checklist`} icon="📋" label="Công việc" />
          <QuickLink href={`/admin/weddings/${wedding.id}/vendors`} icon="🤝" label="Nhà cung cấp" />
          <QuickLink href={`/admin/weddings/${wedding.id}/gallery`} icon="🖼️" label="Thư viện ảnh" />
          <QuickLink href={`/admin/weddings/${wedding.id}/music`} icon="🎵" label="Nhạc nền" />
          <QuickLink href={`/admin/weddings/${wedding.id}/wishes`} icon="💌" label="Lời chúc" />
          <QuickLink href={`/admin/weddings/${wedding.id}/money-gifts`} icon="🎁" label="Mừng cưới" />
          <QuickLink href={`/admin/weddings/${wedding.id}/checkin`} icon="📷" label="Check-in" />
          <QuickLink href={`/admin/weddings/${wedding.id}/payment`} icon="💳" label="Thanh toán" />
          <QuickLink href={`/admin/weddings/${wedding.id}/settings`} icon="⚙️" label="Cài đặt" />
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, bgClass, borderClass, href }: any) {
  return (
    <Link href={href} className={`group block rounded-2xl border ${borderClass} bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${bgClass}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">{title}</p>
        <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </Link>
  );
}

function QuickLink({ href, icon, label }: any) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-6 transition-all hover:bg-rose-50 hover:border-rose-100 hover:text-rose-600 hover:shadow-sm group">
      <span className="text-3xl group-hover:scale-110 transition-transform">{icon}</span>
      <span className="text-sm font-medium text-gray-600 group-hover:text-rose-600 text-center">{label}</span>
    </Link>
  );
}