import { prisma } from "@/lib/prisma";
import { withAuth, apiSuccess, apiError, verifyWeddingOwnership } from "@/lib/api-helper";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return withAuth(req, async (req, { userId, role }) => {
    const { id } = await params;
    
    const existing = await prisma.galleryImage.findUnique({ where: { id } });
    if (!existing) return apiError('Not found', 404);

    if (!(await verifyWeddingOwnership(existing.weddingId, userId, role))) {
      return apiError("Unauthorized", 403);
    }

    await prisma.galleryImage.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  });
}