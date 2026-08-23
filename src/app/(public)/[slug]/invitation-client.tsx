"use client";

import { useState, useEffect, useRef } from "react";
import { Countdown } from "@/components/public/countdown";
import { ImageLightbox } from "@/components/public/image-lightbox";
import { MusicPlayer } from "@/components/public/music-player";
import { SectionHeader } from "@/components/ui/section-header";
import { PasswordGate } from "@/components/public/password-gate";
import { SolarDate } from "@nghiavuive/lunar_date_vi";

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
  hasPassword?: boolean;
  theme?: string;
  primaryColor?: string;
  layoutConfig?: { id: string; visible: boolean }[];
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
    isRsvpEnabled: boolean;
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
    gatewayType: string; // "bank" | "momo" | "paypal"
    bankName: string | null;
    accountNumber: string | null;
    accountName: string | null;
    qrCodeUrl: string | null;
    momoPhone: string | null;
    paypalEmail: string | null;
  }[];
}

const PaymentSection = ({ configs, guestName }: { configs: WeddingData['paymentConfigs'], guestName?: string }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<Record<string, string>>({});

  const generateVietQR = (p: WeddingData['paymentConfigs'][0]) => {
    if (!p.bankName || !p.accountNumber) return p.qrCodeUrl;
    let bankCode = p.bankName.split('-')[0].trim().replace(/\s/g, ''); 
    const amount = amounts[p.id] ? `&amount=${amounts[p.id]}` : '';
    const addInfo = messages[p.id] ? `&addInfo=${encodeURIComponent(messages[p.id])}` : (guestName ? `&addInfo=${encodeURIComponent(guestName + ' mung cuoi')}` : '');
    const accountName = p.accountName ? `&accountName=${encodeURIComponent(p.accountName)}` : '';
    return `https://img.vietqr.io/image/${bankCode}-${p.accountNumber}-compact2.png?${amount}${addInfo}${accountName}`;
  };

  const copyText = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {}
  };

  const renderBankCard = (p: WeddingData['paymentConfigs'][0]) => {
    const qrUrl = generateVietQR(p);
    return (
      <div key={p.id} className="mt-10 rounded-3xl border border-primary/20 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 mb-4">🏦 Ngân hàng</div>
        <p className="font-serif text-xl font-medium text-foreground">{p.bankName}</p>
        <p className="mt-3 text-2xl font-bold tracking-wider text-primary">{p.accountNumber}</p>
        <p className="mt-2 text-sm uppercase tracking-widest text-foreground/60">{p.accountName}</p>
        
        <div className="mt-6 space-y-3 text-left">
          <div>
            <label className="text-xs font-medium text-foreground/60 uppercase tracking-wider mb-1 block">Số tiền (VNĐ)</label>
            <input type="number" placeholder="VD: 500000"
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-primary focus:outline-none bg-background text-foreground"
              value={amounts[p.id] || ''} onChange={(e) => setAmounts({...amounts, [p.id]: e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground/60 uppercase tracking-wider mb-1 block">Lời nhắn</label>
            <input type="text" placeholder="VD: Chuc mung hanh phuc"
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-primary focus:outline-none bg-background text-foreground"
              value={messages[p.id] !== undefined ? messages[p.id] : (guestName ? `${guestName} mung cuoi` : '')}
              onChange={(e) => setMessages({...messages, [p.id]: e.target.value})} />
          </div>
        </div>

        {qrUrl && <img src={qrUrl} alt="QR Mừng cưới" className="mx-auto mt-6 rounded-xl shadow-sm border border-gray-100 max-w-full" style={{ maxHeight: '350px' }} />}
        
        <button onClick={() => copyText(p.accountNumber || "", p.id)}
          className="mt-6 rounded-full bg-primary/10 border border-primary/30 px-6 py-2.5 text-sm font-medium text-primary hover:bg-primary hover:text-white transition-colors duration-300">
          {copiedId === p.id ? "Đã sao chép!" : "Copy số tài khoản"}
        </button>
      </div>
    );
  };

  const renderMomoCard = (p: WeddingData['paymentConfigs'][0]) => {
    const phone = p.momoPhone || p.accountNumber || '';
    const momoDeepLink = `https://me.momo.vn/${phone}`;
    return (
      <div key={p.id} className="mt-10 rounded-3xl border border-pink-200 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1 text-xs font-medium text-pink-700 mb-4">📱 MoMo</div>
        <p className="font-serif text-xl font-medium text-foreground">{p.accountName || 'MoMo'}</p>
        <p className="mt-3 text-2xl font-bold tracking-wider text-pink-600">{phone}</p>
        
        {p.qrCodeUrl && <img src={p.qrCodeUrl} alt="QR MoMo" className="mx-auto mt-6 rounded-xl shadow-sm border border-gray-100 max-w-full" style={{ maxHeight: '350px' }} />}
        
        <div className="mt-6 flex gap-3 justify-center flex-wrap">
          <a href={momoDeepLink} target="_blank" rel="noopener noreferrer"
            className="rounded-full bg-pink-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-pink-600 transition-colors duration-300 inline-block">
            Mở MoMo
          </a>
          <button onClick={() => copyText(phone, p.id)}
            className="rounded-full bg-pink-50 border border-pink-200 px-6 py-2.5 text-sm font-medium text-pink-700 hover:bg-pink-100 transition-colors duration-300">
            {copiedId === p.id ? "Đã sao chép!" : "Copy SĐT"}
          </button>
        </div>
      </div>
    );
  };

  const renderPaypalCard = (p: WeddingData['paymentConfigs'][0]) => {
    const email = p.paypalEmail || p.accountNumber || '';
    const paypalLink = `https://paypal.me/${email}`;
    return (
      <div key={p.id} className="mt-10 rounded-3xl border border-blue-200 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 mb-4">💳 PayPal</div>
        <p className="font-serif text-xl font-medium text-foreground">{p.accountName || 'PayPal'}</p>
        <p className="mt-3 text-lg font-medium tracking-wide text-blue-600">{email}</p>
        
        <div className="mt-6 flex gap-3 justify-center flex-wrap">
          <a href={paypalLink} target="_blank" rel="noopener noreferrer"
            className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors duration-300 inline-block">
            Gửi qua PayPal
          </a>
          <button onClick={() => copyText(email, p.id)}
            className="rounded-full bg-blue-50 border border-blue-200 px-6 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors duration-300">
            {copiedId === p.id ? "Đã sao chép!" : "Copy email"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <section key="payment" className="py-24 bg-background">
      <FadeIn className="mx-auto max-w-lg px-4 text-center">
        <SectionHeader title="Mừng cưới" />
        <p className="mt-6 text-sm italic text-foreground/70 font-serif">
          Sự hiện diện của bạn là món quà quý giá nhất. Nếu có lòng, bạn có thể gửi mừng cưới qua:
        </p>
        {configs.map((p) => {
          if (p.gatewayType === 'momo') return renderMomoCard(p);
          if (p.gatewayType === 'paypal') return renderPaypalCard(p);
          return renderBankCard(p); // "bank", "vietqr", hoặc default
        })}
      </FadeIn>
    </section>
  );
};


export default function InvitationClient({ wedding, guestInfo }: { wedding: WeddingData, guestInfo?: { name: string; phone: string | null } }) {
  const [isOpen, setIsOpen] = useState(false);

  // RSVP form state
  const [rsvpForm, setRsvpForm] = useState<Record<string, string>>({ name: guestInfo?.name || "", phone: guestInfo?.phone || "", email: "", status: "Sẽ tham dự", guestCount: "1", message: "" });
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [rsvpError, setRsvpError] = useState("");

  // Wishes form state
  const [wishForm, setWishForm] = useState({ guestName: "", content: "" });
  const [wishLoading, setWishLoading] = useState(false);
  const [wishSuccess, setWishSuccess] = useState(false);
  const [wishError, setWishError] = useState("");
  const [wishes, setWishes] = useState(wedding.wishes);

  // Password state
  const [isUnlocked, setIsUnlocked] = useState(!wedding.hasPassword);

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

  if (!isUnlocked) {
    return <PasswordGate weddingSlug={wedding.slug} onUnlocked={() => setIsUnlocked(true)} />;
  }

  const customStyle = {
    '--primary': wedding.primaryColor || '#e11d48',
  } as React.CSSProperties;

  if (!isOpen) {
    return (
      <div style={customStyle} className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
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

  const sections: Record<string, React.ReactNode> = {
    hero: (
      <section key="hero" className="relative flex min-h-screen items-center justify-center bg-foreground text-background">
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

          <div className="mt-12 flex flex-col items-center gap-1">
            <p className="text-sm font-medium tracking-widest text-primary uppercase">
              {wedding.weddingDate
                ? new Date(wedding.weddingDate).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Sắp diễn ra"}
            </p>
            {wedding.weddingDate && (
              <p className="text-xs font-light tracking-wide text-primary/80">
                {(() => {
                  const sDate = new SolarDate(new Date(wedding.weddingDate!));
                  const lDate = sDate.toLunarDate() as any;
                  return `(Nhằm ngày ${lDate.day} tháng ${lDate.month} năm Âm lịch)`;
                })()}
              </p>
            )}
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => {
                const url = window.location.href;
                window.open(`https://zalo.me/share?url=${encodeURIComponent(url)}`, '_blank');
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-110 border border-white/20"
              title="Chia sẻ qua Zalo"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M21.544 11.049c0-5.46-4.908-9.887-10.966-9.887C4.52 1.162-.001 5.589-.001 11.049c0 2.87 1.348 5.438 3.504 7.214.314 1.107-.942 3.655-.992 3.754-.15.302.138.648.455.541 2.378-.802 4.195-2.073 4.887-2.616 1.144.381 2.405.592 3.725.592 6.058 0 10.966-4.427 10.966-9.887zm-11.89 2.502h-2.316l3.352-4.144H8.483c-.352 0-.638-.285-.638-.636s.286-.637.638-.637h4.085c.492 0 .69.57.375.952l-3.327 4.113h2.138c.353 0 .639.285.639.636s-.286.637-.639.637zm3.177-1.121c-.81 0-1.467-.655-1.467-1.462s.657-1.462 1.467-1.462 1.467.655 1.467 1.462-.657 1.462-1.467 1.462z"/></svg>
            </button>
            <button
              onClick={() => {
                const url = window.location.href;
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-110 border border-white/20"
              title="Chia sẻ qua Facebook"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </button>
          </div>
        </FadeIn>
      </section>
    ),

    countdown: wedding.weddingDate && (
      <section key="countdown" className="relative -mt-24 z-20 pb-16">
        <div className="mx-auto max-w-4xl px-4">
          <FadeIn delay={200}>
            <Countdown targetDate={wedding.weddingDate} />
          </FadeIn>
        </div>
      </section>
    ),

    story: wedding.story && (
      <section key="story" className="py-24 bg-background">
        <FadeIn className="mx-auto max-w-2xl px-4 text-center">
          <SectionHeader title="Câu chuyện của chúng mình" />
          <p className="mt-8 leading-relaxed text-foreground/80 font-serif text-lg md:text-xl italic">{wedding.story}</p>
        </FadeIn>
      </section>
    ),

    events: wedding.timelineEvents.length > 0 && (
      <section key="events" className="bg-primary/5 py-24">
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
                  <div className="mt-2 text-sm text-foreground/60 uppercase tracking-widest font-medium">
                    {event.eventDate && new Date(event.eventDate).toLocaleDateString("vi-VN")}
                    {event.eventTime && ` - ${event.eventTime}`}
                    {event.eventDate && (
                      <span className="block mt-1 text-xs font-normal text-foreground/50 lowercase">
                        {(() => {
                          const sDate = new SolarDate(new Date(event.eventDate!));
                          const lDate = sDate.toLunarDate() as any;
                          return `(âm lịch: ${lDate.day}/${lDate.month})`;
                        })()}
                      </span>
                    )}
                  </div>
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
    ),

    dresscode: (
      <section key="dresscode" className="py-24 bg-background">
        <FadeIn className="mx-auto max-w-2xl px-4 text-center">
          <SectionHeader title="Dress Code" />
          <p className="mt-6 text-sm italic text-foreground/70 font-serif">Trang phục khuyến nghị khi tham dự</p>
          <div className="mt-8 flex justify-center gap-6">
            <div className="h-16 w-16 rounded-full border border-gray-200 bg-white" title="Trắng"></div>
            <div className="h-16 w-16 rounded-full border border-gray-200 bg-[#F5E6E8]" title="Hồng pastel"></div>
            <div className="h-16 w-16 rounded-full border border-gray-200 bg-[#E0E5EC]" title="Xanh pastel"></div>
          </div>
          <p className="mt-6 text-sm text-foreground/80">Khuyến khích quý khách mặc trang phục theo tone màu Trắng, Hồng Pastel hoặc Xanh Pastel để khung hình thêm phần lung linh.</p>
        </FadeIn>
      </section>
    ),

    travel: (
      <section key="travel" className="bg-primary/5 py-24">
        <FadeIn className="mx-auto max-w-3xl px-4 text-center">
          <SectionHeader title="Di chuyển & Lưu trú" />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 text-left">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-primary/10">
              <h3 className="text-xl font-serif font-semibold text-foreground mb-4">🚕 Di chuyển</h3>
              <ul className="space-y-3 text-sm text-foreground/80 list-disc pl-4">
                <li>Bãi đỗ xe ô tô/xe máy miễn phí tại khuôn viên nhà hàng.</li>
                <li>Có hỗ trợ gọi Taxi/Grab cho khách có nhu cầu.</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-primary/10">
              <h3 className="text-xl font-serif font-semibold text-foreground mb-4">🏨 Lưu trú</h3>
              <ul className="space-y-3 text-sm text-foreground/80 list-disc pl-4">
                <li>Đối với khách ở xa, chúng tôi đã chuẩn bị phòng nghỉ tại khách sạn gần đó. Vui lòng liên hệ trước để chúng tôi sắp xếp chu đáo.</li>
              </ul>
            </div>
          </div>
        </FadeIn>
      </section>
    ),

    faqs: (
      <section key="faqs" className="py-24 bg-background">
        <FadeIn className="mx-auto max-w-2xl px-4">
          <SectionHeader title="Q&A" />
          <div className="mt-12 space-y-6 text-left">
            <div className="border-b border-gray-100 pb-4">
              <h4 className="font-medium text-foreground mb-2">Q: Đám cưới có tổ chức ngoài trời không?</h4>
              <p className="text-sm text-foreground/70">A: Lễ cưới sẽ diễn ra trong hội trường có máy lạnh, không bị ảnh hưởng bởi thời tiết.</p>
            </div>
            <div className="border-b border-gray-100 pb-4">
              <h4 className="font-medium text-foreground mb-2">Q: Có thể mang theo trẻ em không?</h4>
              <p className="text-sm text-foreground/70">A: Chúng tôi rất chào đón các bé. Xin vui lòng báo số lượng trẻ em trong form RSVP để chúng tôi chuẩn bị ghế ngồi phù hợp.</p>
            </div>
          </div>
        </FadeIn>
      </section>
    ),

    gallery: wedding.galleryEnabled && wedding.galleryImages.length > 0 && (
      <section key="gallery" className="py-24 bg-background">
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
    ),

    rsvp: wedding.rsvpEnabled && (
      <section key="rsvp" className="bg-rose-50 py-16">
        <div className="mx-auto max-w-lg px-4">
          <SectionHeader title="Xác nhận tham dự" />
          {rsvpSuccess ? (
            <div className="mt-8 rounded-xl bg-green-50 p-6 text-center">
              <p className="text-lg font-medium text-green-800">✅ Cảm ơn bạn đã xác nhận!</p>
              <p className="mt-1 text-sm text-green-600">Chúng mình rất mong được đón tiếp bạn.</p>
            </div>
          ) : (
            <form className="mt-8 space-y-5" onSubmit={async (e) => {
              e.preventDefault();
              setRsvpLoading(true);
              setRsvpError("");
              try {
                const rsvpEnabledEvents = wedding.timelineEvents.filter(ev => ev.isRsvpEnabled);
                let payloadEvents = undefined;

                if (rsvpEnabledEvents.length > 0) {
                  payloadEvents = rsvpEnabledEvents.map(ev => ({
                    eventId: ev.id,
                    isAttending: rsvpForm[`event_${ev.id}_attending`] === "true",
                    guestCount: parseInt(rsvpForm[`event_${ev.id}_count`] || "1"),
                  }));
                }

                const res = await fetch("/api/rsvp", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    weddingId: wedding.id,
                    guestName: rsvpForm.name,
                    phone: rsvpForm.phone,
                    email: rsvpForm.email,
                    isAttending: rsvpForm.status !== "Xin lỗi không thể", 
                    guestCount: parseInt(rsvpForm.guestCount), 
                    message: rsvpForm.message,
                    events: payloadEvents,
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
              
              <div className="space-y-4">
                <input
                  type="text" placeholder="Họ và tên *" required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white text-gray-900"
                  value={rsvpForm.name}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                />
                <input
                  type="tel" placeholder="Số điện thoại"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white text-gray-900"
                  value={rsvpForm.phone}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, phone: e.target.value })}
                />
                <input
                  type="email" placeholder="Email (để nhận thư cảm ơn/xác nhận)"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white text-gray-900"
                  value={rsvpForm.email || ''}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, email: e.target.value })}
                />
              </div>

              {wedding.timelineEvents.filter(e => e.isRsvpEnabled).length > 0 ? (
                <div className="mt-6 space-y-4 rounded-xl bg-white p-5 shadow-sm border border-rose-100">
                  <p className="text-sm font-medium text-foreground/80 font-serif mb-2">Vui lòng chọn sự kiện bạn sẽ tham dự:</p>
                  {wedding.timelineEvents.filter(e => e.isRsvpEnabled).map(ev => {
                    const attendingKey = `event_${ev.id}_attending`;
                    const countKey = `event_${ev.id}_count`;
                    
                    if (rsvpForm[attendingKey] === undefined) {
                      setRsvpForm(prev => ({ ...prev, [attendingKey]: "true", [countKey]: "1" }));
                    }

                    return (
                      <div key={ev.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <p className="font-medium text-primary text-base">{ev.name}</p>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          <select
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-50 focus:bg-white"
                            value={rsvpForm[attendingKey] || "true"}
                            onChange={(e) => setRsvpForm({ ...rsvpForm, [attendingKey]: e.target.value })}
                          >
                            <option value="true">Sẽ tham dự</option>
                            <option value="false">Không thể tham dự</option>
                          </select>
                          
                          {rsvpForm[attendingKey] !== "false" && (
                            <select
                              className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-50 focus:bg-white"
                              value={rsvpForm[countKey] || "1"}
                              onChange={(e) => setRsvpForm({ ...rsvpForm, [countKey]: e.target.value })}
                            >
                              {[1, 2, 3, 4, 5].map((n) => (
                                <option key={n} value={n.toString()}>Đi {n} người</option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      className="rounded-lg border border-gray-300 px-4 py-3 text-sm"
                      value={rsvpForm.status}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, status: e.target.value })}
                    >
                      <option>Sẽ tham dự</option>
                      <option>Có thể tham dự</option>
                      <option>Xin lỗi không thể</option>
                    </select>
                    <select
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                      value={rsvpForm.guestCount}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, guestCount: e.target.value })}
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n.toString()}>Số lượng: {n} người</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <textarea
                placeholder="Lời nhắn cho cô dâu chú rể..." rows={2}
                className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                value={rsvpForm.message}
                onChange={(e) => setRsvpForm({ ...rsvpForm, message: e.target.value })}
              />
              
              <button
                type="submit"
                disabled={rsvpLoading}
                className="mt-6 w-full rounded-lg bg-rose-600 px-6 py-3.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-50"
              >
                {rsvpLoading ? "Đang gửi..." : "Gửi xác nhận"}
              </button>
            </form>
          )}
        </div>
      </section>
    ),

    wishes: wedding.wishesEnabled && (
      <section key="wishes" className="py-24 bg-background">
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
    ),

    map: wedding.venueName && (
      <section key="map" className="bg-primary/5 py-24">
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
    ),

    payment: wedding.paymentConfigs.length > 0 && (
      <PaymentSection configs={wedding.paymentConfigs} guestName={guestInfo?.name} />
    )
  };

  const defaultLayout = ["hero", "countdown", "story", "events", "gallery", "rsvp", "wishes", "map", "payment"].map(id => ({ id, visible: true }));
  const layoutConfig = wedding.layoutConfig || defaultLayout;

  return (
    <div style={customStyle} className={`min-h-screen bg-background text-foreground overflow-x-hidden theme-${wedding.theme || 'modern'}`}>
      
      {layoutConfig.filter(c => c.visible).map(config => sections[config.id])}

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