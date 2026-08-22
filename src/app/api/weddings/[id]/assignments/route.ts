import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: weddingId } = await params;

    const assignments = await prisma.weddingAssignment.findMany({
      where: { weddingId },
      include: {
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    return NextResponse.json(assignments);
  } catch (error) {
    console.error("GET assignments error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: weddingId } = await params;
    const body = await req.json();
    const { staffId, permissions } = body;

    if (!staffId || !permissions || !Array.isArray(permissions)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const assignment = await prisma.weddingAssignment.upsert({
      where: {
        weddingId_staffId: {
          weddingId,
          staffId,
        }
      },
      update: {
        permissions,
      },
      create: {
        weddingId,
        staffId,
        permissions,
      }
    });

    return NextResponse.json(assignment);
  } catch (error) {
    console.error("POST assignments error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: weddingId } = await params;
    const { searchParams } = new URL(req.url);
    const staffId = searchParams.get("staffId");

    if (!staffId) {
      return NextResponse.json({ error: "Missing staffId" }, { status: 400 });
    }

    await prisma.weddingAssignment.delete({
      where: {
        weddingId_staffId: {
          weddingId,
          staffId,
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE assignments error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
