import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, apiSuccess, apiError } from "@/lib/api-helper";
import { sendInvitationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  return withAuth(req, async (req, { userId }) => {
    try {
      const { weddingId, guestIds } = await req.json();

      if (!weddingId) {
        return apiError("Thiếu weddingId", 400);
      }

      const wedding = await prisma.wedding.findFirst({
        where: { id: weddingId, userId },
      });
      if (!wedding) {
        return apiError("Không tìm thấy đám cưới", 404);
      }

      const where = guestIds
        ? { id: { in: guestIds as string[] }, weddingId }
        : { weddingId, hasSentInvitation: false };

      const guests = await prisma.guest.findMany({
        where,
      });

      const results: { name: string; email: string; success: boolean; message: string }[] = [];

      for (const guest of guests) {
        if (!guest.email) {
          results.push({
            name: guest.name,
            email: "",
            success: false,
            message: "Không có email",
          });
          continue;
        }

        const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/${wedding.slug}?guest=${guest.inviteCode}`;

        const result = await sendInvitationEmail(guest.email, {
          guestName: guest.name,
          groomName: wedding.groomName,
          brideName: wedding.brideName,
          weddingDate: wedding.weddingDate
            ? new Date(wedding.weddingDate).toLocaleDateString("vi-VN")
            : "Sắp diễn ra",
          venueName: wedding.venueName || "Địa điểm tổ chức",
          venueAddress: wedding.venueAddress || "",
          invitationUrl,
        });

        if (result.success) {
          await prisma.guest.update({
            where: { id: guest.id },
            data: { hasSentInvitation: true },
          });
        }

        results.push({
          name: guest.name,
          email: guest.email,
          success: result.success,
          message: result.message,
        });
      }

      const sent = results.filter((r) => r.success).length;
      const failed = results.filter((r) => !r.success).length;

      return apiSuccess({
        total: guests.length,
        sent,
        failed,
        results,
      });
    } catch (err) {
      return apiError(
        `Lỗi: ${err instanceof Error ? err.message : "Unknown"}`,
        500,
      );
    }
  });
}