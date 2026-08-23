import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helper";

export async function POST(req: NextRequest) {
  try {
    const { slug, password } = await req.json();

    if (!slug || !password) {
      return apiError("Thiếu thông tin", 400);
    }

    const wedding = await prisma.wedding.findUnique({
      where: { slug },
      select: { password: true }
    });

    if (!wedding) {
      return apiError("Không tìm thấy", 404);
    }

    if (wedding.password && wedding.password !== password) {
      return apiError("Mật khẩu không đúng", 401);
    }

    return apiSuccess({ success: true });
  } catch (err) {
    return apiError("Lỗi server", 500);
  }
}
