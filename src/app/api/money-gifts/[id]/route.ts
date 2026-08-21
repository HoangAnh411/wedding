import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, apiSuccess } from "@/lib/api-helper";
import { moneyGiftSchema } from "@/lib/validations";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(req, async () => {
    const { id } = await params;
    const body = await req.json();
    const parsed = moneyGiftSchema.partial().parse(body);
    const gift = await prisma.moneyGift.update({ where: { id }, data: parsed });
    return apiSuccess(gift);
  });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(req, async () => {
    const { id } = await params;
    await prisma.moneyGift.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  });
}