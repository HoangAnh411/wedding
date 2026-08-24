import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import CheckinClient from "./checkin-client";

export const dynamic = "force-dynamic";

export default async function CheckinPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id: weddingId } = await params;

  const wedding = await prisma.wedding.findUnique({
    where: { id: weddingId, userId: session.user.id },
  });

  if (!wedding) redirect("/admin");

  const checkins = await prisma.checkIn.findMany({
    where: { weddingId },
    include: { guest: { select: { name: true, tableNumber: true } } },
    orderBy: { checkedInAt: "desc" },
  });

  const totalGuests = await prisma.guest.count({
    where: { weddingId },
  });

  const serialized = checkins.map((c) => ({
    id: c.id,
    guestName: c.guest.name,
    tableNumber: c.guest.tableNumber,
    checkedInAt: c.checkedInAt.toISOString(),
  }));

  return <CheckinClient checkins={serialized} totalGuests={totalGuests} weddingId={weddingId} />;
}