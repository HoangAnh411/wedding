import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import PaymentsClient from "./payments-client";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const paymentConfigs = await prisma.paymentConfig.findMany({
    where: { userId: session.user.id },
  });

  return <PaymentsClient configs={paymentConfigs} />;
}
