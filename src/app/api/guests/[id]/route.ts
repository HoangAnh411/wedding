import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, apiError, apiSuccess } from "@/lib/api-helper";
import { guestSchema } from "@/lib/validations";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return withAuth(req, async (req, { userId }) => {
    const { id } = await params;
    const guest = await prisma.guest.findFirst({ where: { id, wedding: { userId } } });
    if (!guest) return apiError("Not found", 404);
    return apiSuccess(guest);
  });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return withAuth(req, async (req, { userId }) => {
    const { id } = await params;
    const body = await req.json();
    const parsed = guestSchema.partial().parse(body);
    
    const existing = await prisma.guest.findFirst({ where: { id, wedding: { userId } } });
    if (!existing) return apiError('Not found', 404);
const guest = await prisma.guest.update({ where: { id }, data: parsed });
    return apiSuccess(guest);
  });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return withAuth(req, async (req, { userId }) => {
    const { id } = await params;
    
    const existing = await prisma.guest.findFirst({ where: { id, wedding: { userId } } });
    if (!existing) return apiError('Not found', 404);
await prisma.guest.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  });
}