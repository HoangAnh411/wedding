import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { weddingId, guestName, phone, content } = body;

    if (!weddingId || !guestName || !content) {
      return NextResponse.json(
        { error: "Thiếu thông tin bắt buộc" },
        { status: 400 },
      );
    }

    const wish = await prisma.wish.create({
      data: {
        weddingId,
        guestName,
        phone,
        content,
        isApproved: false, // Needs moderation
      },
    });

    return NextResponse.json({ data: wish });
  } catch (error) {
    return NextResponse.json(
      { error: `Lỗi server: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const weddingId = searchParams.get("weddingId");

  if (!weddingId) {
    return NextResponse.json({ error: "Thiếu weddingId" }, { status: 400 });
  }

  try {
    const wishes = await prisma.wish.findMany({
      where: { weddingId, isApproved: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: wishes });
  } catch (error) {
    return NextResponse.json(
      { error: `Lỗi server: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, isApproved } = body;

    if (!id) {
      return NextResponse.json({ error: "Thiếu id" }, { status: 400 });
    }

    const wish = await prisma.wish.update({
      where: { id },
      data: { isApproved },
    });

    return NextResponse.json({ data: wish });
  } catch (error) {
    return NextResponse.json(
      { error: `Lỗi server: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    );
  }
}