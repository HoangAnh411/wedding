import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import TablesClient from "./tables-client";

export const dynamic = "force-dynamic";

export default async function TablesPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const tables = await prisma.table.findMany({
    where: { wedding: { userId: session.user.id } },
    orderBy: { tableNumber: "asc" },
  });

  const weddings = await prisma.wedding.findMany({
    where: { userId: session.user.id },
    select: { id: true, groomName: true, brideName: true },
  });

  const guests = await prisma.guest.findMany({
    where: { wedding: { userId: session.user.id } },
    select: { id: true, name: true, tableNumber: true },
  });

  const serialized = tables.map((t) => ({
    ...t,
    createdAt: t.createdAt.toISOString(),
    guests: guests.filter((g) => g.tableNumber === t.tableNumber).map((g) => g.name),
  }));

  return <TablesClient tables={serialized} weddings={weddings} />;
}