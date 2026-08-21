import { prisma } from "@/lib/prisma";
import { withAuth, apiSuccess } from "@/lib/api-helper";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return withAuth(req, async () => {
    const { id } = await params;
    await prisma.galleryImage.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  });
}