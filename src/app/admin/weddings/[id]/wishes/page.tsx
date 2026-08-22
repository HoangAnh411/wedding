import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import WishesClient from "./wishes-client";

export const dynamic = "force-dynamic";

export default async function WishesPage({
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

  const wishes = await prisma.wish.findMany({
    where: { weddingId },
    orderBy: { createdAt: "desc" },
  });

  const serialized = wishes.map((w) => ({
    ...w,
    createdAt: w.createdAt.toISOString(),
  }));

  return <WishesClient wishes={serialized} weddingId={weddingId} />;
}
