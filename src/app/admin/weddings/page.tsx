import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { generateSlug, generateInviteCode } from "@/lib/utils";
import WeddingsClient from "./weddings-client";

export const dynamic = "force-dynamic";

export default async function WeddingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const weddings = await prisma.wedding.findMany({
    where: { userId: session.user.id },
    include: {
      _count: { select: { guests: true, vendors: true, checklistItems: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = weddings.map((w) => ({
    id: w.id,
    slug: w.slug,
    title: w.title || "",
    groomName: w.groomName,
    brideName: w.brideName,
    weddingDate: w.weddingDate?.toISOString() || null,
    venueName: w.venueName,
    coverImage: w.coverImage,
    guestCount: w._count.guests,
    vendorCount: w._count.vendors,
    confirmedCount: 0,
  }));

  return <WeddingsClient weddings={serialized} userId={session.user.id!} />;
}