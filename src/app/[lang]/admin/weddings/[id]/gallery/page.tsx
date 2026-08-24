import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import GalleryClient from "./gallery-client";

export default async function GalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  const { id } = await params;

  const images = await prisma.galleryImage.findMany({
    where: { weddingId: id, wedding: { userId: session.user.id } },
    orderBy: { orderIndex: "asc" },
  });

  const serializedImages = images.map((img) => ({
    id: img.id,
    weddingId: img.weddingId,
    imageUrl: img.imageUrl,
    caption: img.caption,
    thumbnailUrl: img.thumbnailUrl,
    isVideo: img.isVideo,
    videoUrl: img.videoUrl,
    orderIndex: img.orderIndex,
    createdAt: img.createdAt.toISOString(),
  }));

  return (
    <GalleryClient
      images={serializedImages}
      weddingId={id}
    />
  );
}