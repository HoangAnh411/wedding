import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, apiSuccess, apiError } from "@/lib/api-helper";
import { galleryImageSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  return withAuth(req, async (req, { userId }) => {
    const { searchParams } = new URL(req.url);
    const weddingId = searchParams.get("weddingId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const skip = (page - 1) * limit;

    const where = weddingId ? { weddingId, wedding: { userId } } : { wedding: { userId } };

    const [images, total] = await Promise.all([
      prisma.galleryImage.findMany({
        where,
        orderBy: { orderIndex: "asc" },
        skip,
        take: limit,
      }),
      prisma.galleryImage.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);
    return apiSuccess(images, 200, { total, page, limit, totalPages });
  });
}

export async function POST(req: NextRequest) {
  return withAuth(req, async (req, { userId }) => {
    const body = await req.json();
    const parsed = galleryImageSchema.parse(body);
    
    const wedding = await prisma.wedding.findFirst({ where: { id: parsed.weddingId, userId } });
    if (!wedding) return apiError("Not found", 404);
const image = await prisma.galleryImage.create({ data: parsed });
    return apiSuccess(image, 201);
  });
}