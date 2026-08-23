import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, apiError, apiSuccess, verifyWeddingOwnership } from "@/lib/api-helper";
import { guestSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  return withAuth(req, async (req, { userId, role }) => {
    const { searchParams } = new URL(req.url);
    const weddingId = searchParams.get("weddingId");
    if (!weddingId) return apiError("Missing weddingId", 400);

    if (!(await verifyWeddingOwnership(weddingId, userId, role))) {
      return apiError("Unauthorized", 403);
    }

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const skip = (page - 1) * limit;

    const where = { weddingId };

    const [guests, total] = await Promise.all([
      prisma.guest.findMany({
        where,
        include: { rsvpResponses: true },
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
  return withAuth(req, async (req, { userId, role }) => {
    const body = await req.json();
    const parsed = guestSchema.parse(body);

    if (!(await verifyWeddingOwnership(parsed.weddingId, userId, role))) {
      return apiError("Not found", 404);
    }

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