import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, apiError, apiSuccess } from "@/lib/api-helper";
import { guestSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  return withAuth(req, async (req, { userId }) => {
    const { searchParams } = new URL(req.url);
    const weddingId = searchParams.get("weddingId");

    const guests = await prisma.guest.findMany({
      where: weddingId ? { weddingId } : { wedding: { userId } },
      orderBy: { createdAt: "desc" },
    });

    return apiSuccess(guests);
  });
}

export async function POST(req: NextRequest) {
  return withAuth(req, async (req) => {
    const body = await req.json();
    const parsed = guestSchema.parse(body);

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