import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import GuestsClient from "./guests-client";

export default async function GuestsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id } = await params;

  // Lấy danh sách timeline events có rsvpEnabled
  const timelineEvents = await prisma.timelineEvent.findMany({
    where: { weddingId: id, isRsvpEnabled: true },
    orderBy: { orderIndex: "asc" },
  });

  const guests = await prisma.guest.findMany({
    where: { weddingId: id, wedding: { userId: session.user.id } },
    include: { rsvpResponses: true },
    orderBy: { createdAt: "desc" },
  });

  const serializedGuests = guests.map((g) => ({
    ...g,
    weddingDate: null,
    invitationSentAt: g.invitationSentAt?.toISOString() || null,
    openedAt: g.openedAt?.toISOString() || null,
    rsvpAt: g.rsvpAt?.toISOString() || null,
    createdAt: g.createdAt.toISOString(),
    updatedAt: g.updatedAt.toISOString(),
    rsvpResponses: g.rsvpResponses.map(r => ({
      ...r,
      respondedAt: r.respondedAt.toISOString()
    }))
  }));

  const serializedEvents = timelineEvents.map(e => ({
    id: e.id,
    name: e.name,
  }));

  return <GuestsClient guests={serializedGuests} timelineEvents={serializedEvents} weddingId={id} />;
}