import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, apiSuccess } from "@/lib/api-helper";
import { checkInSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  return withAuth(req, async (req, { userId }) => {
    const { searchParams } = new URL(req.url);
    const weddingId = searchParams.get("weddingId");
    const checkins = await prisma.checkIn.findMany({
      where: weddingId ? { weddingId } : { wedding: { userId } },
      include: { guest: { select: { name: true, tableNumber: true } } },
      orderBy: { checkedInAt: "desc" },
    });
    return apiSuccess(checkins);
  });
}

export async function POST(req: NextRequest) {
  return withAuth(req, async (req) => {
    const body = await req.json();
    const parsed = checkInSchema.parse(body);
    const checkin = await prisma.checkIn.create({ data: parsed });
    return apiSuccess(checkin, 201);
  });
}