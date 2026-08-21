import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, apiSuccess } from "@/lib/api-helper";
import { budgetItemSchema } from "@/lib/validations";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(req, async () => {
    const { id } = await params;
    const body = await req.json();
    const parsed = budgetItemSchema.partial().parse(body);
    const item = await prisma.budgetItem.update({ where: { id }, data: parsed });
    return apiSuccess(item);
  });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(req, async () => {
    const { id } = await params;
    await prisma.budgetItem.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  });
}