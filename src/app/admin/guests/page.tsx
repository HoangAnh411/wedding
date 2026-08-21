import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import GuestsClient from "./guests-client";

export default async function GuestsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const weddings = await prisma.wedding.findMany({
    where: { userId: session.user.id },
    select: { id: true, groomName: true, brideName: true },
  });

  const weddingIds = weddings.map((w) => w.id);

  const guests = await prisma.guest.findMany({
    where: { weddingId: { in: weddingIds } },
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
  }));

  return <GuestsClient guests={serializedGuests} weddings={weddings} />;
}