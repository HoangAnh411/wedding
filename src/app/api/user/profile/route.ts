import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, apiSuccess } from "@/lib/api-helper";

export async function PUT(req: NextRequest) {
  return withAuth(req, async (req, { userId }) => {
    const body = await req.json();
    const { name } = body;
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name },
      select: { id: true, name: true, email: true },
    });
    return apiSuccess(user);
  });
}