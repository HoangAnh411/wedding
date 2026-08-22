import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, apiSuccess, apiError } from "@/lib/api-helper";
import { z } from "zod";

const rateLimit = new Map<string, number>();

const wishSchema = z.object({
  weddingId: z.string().min(1, "Thiếu weddingId"),
  guestName: z.string().min(1, "Thiếu guestName"),
  phone: z.string().optional(),
  content: z.string().min(1, "Thiếu nội dung"),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    if (rateLimit.has(ip) && now - rateLimit.get(ip)! < 60000) {
      return apiError("Thao tác quá nhanh, vui lòng thử lại sau", 429);
    }
    rateLimit.set(ip, now);

    const body = await request.json();
    const parsed = wishSchema.safeParse(body);

    if (!parsed.success) {
      return apiError("Dữ liệu không hợp lệ", 400);
    }

    const { weddingId, guestName, phone, content } = parsed.data;

    const wish = await prisma.wish.create({
      data: {
        weddingId,
        guestName,
        phone,
        content,
        isApproved: false, // Needs moderation
      },
    });

    return apiSuccess(wish);
  } catch (error) {
    return apiError(`Lỗi server: ${error instanceof Error ? error.message : "Unknown error"}`, 500);
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const weddingId = searchParams.get("weddingId");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "50", 10);
  const skip = (page - 1) * limit;

  if (!weddingId) {
    return apiError("Thiếu weddingId", 400);
  }

  try {
    const where = { weddingId, isApproved: true };
    const [wishes, total] = await Promise.all([
      prisma.wish.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: { id: true, guestName: true, content: true, createdAt: true, isFeatured: true }
      }),
      prisma.wish.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);
    return apiSuccess(wishes, 200, { total, page, limit, totalPages });
  } catch (error) {
    return apiError(`Lỗi server: ${error instanceof Error ? error.message : "Unknown error"}`, 500);
  }
}

export async function PUT(request: NextRequest) {
  return withAuth(request, async () => {
    try {
      const body = await request.json();
      const { id, isApproved } = body;

      if (!id) {
        return apiError("Thiếu id", 400);
      }

      const wish = await prisma.wish.update({
        where: { id },
        data: { isApproved },
      });

      return apiSuccess(wish);
    } catch (error) {
      return apiError(`Lỗi server: ${error instanceof Error ? error.message : "Unknown error"}`, 500);
    }
  });
}