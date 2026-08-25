import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, apiSuccess, apiError } from "@/lib/api-helper";
import bcrypt from "bcryptjs";

export async function PUT(req: NextRequest) {
  return withAuth(req, async (req, { userId }) => {
    const body = await req.json();
    const { name, currentPassword, newPassword } = body;
    
    let updateData: any = { name };

    if (newPassword) {
      if (!currentPassword) {
        return apiError("Vui lòng nhập mật khẩu hiện tại", 400);
      }
      
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return apiError("Người dùng không tồn tại", 404);
      
      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isMatch) {
        return apiError("Mật khẩu hiện tại không đúng", 400);
      }
      
      updateData.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, name: true, email: true },
    });
    return apiSuccess(updatedUser);
  });
}