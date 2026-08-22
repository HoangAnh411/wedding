import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, apiSuccess, apiError, verifyWeddingOwnership } from "@/lib/api-helper";
import { tableSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  return withAuth(req, async (req, { userId, role }) => {
    const { searchParams } = new URL(req.url);
    const weddingId = searchParams.get("weddingId");
    if (!weddingId) return apiError("Missing weddingId", 400);

    if (!(await verifyWeddingOwnership(weddingId, userId, role))) {
      return apiError("Unauthorized", 403);
    }

    const tables = await prisma.table.findMany({
      where: { weddingId },
      orderBy: { tableNumber: "asc" },
    });
    return apiSuccess(tables);
  });
}

export async function POST(req: NextRequest) {
  return withAuth(req, async (req, { userId, role }) => {
    const body = await req.json();
    const parsed = tableSchema.parse(body);
    
    if (!(await verifyWeddingOwnership(parsed.weddingId, userId, role))) {
      return apiError("Not found", 404);
    }

    const table = await prisma.table.create({ data: parsed });
    return apiSuccess(table, 201);
  });
}