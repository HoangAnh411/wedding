import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, apiError, apiSuccess } from "@/lib/api-helper";
import { guestSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  return withAuth(req, async (req, { userId }) => {
    const { searchParams } = new URL(req.url);
    const weddingId = searchParams.get("weddingId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const skip = (page - 1) * limit;

    const where = weddingId ? { weddingId, wedding: { userId } } : { wedding: { userId } };

    const [guests, total] = await Promise.all([
      prisma.guest.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.guest.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);
    return apiSuccess(guests, 200, { total, page, limit, totalPages });
  });
}

export async function POST(req: NextRequest) {
  return withAuth(req, async (req, { userId }) => {
    const body = await req.json();
    const parsed = guestSchema.parse(body);

    
    const wedding = await prisma.wedding.findFirst({ where: { id: parsed.weddingId, userId } });
    if (!wedding) return apiError("Not found", 404);
const guest = await prisma.guest.create({
      data: {
        ...parsed,
        weddingId: parsed.weddingId,
        inviteCode: parsed.inviteCode || `INV${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      },
    });

    return apiSuccess(guest, 201);
  });
}