import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import MoneyGiftsClient from "./money-gifts-client";

export const dynamic = "force-dynamic";

export default async function MoneyGiftsPage({
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

  const gifts = await prisma.moneyGift.findMany({
    where: { weddingId },
    orderBy: { createdAt: "desc" },
  });

  const serialized = gifts.map((g) => ({
    ...g,
    createdAt: g.createdAt.toISOString(),
    receivedAt: g.receivedAt?.toISOString() || null,
  }));

  return <MoneyGiftsClient gifts={serialized} weddingId={weddingId} />;
}