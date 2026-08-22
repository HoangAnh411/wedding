import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SettingsClient from "./settings-client";

export default async function SettingsPage({
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

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true },
  });

  if (!user) redirect("/admin/login");

  return <SettingsClient user={user} weddingId={weddingId} />;
}