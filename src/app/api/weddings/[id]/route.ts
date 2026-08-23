import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, apiSuccess, apiError, verifyWeddingOwnership } from "@/lib/api-helper";
import { weddingSchema } from "@/lib/validations";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(req, async (req, { userId, role }) => {
    const { id } = await params;
    if (!(await verifyWeddingOwnership(id, userId, role))) {
      return apiError("Không có quyền truy cập", 403);
    }
    const wedding = await prisma.wedding.findUnique({
      where: { id },
      include: {
        _count: { select: { guests: true, checklistItems: true, tables: true, moneyGifts: true } },
        timelineEvents: { orderBy: { orderIndex: "asc" } },
      },
    });
    if (!wedding) return apiError("Not found", 404);
    return apiSuccess(wedding);
  });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(req, async (req, { userId, role }) => {
    const { id } = await params;
    if (!(await verifyWeddingOwnership(id, userId, role))) {
      return apiError("Không có quyền chỉnh sửa", 403);
    }
    const body = await req.json();
    const parsed: any = weddingSchema.partial().parse(body);
    
    // Xử lý chuỗi rỗng cho các trường DateTime để tránh lỗi Prisma
    if (parsed.weddingDate === "") parsed.weddingDate = null;
    if (parsed.engagementDate === "") parsed.engagementDate = null;
    if (parsed.ceremonyDate === "") parsed.ceremonyDate = null;
    if (parsed.receptionDate === "") parsed.receptionDate = null;

    const wedding = await prisma.wedding.update({ where: { id }, data: parsed });
    return apiSuccess(wedding);
  });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(req, async (req, { userId, role }) => {
    const { id } = await params;
    if (!(await verifyWeddingOwnership(id, userId, role))) {
      return apiError("Không có quyền xóa", 403);
    }
    await prisma.wedding.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  });
}