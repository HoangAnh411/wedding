import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, apiSuccess } from "@/lib/api-helper";
import { weddingSchema } from "@/lib/validations";
import { generateSlug } from "@/lib/utils";

export async function GET(req: NextRequest) {
  return withAuth(req, async (req, { userId }) => {
    const weddings = await prisma.wedding.findMany({
      where: { userId },
      include: { _count: { select: { guests: true, checklistItems: true } } },
      orderBy: { createdAt: "desc" },
    });
    return apiSuccess(weddings);
  });
}

export async function POST(req: NextRequest) {
  return withAuth(req, async (req, { userId }) => {
    const body = await req.json();
    const parsed = weddingSchema.parse(body);
    const slug = parsed.slug || generateSlug(`${parsed.groomName}-${parsed.brideName}`);

    const wedding = await prisma.wedding.create({
      data: { ...parsed, slug, userId },
    });
    return apiSuccess(wedding, 201);
  });
}