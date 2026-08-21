import { NextRequest, NextResponse } from "next/server";
import { sendInvitationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, guestName, groomName, brideName, weddingDate, venueName, venueAddress, invitationUrl } = body;

    if (!to || !guestName) {
      return NextResponse.json(
        { error: "Thiếu thông tin bắt buộc" },
        { status: 400 },
      );
    }

    const result = await sendInvitationEmail(to, {
      guestName,
      groomName: groomName || "Chú rể",
      brideName: brideName || "Cô dâu",
      weddingDate: weddingDate || "Sắp diễn ra",
      venueName: venueName || "Địa điểm tổ chức",
      venueAddress: venueAddress || "",
      invitationUrl,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }

    return NextResponse.json({ message: result.message, data: result.data });
  } catch (error) {
    return NextResponse.json(
      { error: `Lỗi server: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    );
  }
}