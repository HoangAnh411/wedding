"use client";

import { useState } from "react";
import { Countdown } from "@/components/public/countdown";
import { ImageLightbox } from "@/components/public/image-lightbox";
import { MusicPlayer } from "@/components/public/music-player";
import { SectionHeader } from "@/components/ui/section-header";

interface WeddingData {
  id: string;
  slug: string;
  groomName: string;
  brideName: string;
  weddingDate: string | null;
  engagementDate: string | null;
  ceremonyDate: string | null;
  receptionDate: string | null;
  story: string | null;
  venueName: string | null;
  venueAddress: string | null;
  venueLat: number | null;
  venueLng: number | null;
  coverImage: string | null;
  galleryEnabled: boolean;
  musicEnabled: boolean;
  rsvpEnabled: boolean;
  wishesEnabled: boolean;
  timelineEvents: {
    id: string;
    name: string;
    eventType: string | null;
    eventDate: string | null;
    eventTime: string | null;
    location: string | null;
    outfitDescription: string | null;
    orderIndex: number;
  }[];
  galleryImages: {
    id: string;
    imageUrl: string;
    thumbnailUrl: string | null;
    caption: string | null;
    isVideo: boolean;
    orderIndex: number;
  }[];
  musicTracks: {
    id: string;
    title: string;
    artist: string | null;
    url: string;
    coverUrl: string | null;
    isDefault: boolean;
  }[];
  wishes: {
    id: string;
    guestName: string;
    content: string;
    createdAt: string;
  }[];
  paymentConfigs: {
    id: string;
    gatewayType: string;
    bankName: string | null;
    accountNumber: string | null;
    accountName: string | null;
    qrCodeUrl: string | null;
  }[];
}

export default function InvitationClient({ wedding }: { wedding: WeddingData }) {
  const [isOpen, setIsOpen] = useState(false);

  // RSVP form state
  const [rsvpForm, setRsvpForm] = useState({ name: "", phone: "", status: "Sẽ tham dự", guestCount: "1" });
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [rsvpError, setRsvpError] = useState("");

  // Wishes form state
  const [wishForm, setWishForm] = useState({ guestName: "", content: "" });
  const [wishLoading, setWishLoading] = useState(false);
  const [wishSuccess, setWishSuccess] = useState(false);
  const [wishError, setWishError] = useState("");
  const [wishes, setWishes] = useState(wedding.wishes);

  if (!isOpen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-800 via-rose-600 to-rose-800">
        <button
          onClick={() => setIsOpen(true)}
          className="group text-center transition-transform hover:scale-105"
        >
          <div className="mx-auto mb-6 flex h-40 w-40 items-center justify-center rounded-full border-4 border-rose-300 bg-white/10 backdrop-blur-sm">
            <span className="text-6xl">💌</span>
          </div>
          <h1 className="font-serif text-4xl font-bold text-white">
            {wedding.groomName} <span className="text-rose-300">&</span> {wedding.brideName}
          </h1>
          <p className="mt-4 text-lg text-rose-200">Mở thiệp cưới</p>
          <div className="mt-2 animate-bounce text-2xl text-rose-200">↓</div>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative flex min-h-[80vh] items-center justify-center bg-gradient-to-b from-rose-900 via-rose-700 to-rose-500">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 px-4 text-center text-white">
          <p className="mb-4 text-sm tracking-widest uppercase text-rose-200">Wedding Invitation</p>
          <h1 className="font-serif text-5xl font-bold sm:text-7xl">{wedding.groomName}</h1>
          <p className="my-4 text-3xl text-rose-200">⚘</p>
          <h1 className="font-serif text-5xl font-bold sm:text-7xl">{wedding.brideName}</h1>
          <div className="mx-auto mt-8 max-w-md">
            <p className="text-lg text-rose-100">Cùng sự hiện diện của gia đình và bạn bè</p>
          </div>
          <p className="mt-6 text-sm text-rose-200">
            {wedding.weddingDate
              ? new Date(wedding.weddingDate).toLocaleDateString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Sắp diễn ra"}
          </p>
        </div>
      </section>

      {/* Countdown */}
      {wedding.weddingDate && (
        <section className="bg-rose-50 py-12">
          <div className="mx-auto max-w-4xl px-4">
            <Countdown targetDate={wedding.weddingDate} />
          </div>
        </section>
      )}

      {/* Our Story */}
      {wedding.story && (
        <section className="py-16">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <SectionHeader title="Câu chuyện của chúng mình" />
            <p className="mt-6 leading-relaxed text-gray-600">{wedding.story}</p>
          </div>
        </section>
      )}

      {/* Events Timeline */}
      {wedding.timelineEvents.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-2xl px-4">
            <SectionHeader title="Sự kiện" />
            <div className="mt-8 space-y-6">
              {wedding.timelineEvents.map((event, i) => (
                <div key={event.id} className="relative flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-600 text-sm font-bold text-white">
                      {i + 1}
                    </div>
                    {i < wedding.timelineEvents.length - 1 && <div className="mt-2 h-full w-0.5 bg-rose-200" />}
                  </div>
                  <div className="mb-8 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {event.eventDate && new Date(event.eventDate).toLocaleDateString("vi-VN")}
                      {event.eventTime && ` - ${event.eventTime}`}
                    </p>
                    {event.location && <p className="text-sm text-gray-500">{event.location}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {wedding.galleryEnabled && wedding.galleryImages.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4">
            <SectionHeader title="Album ảnh" />
            <ImageLightbox
              images={wedding.galleryImages.map((img) => ({
                id: img.id,
                imageUrl: img.imageUrl,
                caption: img.caption,
              }))}
            />
          </div>
        </section>
      )}

      {/* RSVP */}
      {wedding.rsvpEnabled && (
        <section className="bg-rose-50 py-16">
          <div className="mx-auto max-w-lg px-4">
            <SectionHeader title="Xác nhận tham dự" />
            {rsvpSuccess ? (
              <div className="mt-8 rounded-xl bg-green-50 p-6 text-center">
                <p className="text-lg font-medium text-green-800">✅ Cảm ơn bạn đã xác nhận!</p>
                <p className="mt-1 text-sm text-green-600">Chúng mình rất mong được đón tiếp bạn.</p>
              </div>
            ) : (
              <form className="mt-8 space-y-4" onSubmit={async (e) => {
                e.preventDefault();
                setRsvpLoading(true);
                setRsvpError("");
                try {
                  const res = await fetch("/api/rsvp", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      weddingId: wedding.id,
                      guestId: "pending",
                      isAttending: rsvpForm.status !== "Xin lỗi không thể",
                      guestCount: parseInt(rsvpForm.guestCount),
                      message: rsvpForm.name,
                    }),
                  });
                  if (!res.ok) throw new Error("Failed to submit");
                  setRsvpSuccess(true);
                } catch {
                  setRsvpError("Có lỗi xảy ra, vui lòng thử lại");
                }
                setRsvpLoading(false);
              }}>
                {rsvpError && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{rsvpError}</div>}
                <input
                  type="text" placeholder="Họ và tên *" required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  value={rsvpForm.name}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="tel" placeholder="Số điện thoại"
                    className="rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    value={rsvpForm.phone}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, phone: e.target.value })}
                  />
                  <select
                    className="rounded-lg border border-gray-300 px-4 py-3 text-sm"
                    value={rsvpForm.status}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, status: e.target.value })}
                  >
                    <option>Sẽ tham dự</option>
                    <option>Có thể tham dự</option>
                    <option>Xin lỗi không thể</option>
                  </select>
                </div>
                <select
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                  value={rsvpForm.guestCount}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, guestCount: e.target.value })}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>Số lượng: {n} người</option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={rsvpLoading}
                  className="w-full rounded-lg bg-rose-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-50"
                >
                  {rsvpLoading ? "Đang gửi..." : "Gửi xác nhận"}
                </button>
              </form>
            )}
          </div>
        </section>
      )}

      {/* Wishes */}
      {wedding.wishesEnabled && (
        <section className="py-16">
          <div className="mx-auto max-w-lg px-4">
            <SectionHeader title="Lời chúc" />
            <div className="mt-8 space-y-4">
              {wishes.map((w) => (
                <div key={w.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">"{w.content}"</p>
                  <p className="mt-2 text-xs font-medium text-rose-600">— {w.guestName}</p>
                </div>
              ))}
              {wishes.length === 0 && (
                <p className="text-center text-sm text-gray-400">Chưa có lời chúc nào. Hãy là người đầu tiên!</p>
              )}
            </div>
            {wishSuccess ? (
              <div className="mt-6 rounded-xl bg-green-50 p-6 text-center">
                <p className="text-sm font-medium text-green-800">✅ Cảm ơn bạn đã gửi lời chúc!</p>
              </div>
            ) : (
              <form className="mt-6 space-y-4" onSubmit={async (e) => {
                e.preventDefault();
                setWishLoading(true);
                setWishError("");
                try {
                  const res = await fetch("/api/wishes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      weddingId: wedding.id,
                      guestName: wishForm.guestName,
                      content: wishForm.content,
                    }),
                  });
                  if (!res.ok) throw new Error("Failed to submit");
                  setWishSuccess(true);
                  setWishes((prev) => [...prev, { id: "temp", guestName: wishForm.guestName, content: wishForm.content, createdAt: new Date().toISOString() }]);
                } catch {
                  setWishError("Có lỗi xảy ra, vui lòng thử lại");
                }
                setWishLoading(false);
              }}>
                {wishError && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{wishError}</div>}
                <input
                  type="text" placeholder="Tên của bạn *" required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  value={wishForm.guestName}
                  onChange={(e) => setWishForm({ ...wishForm, guestName: e.target.value })}
                />
                <textarea
                  placeholder="Lời chúc của bạn *" required rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  value={wishForm.content}
                  onChange={(e) => setWishForm({ ...wishForm, content: e.target.value })}
                />
                <button
                  type="submit"
                  disabled={wishLoading}
                  className="w-full rounded-lg border border-rose-300 bg-white px-6 py-3 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                >
                  {wishLoading ? "Đang gửi..." : "Gửi lời chúc"}
                </button>
              </form>
            )}
          </div>
        </section>
      )}

      {/* Map */}
      {wedding.venueName && (
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <SectionHeader title="Bản đồ chỉ đường" />
            <p className="mt-4 text-gray-600">{wedding.venueName}</p>
            {wedding.venueAddress && <p className="text-sm text-gray-500">{wedding.venueAddress}</p>}
            <div className="mt-6 flex justify-center gap-4">
              <a
                href={`https://www.google.com/maps?q=${wedding.venueLat || 0},${wedding.venueLng || 0}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-rose-700"
              >
                📍 Mở Google Maps
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Bank Info */}
      {wedding.paymentConfigs.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-lg px-4 text-center">
            <SectionHeader title="Mừng cưới" />
            <p className="mt-4 text-sm text-gray-500">
              Sự hiện diện của bạn là món quà quý giá nhất. Nếu có lòng, bạn có thể gửi mừng cưới qua:
            </p>
            {wedding.paymentConfigs.map((p) => (
              <div key={p.id} className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-6">
                <p className="font-medium text-gray-900">{p.bankName}</p>
                <p className="mt-2 text-lg font-bold text-rose-600">{p.accountNumber}</p>
                <p className="text-sm text-gray-500">{p.accountName}</p>
                {p.qrCodeUrl && <img src={p.qrCodeUrl} alt="QR" className="mx-auto mt-4 h-40 w-40" />}
                <button
                  onClick={() => navigator.clipboard.writeText(p.accountNumber || "")}
                  className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-sm text-white hover:bg-rose-700"
                >
                  Copy số tài khoản
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-rose-900 py-8 text-center text-white">
        <p className="font-serif text-lg">Cảm ơn bạn đã đến chia vui cùng chúng mình!</p>
        <p className="mt-2 text-sm text-rose-300">{wedding.groomName} & {wedding.brideName}</p>
      </footer>

      {/* Music Player */}
      <MusicPlayer tracks={wedding.musicTracks.map((track) => ({
        id: track.id,
        title: track.title,
        artist: track.artist,
        url: track.url,
      }))} />
    </div>
  );
}