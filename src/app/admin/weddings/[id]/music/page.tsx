import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import MusicClient from "./music-client";

export default async function MusicPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  const { id } = await params;

  const tracks = await prisma.musicTrack.findMany({
    where: { weddingId: id, wedding: { userId: session.user.id } },
    orderBy: { createdAt: "desc" },
  });

  const serializedTracks = tracks.map((t) => ({
    id: t.id,
    weddingId: t.weddingId,
    title: t.title,
    artist: t.artist,
    url: t.url,
    coverUrl: t.coverUrl,
    isDefault: t.isDefault,
    createdAt: t.createdAt.toISOString(),
  }));

  return (
    <MusicClient
      tracks={serializedTracks}
      weddingId={id}
    />
  );
}