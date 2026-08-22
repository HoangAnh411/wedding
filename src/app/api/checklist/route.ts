import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, apiSuccess, apiError, verifyWeddingOwnership } from "@/lib/api-helper";
import { checklistItemSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  return withAuth(req, async (req, { userId, role }) => {
    const { searchParams } = new URL(req.url);
    const weddingId = searchParams.get("weddingId");
    if (!weddingId) return apiError("Missing weddingId", 400);

    if (!(await verifyWeddingOwnership(weddingId, userId, role))) {
      return apiError("Unauthorized", 403);
    }

    const items = await prisma.checklistItem.findMany({
      where: { weddingId },
      orderBy: { createdAt: "asc" },
    });
    return apiSuccess(items);
  });
}

export async function POST(req: NextRequest) {
  return withAuth(req, async (req, { userId, role }) => {
    const body = await req.json();
    const parsed = checklistItemSchema.parse(body);
    
    if (!(await verifyWeddingOwnership(parsed.weddingId, userId, role))) {
      return apiError("Not found", 404);
    }

    const item = await prisma.checklistItem.create({ data: parsed });
    return apiSuccess(item, 201);
  });
}