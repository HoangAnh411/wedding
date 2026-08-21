import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, apiError, apiSuccess } from "@/lib/api-helper";
import { vendorSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  return withAuth(req, async (req, { userId }) => {
    const { searchParams } = new URL(req.url);
    const weddingId = searchParams.get("weddingId");

    const vendors = await prisma.vendor.findMany({
      where: weddingId ? { weddingId } : { wedding: { userId } },
      orderBy: { createdAt: "desc" },
    });
    return apiSuccess(vendors);
  });
}

export async function POST(req: NextRequest) {
  return withAuth(req, async (req) => {
    const body = await req.json();
    const parsed = vendorSchema.parse(body);
    const vendor = await prisma.vendor.create({ data: parsed });
    return apiSuccess(vendor, 201);
  });
}