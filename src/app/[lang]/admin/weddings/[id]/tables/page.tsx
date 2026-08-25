import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import TablesClient from "./tables-client";

export const dynamic = "force-dynamic";

export default async function TablesPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id } = await params;

  const tables = await prisma.table.findMany({
    where: { weddingId: id, wedding: { userId: session.user.id } },
    orderBy: { tableNumber: "asc" },
  });

  const guests = await prisma.guest.findMany({
    where: { weddingId: id, wedding: { userId: session.user.id } },
    select: { id: true, name: true, tableNumber: true },
  });

  const unassignedGuests = guests.filter(g => g.tableNumber === null).map(g => ({ id: g.id, name: g.name }));
  
  const serialized = tables.map((t) => ({
    ...t,
    createdAt: t.createdAt.toISOString(),
    guests: guests.filter((g) => g.tableNumber === t.tableNumber).map((g) => ({ id: g.id, name: g.name })),
  }));

  return <TablesClient tables={serialized} unassignedGuests={unassignedGuests} weddingId={id} />;
}