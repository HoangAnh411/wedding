import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { guestId, weddingId, isAttending, guestCount, mealChoice, dietaryRestrictions, message } = body;

    if (!guestId || !weddingId) {
      return NextResponse.json(
        { error: "Thiếu thông tin bắt buộc" },
        { status: 400 },
      );
    }

    // Create RSVP response
    const rsvp = await prisma.rsvpResponse.create({
      data: {
        guestId,
        weddingId,
        isAttending,
        guestCount: guestCount || 1,
        mealChoice,
        dietaryRestrictions,
        message,
      },
    });

    // Update guest status
    await prisma.guest.update({
      where: { id: guestId },
      data: {
        isAttending,
        rsvpAt: new Date(),
      },
    });

    return NextResponse.json({ data: rsvp });
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
    return NextResponse.json(
      { error: "Thiếu weddingId" },
      { status: 400 },
    );
  }

  try {
    const responses = await prisma.rsvpResponse.findMany({
      where: { weddingId },
      include: { wedding: true },
      orderBy: { respondedAt: "desc" },
    });

    return NextResponse.json({ data: responses });
  } catch (error) {
    return NextResponse.json(
      { error: `Lỗi server: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    );
  }
}