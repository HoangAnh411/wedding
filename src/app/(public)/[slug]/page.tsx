import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import InvitationClient from "./invitation-client";

export default async function PublicInvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const wedding = await prisma.wedding.findUnique({
    where: { slug },
    include: {
      timelineEvents: { orderBy: { orderIndex: "asc" } },
      galleryImages: { orderBy: { orderIndex: "asc" } },
      musicTracks: { where: { isDefault: true } },
      wishes: { where: { isApproved: true }, orderBy: { createdAt: "desc" }, take: 20 },
      paymentConfigs: { where: { isActive: true } },
    },
  });

  if (!wedding) {
    notFound();
  }

  const serialized = {
    ...wedding,
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
    paymentConfigs: wedding.paymentConfigs.map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
    })),
  };

  return <InvitationClient wedding={serialized} />;
}