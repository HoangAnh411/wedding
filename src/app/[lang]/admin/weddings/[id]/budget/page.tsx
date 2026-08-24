import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BUDGET_CATEGORIES } from "@/types";
import BudgetClient from "./budget-client";

export const dynamic = "force-dynamic";

export default async function BudgetPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id } = await params;

  const items = await prisma.budgetItem.findMany({
    where: { weddingId: id, wedding: { userId: session.user.id } },
    include: { vendor: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const serialized = items.map((i) => ({
    ...i,
    createdAt: i.createdAt.toISOString(),
    updatedAt: i.updatedAt.toISOString(),
    paidDate: i.paidDate?.toISOString() || null,
    vendorName: i.vendor?.name || null,
  }));

  return <BudgetClient items={serialized} weddingId={id} categories={BUDGET_CATEGORIES} />;
}