import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import InvitationClient from "./invitation-client";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const wedding = await prisma.wedding.findUnique({
    where: { slug },
    select: { groomName: true, brideName: true, weddingDate: true, coverImage: true },
  });

  if (!wedding) {
    return { title: "Thiệp cưới" };
  }

  const title = `Thiệp cưới của ${wedding.groomName} & ${wedding.brideName}`;
  const dateStr = wedding.weddingDate ? `vào ngày ${new Date(wedding.weddingDate).toLocaleDateString("vi-VN")}` : "";
  const description = `Trân trọng kính mời quý khách đến dự lễ cưới của ${wedding.groomName} và ${wedding.brideName} ${dateStr}.`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [wedding.coverImage || "/placeholder-wedding.jpg"],
    },
  };
}

export default async function PublicInvitationPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ code?: string }>;
}) {
  const { slug } = await params;
  const { code } = await searchParams;
  const wedding = await prisma.wedding.findUnique({
    where: { slug },
    include: {
      timelineEvents: { orderBy: { orderIndex: "asc" } },
      galleryImages: { orderBy: { orderIndex: "asc" } },
      musicTracks: { where: { isDefault: true } },
      wishes: { where: { isApproved: true }, orderBy: { createdAt: "desc" }, take: 20 },
      paymentConfigs: { where: { isActive: true } },
      user: {
        include: { paymentConfigs: { where: { isActive: true, weddingId: null } } }
      },
    },
  });

  if (!wedding) {
    notFound();
  }

  // Analytics: Tăng lượt xem (không await để không làm chậm page load)
  prisma.wedding.update({
    where: { id: wedding.id },
    data: { viewCount: { increment: 1 } }
  }).catch(() => {});

  const serialized = {
    ...wedding,
    password: null, // Không truyền password thật xuống client
    hasPassword: !!wedding.password,
    theme: wedding.theme || "modern",
    primaryColor: wedding.primaryColor || "#e11d48",
    layoutConfig: (() => {
      const allSections = ["hero", "countdown", "story", "events", "dresscode", "travel", "faqs", "gallery", "rsvp", "wishes", "map", "payment"];
      const current = Array.isArray(wedding.layoutConfig) && wedding.layoutConfig.length > 0 
        ? (wedding.layoutConfig as { id: string; visible: boolean }[])
        : allSections.map(id => ({ id, visible: true }));
      
      const existingIds = new Set(current.map(c => c.id));
      const missing = allSections.filter(id => !existingIds.has(id)).map(id => ({ id, visible: true }));
      
      return [...current, ...missing];
    })(),
    weddingDate: wedding.weddingDate?.toISOString() || null,
    engagementDate: wedding.engagementDate?.toISOString() || null,
    ceremonyDate: wedding.ceremonyDate?.toISOString() || null,
    receptionDate: wedding.receptionDate?.toISOString() || null,
    createdAt: wedding.createdAt.toISOString(),
    updatedAt: wedding.updatedAt.toISOString(),
    timelineEvents: wedding.timelineEvents.map((e) => ({
      ...e,
      eventDate: e.eventDate?.toISOString() || null,
      createdAt: e.createdAt.toISOString(),
    })),
    galleryImages: wedding.galleryImages.map((img) => ({
      ...img,
      createdAt: img.createdAt.toISOString(),
    })),
    musicTracks: wedding.musicTracks.map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
    })),
    wishes: wedding.wishes.map((w) => ({
      ...w,
      createdAt: w.createdAt.toISOString(),
    })),
    paymentConfigs: (wedding.paymentConfigs.length > 0 ? wedding.paymentConfigs : wedding.user.paymentConfigs).map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
    })),
  };

  let guestInfo = null;
  if (code) {
    const guest = await prisma.guest.findFirst({
      where: { inviteCode: code, weddingId: wedding.id },
    });
    if (guest) {
      guestInfo = { name: guest.name, phone: guest.phone };
      // Mark as opened
      if (!guest.hasOpenedInvitation) {
        await prisma.guest.update({
          where: { id: guest.id },
          data: { hasOpenedInvitation: true, openedAt: new Date() },
        });
      }
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": `Lễ Cưới ${wedding.groomName} & ${wedding.brideName}`,
    "startDate": wedding.weddingDate ? wedding.weddingDate.toISOString() : undefined,
    "location": {
      "@type": "Place",
      "name": wedding.venueName || "Việt Nam",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": wedding.venueAddress || "Việt Nam"
      }
    },
    "description": `Lễ cưới của ${wedding.groomName} và ${wedding.brideName}`
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InvitationClient wedding={serialized} guestInfo={guestInfo || undefined} />
    </>
  );
}