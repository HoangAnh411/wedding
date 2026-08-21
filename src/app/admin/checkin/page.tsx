import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import CheckinClient from "./checkin-client";

export const dynamic = "force-dynamic";

export default async function CheckinPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const checkins = await prisma.checkIn.findMany({
    where: { wedding: { userId: session.user.id } },
    include: { guest: { select: { name: true, tableNumber: true } } },
    orderBy: { checkedInAt: "desc" },
  });

  const weddings = await prisma.wedding.findMany({
    where: { userId: session.user.id },
    select: { id: true, groomName: true, brideName: true },
  });

  const totalGuests = await prisma.guest.count({
    where: { wedding: { userId: session.user.id } },
  });

  const serialized = checkins.map((c) => ({
    id: c.id,
    guestName: c.guest.name,
    tableNumber: c.guest.tableNumber,
    checkedInAt: c.checkedInAt.toISOString(),
  }));

  return <CheckinClient checkins={serialized} totalGuests={totalGuests} weddings={weddings} />;
}