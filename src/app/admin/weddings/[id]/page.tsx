import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import WeddingDetailClient from "./wedding-detail-client";

export const dynamic = "force-dynamic";

export default async function WeddingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id } = await params;
  const wedding = await prisma.wedding.findUnique({
    where: { id },
    include: {
      _count: { select: { guests: true, checklistItems: true, tables: true, moneyGifts: true } },
      timelineEvents: { orderBy: { orderIndex: "asc" } },
    },
  });

  if (!wedding || wedding.userId !== session.user.id) {
    notFound();
  }

  const confirmed = await prisma.guest.count({
    where: { weddingId: wedding.id, isAttending: true },
  });

  const serialized = {
    ...wedding,
    weddingDate: wedding.weddingDate?.toISOString() || null,
    engagementDate: wedding.engagementDate?.toISOString() || null,
    ceremonyDate: wedding.ceremonyDate?.toISOString() || null,
    receptionDate: wedding.receptionDate?.toISOString() || null,
    createdAt: wedding.createdAt.toISOString(),
    updatedAt: wedding.updatedAt.toISOString(),
    guestCount: wedding._count.guests,
    confirmedCount: confirmed,
    timelineEvents: wedding.timelineEvents.map((e) => ({
      ...e,
      eventDate: e.eventDate?.toISOString() || null,
      createdAt: e.createdAt.toISOString(),
    })),
  };

  return <WeddingDetailClient wedding={serialized} />;
}