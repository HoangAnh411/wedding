import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BUDGET_CATEGORIES } from "@/types";
import BudgetClient from "./budget-client";

export const dynamic = "force-dynamic";

export default async function BudgetPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const items = await prisma.budgetItem.findMany({
    where: { wedding: { userId: session.user.id } },
    include: { vendor: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const weddings = await prisma.wedding.findMany({
    where: { userId: session.user.id },
    select: { id: true, groomName: true, brideName: true },
  });

  const serialized = items.map((i) => ({
    ...i,
    createdAt: i.createdAt.toISOString(),
    updatedAt: i.updatedAt.toISOString(),
    paidDate: i.paidDate?.toISOString() || null,
    vendorName: i.vendor?.name || null,
  }));

  return <BudgetClient items={serialized} weddings={weddings} categories={BUDGET_CATEGORIES} />;
}