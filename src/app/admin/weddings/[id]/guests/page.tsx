import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import GuestsClient from "./guests-client";

export default async function GuestsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id } = await params;

  const guests = await prisma.guest.findMany({
    where: { weddingId: id, wedding: { userId: session.user.id } },
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

  return <GuestsClient guests={serializedGuests} weddingId={id} />;
}