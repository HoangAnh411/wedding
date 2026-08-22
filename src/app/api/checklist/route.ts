import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, apiSuccess, apiError } from "@/lib/api-helper";
import { checklistItemSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  return withAuth(req, async (req, { userId }) => {
    const { searchParams } = new URL(req.url);
    const weddingId = searchParams.get("weddingId");
    const items = await prisma.checklistItem.findMany({
      where: weddingId ? { weddingId, wedding: { userId } } : { wedding: { userId } },
      orderBy: { createdAt: "asc" },
    });
    return apiSuccess(items);
  });
}

export async function POST(req: NextRequest) {
  return withAuth(req, async (req, { userId }) => {
    const body = await req.json();
    const parsed = checklistItemSchema.parse(body);
    
    const wedding = await prisma.wedding.findFirst({ where: { id: parsed.weddingId, userId } });
    if (!wedding) return apiError("Not found", 404);
const item = await prisma.checklistItem.create({ data: parsed });
    return apiSuccess(item, 201);
  });
}