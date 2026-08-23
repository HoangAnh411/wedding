import { prisma } from "@/lib/prisma";
import { withAuth, apiSuccess, apiError } from "@/lib/api-helper";

export async function GET(req: Request) {
  return withAuth(req, async (req, { role }) => {
    if (role !== "SUPERADMIN") {
      return apiError("Chỉ SUPERADMIN mới có quyền", 403);
    }

    const staff = await prisma.user.findMany({
      where: { role: "STAFF" },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return apiSuccess(staff);
  });
}

export async function POST(req: Request) {
  return withAuth(req, async (req, { role }) => {
    if (role !== "SUPERADMIN") {
      return apiError("Chỉ SUPERADMIN mới có quyền", 403);
    }

    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return apiError("Thiếu thông tin bắt buộc (name, email, password)", 400);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return apiError("Email đã tồn tại", 400);
    }

    const bcrypt = require("bcryptjs");
    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "STAFF",
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    // Send email to staff (non-blocking)
    const { sendStaffAccountEmail } = require("@/lib/email");
    sendStaffAccountEmail(email, password, name).catch(console.error);

    return apiSuccess(newUser);
  });
}
