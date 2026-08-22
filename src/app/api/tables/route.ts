import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, apiSuccess, apiError } from "@/lib/api-helper";
import { tableSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  return withAuth(req, async (req, { userId }) => {
    const { searchParams } = new URL(req.url);
    const weddingId = searchParams.get("weddingId");
    const tables = await prisma.table.findMany({
      where: weddingId ? { weddingId, wedding: { userId } } : { wedding: { userId } },
      orderBy: { tableNumber: "asc" },
    });
    return apiSuccess(tables);
  });
}

export async function POST(req: NextRequest) {
  return withAuth(req, async (req, { userId }) => {
    const body = await req.json();
    const parsed = tableSchema.parse(body);
    
    const wedding = await prisma.wedding.findFirst({ where: { id: parsed.weddingId, userId } });
    if (!wedding) return apiError("Not found", 404);
const table = await prisma.table.create({ data: parsed });
    return apiSuccess(table, 201);
  });
}