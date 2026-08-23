import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BuilderClient from "./builder-client";

export default async function BuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id: weddingId } = await params;

  const wedding = await prisma.wedding.findUnique({
    where: { id: weddingId, userId: session.user.id },
    select: { id: true, theme: true, primaryColor: true, layoutConfig: true, slug: true }
  });

  if (!wedding) redirect("/admin");

  // Format default layout if empty
  const defaultLayout = ["hero", "countdown", "story", "events", "gallery", "rsvp", "wishes", "map", "payment"];
  const currentLayout = Array.isArray(wedding.layoutConfig) && wedding.layoutConfig.length > 0 
    ? wedding.layoutConfig 
    : defaultLayout;

  return <BuilderClient 
    weddingId={wedding.id} 
    slug={wedding.slug}
    initialTheme={wedding.theme || "modern"} 
    initialColor={wedding.primaryColor || "#e11d48"} 
    initialLayout={currentLayout as string[]} 
  />;
}
