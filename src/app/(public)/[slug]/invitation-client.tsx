"use client";

import { useState, useEffect, useRef } from "react";
import { Countdown } from "@/components/public/countdown";
import { ImageLightbox } from "@/components/public/image-lightbox";
import { MusicPlayer } from "@/components/public/music-player";
import { SectionHeader } from "@/components/ui/section-header";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    
    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

interface WeddingData {
  id: string;
  slug: string;
  groomName: string;
  brideName: string;
  groomFatherName: string | null;
  groomMotherName: string | null;
  brideFatherName: string | null;
  brideMotherName: string | null;
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

export default function InvitationClient({ wedding, guestInfo }: { wedding: WeddingData, guestInfo?: { name: string; phone: string | null } }) {
  const [isOpen, setIsOpen] = useState(false);

  // RSVP form state
  const [rsvpForm, setRsvpForm] = useState({ name: guestInfo?.name || "", phone: guestInfo?.phone || "", status: "Sẽ tham dự", guestCount: "1", message: "" });
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [rsvpError, setRsvpError] = useState("");

  // Wishes form state
  const [wishForm, setWishForm] = useState({ guestName: "", content: "" });
  const [wishLoading, setWishLoading] = useState(false);
  const [wishSuccess, setWishSuccess] = useState(false);
  const [wishError, setWishError] = useState("");
  const [wishes, setWishes] = useState(wedding.wishes);

  // Bank copy state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getCalendarLink = () => {
    if (!wedding.weddingDate) return "#";
    const title = encodeURIComponent(`Lễ cưới ${wedding.groomName} & ${wedding.brideName}`);
    const details = encodeURIComponent(`Kính mời quý khách đến dự lễ cưới của chúng tôi.`);
    const location = encodeURIComponent(wedding.venueAddress || wedding.venueName || "Việt Nam");
    
    const d = new Date(wedding.weddingDate);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dateStr = `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
    
    const dEnd = new Date(d.getTime() + 4 * 60 * 60 * 1000);
    const dateEndStr = `${dEnd.getUTCFullYear()}${pad(dEnd.getUTCMonth() + 1)}${pad(dEnd.getUTCDate())}T${pad(dEnd.getUTCHours())}${pad(dEnd.getUTCMinutes())}${pad(dEnd.getUTCSeconds())}Z`;
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}/${dateEndStr}&details=${details}&location=${location}`;
  };

  if (!isOpen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
        
        <button
          onClick={() => setIsOpen(true)}
          className="group text-center transition-all duration-500 hover:scale-105 z-10"
        >
          <div className="mx-auto mb-8 flex h-40 w-40 items-center justify-center rounded-full border-[1px] border-primary/40 bg-primary/5 backdrop-blur-sm shadow-[0_0_40px_rgba(197,168,128,0.15)] transition-all duration-700 group-hover:border-primary/80 group-hover:shadow-[0_0_60px_rgba(197,168,128,0.3)]">
            <span className="text-5xl opacity-80">💌</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-wide text-foreground">
            {wedding.groomName} <span className="text-primary italic font-light">&</span> {wedding.brideName}
          </h1>
          {guestInfo && (
            <p className="mt-6 text-xl font-light tracking-wide text-foreground/80">
              Trân trọng kính mời: <span className="font-medium text-primary">{guestInfo.name}</span>
            </p>
          )}
          <div className="mt-12 flex flex-col items-center gap-2">
            <p className="text-sm tracking-[0.2em] uppercase text-primary/80 font-medium">Mở thiệp</p>
            <div className="h-10 w-[1px] bg-gradient-to-b from-primary to-transparent animate-[pulse_2s_ease-in-out_infinite]" />
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center bg-foreground text-background">
        <div className="absolute inset-0 bg-[url('/hero-pattern.png')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-foreground/50 to-background" />
        
        <FadeIn className="relative z-10 px-4 text-center">
          <p className="mb-6 text-xs sm:text-sm tracking-[0.3em] uppercase text-primary font-medium">Wedding Invitation</p>
          <h1 className="font-serif text-6xl sm:text-8xl font-normal tracking-tight text-white">{wedding.groomName}</h1>
          <p className="my-6 font-serif text-4xl text-primary italic font-light">&</p>
          <h1 className="font-serif text-6xl sm:text-8xl font-normal tracking-tight text-white">{wedding.brideName}</h1>
          <div className="mx-auto mt-12 max-w-md">
            <div className="h-[1px] w-24 bg-primary/50 mx-auto mb-6" />
            <p className="text-lg font-light tracking-wide text-white/80">Cùng sự hiện diện của gia đình và bạn bè</p>
          </div>

          {(wedding.groomFatherName || wedding.groomMotherName || wedding.brideFatherName || wedding.brideMotherName) && (
            <div className="mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-8 text-sm text-primary/80 sm:text-base font-light">
              <div>
                <p className="mb-2 font-medium uppercase tracking-widest text-primary text-xs">Nhà trai</p>
                {wedding.groomFatherName && <p>Ông: {wedding.groomFatherName}</p>}
                {wedding.groomMotherName && <p>Bà: {wedding.groomMotherName}</p>}
              </div>
              <div>
                <p className="mb-2 font-medium uppercase tracking-widest text-primary text-xs">Nhà gái</p>
                {wedding.brideFatherName && <p>Ông: {wedding.brideFatherName}</p>}
                {wedding.brideMotherName && <p>Bà: {wedding.brideMotherName}</p>}
              </div>
            </div>
          )}

          <p className="mt-12 text-sm font-medium tracking-widest text-primary uppercase">
            {wedding.weddingDate
              ? new Date(wedding.weddingDate).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Sắp diễn ra"}
          </p>
        </FadeIn>
      </section>

      {/* Countdown */}
      {wedding.weddingDate && (
        <section className="relative -mt-24 z-20 pb-16">
          <div className="mx-auto max-w-4xl px-4">
            <FadeIn delay={200}>
              <Countdown targetDate={wedding.weddingDate} />
            </FadeIn>
          </div>
        </section>
      )}

      {/* Our Story */}
      {wedding.story && (
        <section className="py-24 bg-background">
          <FadeIn className="mx-auto max-w-2xl px-4 text-center">
            <SectionHeader title="Câu chuyện của chúng mình" />
            <p className="mt-8 leading-relaxed text-foreground/80 font-serif text-lg md:text-xl italic">{wedding.story}</p>
          </FadeIn>
        </section>
      )}

      {/* Events Timeline */}
      {wedding.timelineEvents.length > 0 && (
        <section className="bg-primary/5 py-24">
          <FadeIn className="mx-auto max-w-2xl px-4">
            <SectionHeader title="Sự kiện" />
            <div className="mt-12 space-y-8">
              {wedding.timelineEvents.map((event, i) => (
                <div key={event.id} className="relative flex gap-8 group">
                  <div className="flex flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-background text-sm font-serif font-bold text-primary shadow-sm transition-transform duration-300 group-hover:scale-110">
                      {i + 1}
                    </div>
                    {i < wedding.timelineEvents.length - 1 && <div className="mt-3 h-full w-[1px] bg-primary/30" />}
                  </div>
                  <div className="mb-8 flex-1 rounded-2xl bg-white p-6 shadow-sm border border-primary/10 transition-shadow duration-300 group-hover:shadow-md">
                    <h3 className="text-xl font-serif font-semibold text-foreground">{event.name}</h3>
                    <p className="mt-2 text-sm text-foreground/60 uppercase tracking-widest font-medium">
                      {event.eventDate && new Date(event.eventDate).toLocaleDateString("vi-VN")}
                      {event.eventTime && ` - ${event.eventTime}`}
                    </p>
                    {event.location && <p className="mt-2 text-sm text-foreground/70">{event.location}</p>}
                  </div>
                </div>
              ))}
            </div>
            
            {wedding.weddingDate && (
              <div className="mt-16 text-center">
                <a
                  href={getCalendarLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-white shadow-lg transition duration-300 hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5"
                >
                  Thêm vào lịch
                </a>
              </div>
            )}
          </FadeIn>
        </section>
      )}

      {/* Gallery */}
      {wedding.galleryEnabled && wedding.galleryImages.length > 0 && (
        <section className="py-24 bg-background">
          <FadeIn className="mx-auto max-w-5xl px-4">
            <SectionHeader title="Album ảnh" />
            <div className="mt-12">
              <ImageLightbox
                images={wedding.galleryImages.map((img) => ({
                  id: img.id,
                  imageUrl: img.imageUrl,
                  caption: img.caption,
                }))}
              />
            </div>
          </FadeIn>
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
                      guestName: rsvpForm.name,
                      phone: rsvpForm.phone,
                      isAttending: rsvpForm.status !== "Xin lỗi không thể",
                      guestCount: parseInt(rsvpForm.guestCount),
                      message: rsvpForm.message,
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
                <textarea
                  placeholder="Lời nhắn cho cô dâu chú rể..." rows={2}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  value={rsvpForm.message}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, message: e.target.value })}
                />
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
        <section className="py-24 bg-background">
          <FadeIn className="mx-auto max-w-lg px-4">
            <SectionHeader title="Lời chúc" />
            <div className="mt-12 space-y-6">
              {wishes.map((w) => (
                <div key={w.id} className="rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-sm">
                  <p className="text-sm font-serif italic text-foreground/80">"{w.content}"</p>
                  <p className="mt-4 text-xs font-medium uppercase tracking-widest text-primary">— {w.guestName}</p>
                </div>
              ))}
              {wishes.length === 0 && (
                <p className="text-center text-sm italic text-foreground/50">Chưa có lời chúc nào. Hãy là người đầu tiên!</p>
              )}
            </div>
            {wishSuccess ? (
              <div className="mt-10 rounded-2xl bg-green-50/50 border border-green-200 p-6 text-center shadow-sm">
                <p className="text-sm font-medium text-green-800">✅ Cảm ơn! Lời chúc của bạn đã được gửi và đang chờ duyệt.</p>
              </div>
            ) : (
              <form className="mt-10 space-y-5" onSubmit={async (e) => {
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
                  // Do not optimistically add to the list to avoid confusion since it requires approval
                } catch {
                  setWishError("Có lỗi xảy ra, vui lòng thử lại");
                }
                setWishLoading(false);
              }}>
                {wishError && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{wishError}</div>}
                <input
                  type="text" placeholder="Tên của bạn *" required
                  className="w-full rounded-xl border border-primary/30 bg-transparent px-5 py-3.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                  value={wishForm.guestName}
                  onChange={(e) => setWishForm({ ...wishForm, guestName: e.target.value })}
                />
                <textarea
                  placeholder="Lời chúc của bạn *" required rows={3}
                  className="w-full rounded-xl border border-primary/30 bg-transparent px-5 py-3.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                  value={wishForm.content}
                  onChange={(e) => setWishForm({ ...wishForm, content: e.target.value })}
                />
                <button
                  type="submit"
                  disabled={wishLoading}
                  className="w-full rounded-xl border-2 border-primary bg-primary px-6 py-3.5 text-sm font-medium text-white shadow-md transition duration-300 hover:bg-primary/90 disabled:opacity-50"
                >
                  {wishLoading ? "Đang gửi..." : "Gửi lời chúc"}
                </button>
              </form>
            )}
          </FadeIn>
        </section>
      )}

      {/* Map */}
      {wedding.venueName && (
        <section className="bg-primary/5 py-24">
          <FadeIn className="mx-auto max-w-2xl px-4 text-center">
            <SectionHeader title="Bản đồ chỉ đường" />
            <p className="mt-6 font-serif text-xl font-medium text-foreground">{wedding.venueName}</p>
            {wedding.venueAddress && <p className="mt-2 text-sm text-foreground/70">{wedding.venueAddress}</p>}
            <div className="mt-8 flex justify-center gap-4">
              <a
                href={wedding.venueLat && wedding.venueLng
                  ? `https://www.google.com/maps?q=${wedding.venueLat},${wedding.venueLng}`
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(wedding.venueAddress || wedding.venueName || '')}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-white shadow-md transition duration-300 hover:bg-primary/90 hover:-translate-y-0.5"
              >
                📍 Mở Google Maps
              </a>
            </div>
          </FadeIn>
        </section>
      )}

      {/* Bank Info */}
      {wedding.paymentConfigs.length > 0 && (
        <section className="py-24 bg-background">
          <FadeIn className="mx-auto max-w-lg px-4 text-center">
            <SectionHeader title="Mừng cưới" />
            <p className="mt-6 text-sm italic text-foreground/70 font-serif">
              Sự hiện diện của bạn là món quà quý giá nhất. Nếu có lòng, bạn có thể gửi mừng cưới qua:
            </p>
            {wedding.paymentConfigs.map((p) => (
              <div key={p.id} className="mt-10 rounded-3xl border border-primary/20 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <p className="font-serif text-xl font-medium text-foreground">{p.bankName}</p>
                <p className="mt-3 text-2xl font-bold tracking-wider text-primary">{p.accountNumber}</p>
                <p className="mt-2 text-sm uppercase tracking-widest text-foreground/60">{p.accountName}</p>
                {p.qrCodeUrl && <img src={p.qrCodeUrl} alt="QR" className="mx-auto mt-6 h-48 w-48 rounded-xl shadow-sm" />}
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(p.accountNumber || "");
                      setCopiedId(p.id);
                      setTimeout(() => setCopiedId(null), 2000);
                    } catch (err) {}
                  }}
                  className="mt-6 rounded-full bg-primary/10 border border-primary/30 px-6 py-2.5 text-sm font-medium text-primary hover:bg-primary hover:text-white transition-colors duration-300"
                >
                  {copiedId === p.id ? "Đã sao chép!" : "Copy số tài khoản"}
                </button>
              </div>
            ))}
          </FadeIn>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-foreground py-16 text-center text-background">
        <FadeIn>
          <p className="font-serif text-2xl font-light italic">Cảm ơn bạn đã đến chia vui cùng chúng mình!</p>
          <p className="mt-6 text-sm uppercase tracking-[0.3em] text-primary">{wedding.groomName} & {wedding.brideName}</p>
        </FadeIn>
      </footer>

      {/* Music Player */}
      <MusicPlayer autoPlay={isOpen} tracks={wedding.musicTracks.map((track) => ({
        id: track.id,
        title: track.title,
        artist: track.artist,
        url: track.url,
      }))} />
    </div>
  );
}