import { prisma } from "@/lib/prisma";
import { withAuth, apiSuccess, apiError } from "@/lib/api-helper";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(req, async (req, { role }) => {
    if (role !== "SUPERADMIN") {
      return apiError("Chỉ SUPERADMIN mới có quyền", 403);
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return apiError("Không tìm thấy user", 404);
    }

    if (user.role !== "STAFF") {
      return apiError("Chỉ có thể xóa user STAFF", 400);
    }

    await prisma.user.delete({
      where: { id },
    });

    return apiSuccess({ deleted: true });
  });
}
