import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ChecklistClient from "./checklist-client";

export const dynamic = "force-dynamic";

export default async function ChecklistPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const items = await prisma.checklistItem.findMany({
    where: { wedding: { userId: session.user.id } },
    orderBy: { createdAt: "asc" },
  });

  const weddings = await prisma.wedding.findMany({
    where: { userId: session.user.id },
    select: { id: true, groomName: true, brideName: true },
  });

  const serialized = items.map((i) => ({
    ...i,
    createdAt: i.createdAt.toISOString(),
    updatedAt: i.updatedAt.toISOString(),
    dueDate: i.dueDate?.toISOString() || null,
    completedAt: i.completedAt?.toISOString() || null,
  }));

  return <ChecklistClient items={serialized} weddings={weddings} />;
}