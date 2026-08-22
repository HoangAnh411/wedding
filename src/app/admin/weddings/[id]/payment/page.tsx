import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import PaymentClient from "./payment-client";

export const dynamic = "force-dynamic";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id: weddingId } = await params;

  const wedding = await prisma.wedding.findUnique({
    where: { id: weddingId, userId: session.user.id },
  });

  if (!wedding) redirect("/admin");

  const paymentConfigs = await prisma.paymentConfig.findMany({
    where: { weddingId },
  });

  return <PaymentClient configs={paymentConfigs} weddingId={weddingId} />;
}
