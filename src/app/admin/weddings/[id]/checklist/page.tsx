import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ChecklistClient from "./checklist-client";

export const dynamic = "force-dynamic";

export default async function ChecklistPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  const { id } = await params;

  const items = await prisma.checklistItem.findMany({
    where: { weddingId: id, wedding: { userId: session.user.id } },
    orderBy: { createdAt: "asc" },
  });

  const serialized = items.map((i) => ({
    ...i,
    createdAt: i.createdAt.toISOString(),
    updatedAt: i.updatedAt.toISOString(),
    dueDate: i.dueDate?.toISOString() || null,
    completedAt: i.completedAt?.toISOString() || null,
  }));

  return <ChecklistClient items={serialized} weddingId={id} />;
}