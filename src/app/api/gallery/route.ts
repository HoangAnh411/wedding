import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, apiSuccess } from "@/lib/api-helper";
import { galleryImageSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  return withAuth(req, async (req, { userId }) => {
    const { searchParams } = new URL(req.url);
    const weddingId = searchParams.get("weddingId");
    const images = await prisma.galleryImage.findMany({
      where: weddingId ? { weddingId } : { wedding: { userId } },
      orderBy: { orderIndex: "asc" },
    });
    return apiSuccess(images);
  });
}

export async function POST(req: NextRequest) {
  return withAuth(req, async (req) => {
    const body = await req.json();
    const parsed = galleryImageSchema.parse(body);
    const image = await prisma.galleryImage.create({ data: parsed });
    return apiSuccess(image, 201);
  });
}