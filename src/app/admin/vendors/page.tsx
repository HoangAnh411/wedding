import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { VENDOR_CATEGORIES } from "@/types";
import VendorsClient from "./vendors-client";

export const dynamic = "force-dynamic";

export default async function VendorsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const vendors = await prisma.vendor.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const serialized = vendors.map((v) => ({
    ...v,
    createdAt: v.createdAt.toISOString(),
    updatedAt: v.updatedAt.toISOString(),
    reminderDate: v.reminderDate?.toISOString() || null,
  }));

  return <VendorsClient vendors={serialized} categories={VENDOR_CATEGORIES} />;
}
