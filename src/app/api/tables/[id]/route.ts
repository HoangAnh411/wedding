import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, apiSuccess, apiError, verifyWeddingOwnership } from "@/lib/api-helper";
import { tableSchema } from "@/lib/validations";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(req, async (req, { userId, role }) => {
    const { id } = await params;
    const body = await req.json();
    const parsed = tableSchema.partial().parse(body);
    
    const existing = await prisma.table.findUnique({ where: { id } });
    if (!existing) return apiError('Not found', 404);

    if (!(await verifyWeddingOwnership(existing.weddingId, userId, role))) {
      return apiError("Unauthorized", 403);
    }

    const table = await prisma.table.update({ where: { id }, data: parsed });
    return apiSuccess(table);
  });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(req, async (req, { userId, role }) => {
    const { id } = await params;
    
    const existing = await prisma.table.findUnique({ where: { id } });
    if (!existing) return apiError('Not found', 404);

    if (!(await verifyWeddingOwnership(existing.weddingId, userId, role))) {
      return apiError("Unauthorized", 403);
    }

    await prisma.table.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  });
}