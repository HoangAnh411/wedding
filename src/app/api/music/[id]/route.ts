import { prisma } from "@/lib/prisma";
import { withAuth, apiSuccess, apiError } from "@/lib/api-helper";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return withAuth(req, async (req, { userId }) => {
    const { id } = await params;
    
    const existing = await prisma.musicTrack.findFirst({ where: { id, wedding: { userId } } });
    if (!existing) return apiError('Not found', 404);
await prisma.musicTrack.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  });
}