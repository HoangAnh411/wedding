import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, apiSuccess, apiError } from "@/lib/api-helper";
import { moneyGiftSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  return withAuth(req, async (req, { userId }) => {
    const { searchParams } = new URL(req.url);
    const weddingId = searchParams.get("weddingId");
    const gifts = await prisma.moneyGift.findMany({
      where: weddingId ? { weddingId, wedding: { userId } } : { wedding: { userId } },
      orderBy: { createdAt: "desc" },
    });
    return apiSuccess(gifts);
  });
}

export async function POST(req: NextRequest) {
  return withAuth(req, async (req, { userId }) => {
    const body = await req.json();
    const parsed = moneyGiftSchema.parse(body);
    
    const wedding = await prisma.wedding.findFirst({ where: { id: parsed.weddingId, userId } });
    if (!wedding) return apiError("Not found", 404);
const gift = await prisma.moneyGift.create({ data: parsed });
    return apiSuccess(gift, 201);
  });
}