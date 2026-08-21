import { NextRequest, NextResponse } from "next/server";
import { sendZaloInvitation } from "@/lib/zalo";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, templateId, templateData } = body;

    if (!phoneNumber || !templateId) {
      return NextResponse.json(
        { error: "Thiếu thông tin bắt buộc (phoneNumber, templateId)" },
        { status: 400 },
      );
    }

    const result = await sendZaloInvitation(phoneNumber, templateId, templateData || {});

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