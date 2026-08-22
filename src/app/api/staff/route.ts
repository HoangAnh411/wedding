import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const staff = await prisma.user.findMany({
      where: { role: "STAFF" },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json(staff);
  } catch (error) {
    console.error("GET /api/staff error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
