import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import MoneyGiftsClient from "./money-gifts-client";

export const dynamic = "force-dynamic";

export default async function MoneyGiftsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const gifts = await prisma.moneyGift.findMany({
    where: { wedding: { userId: session.user.id } },
    orderBy: { createdAt: "desc" },
  });

  const weddings = await prisma.wedding.findMany({
    where: { userId: session.user.id },
    select: { id: true, groomName: true, brideName: true },
  });

  const serialized = gifts.map((g) => ({
    ...g,
    createdAt: g.createdAt.toISOString(),
    receivedAt: g.receivedAt?.toISOString() || null,
  }));

  return <MoneyGiftsClient gifts={serialized} weddings={weddings} />;
}