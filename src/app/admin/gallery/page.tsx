import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import GalleryClient from "./gallery-client";

export default async function GalleryPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const weddings = await prisma.wedding.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const images = await prisma.galleryImage.findMany({
    where: { wedding: { userId: session.user.id } },
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
      weddings={weddings.map((w) => ({
        id: w.id,
        groomName: w.groomName,
        brideName: w.brideName,
      }))}
    />
  );
}