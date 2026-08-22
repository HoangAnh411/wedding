import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, apiSuccess, apiError } from "@/lib/api-helper";
import { weddingSchema } from "@/lib/validations";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(req, async () => {
    const { id } = await params;
    const wedding = await prisma.wedding.findUnique({
      where: { id },
      include: {
        _count: { select: { guests: true, vendors: true, checklistItems: true, tables: true, moneyGifts: true } },
        timelineEvents: { orderBy: { orderIndex: "asc" } },
        paymentConfigs: { where: { isActive: true } },
      },
    });
    if (!wedding) return apiError("Not found", 404);
    return apiSuccess(wedding);
  });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(req, async () => {
    const { id } = await params;
    const body = await req.json();
    const parsed = weddingSchema.partial().parse(body);
    const wedding = await prisma.wedding.update({ where: { id }, data: parsed });
    return apiSuccess(wedding);
  });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(req, async () => {
    const { id } = await params;
    await prisma.wedding.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  });
}