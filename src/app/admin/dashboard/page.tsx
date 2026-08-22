import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const weddings = await prisma.wedding.findMany({
    where: { userId: session.user.id },
    include: {
      _count: { select: { guests: true, checklistItems: true } },
    },
  });

  const totalGuests = weddings.reduce((sum, w) => sum + w._count.guests, 0);

  const confirmedGuests = await prisma.guest.count({
    where: {
      wedding: { userId: session.user.id },
      isAttending: true,
    },
  });

  const totalChecklist = weddings.reduce((sum, w) => sum + w._count.checklistItems, 0);
  const completedChecklist = await prisma.checklistItem.count({
    where: {
      wedding: { userId: session.user.id },
      isCompleted: true,
    },
  });
  const progress = totalChecklist > 0 ? Math.round((completedChecklist / totalChecklist) * 100) : 0;

  const serializedWeddings = weddings.map((w) => ({
    id: w.id,
    slug: w.slug,
    groomName: w.groomName,
    brideName: w.brideName,
    weddingDate: w.weddingDate?.toISOString() || null,
    venueName: w.venueName,
    guestCount: w._count.guests,
  }));

  return (
    <DashboardClient
      weddings={serializedWeddings}
      stats={{
        totalGuests,
        confirmedGuests,
        progress,
      }}
    />
  );
}