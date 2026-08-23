import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, apiSuccess, apiError, verifyWeddingOwnership } from "@/lib/api-helper";
import { sendThankYouEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  return withAuth(req, async (req, { userId, role }) => {
    try {
      const { weddingId, guestIds } = await req.json();

      if (!weddingId) {
        return apiError("Thiếu weddingId", 400);
      }

      if (!(await verifyWeddingOwnership(weddingId, userId, role))) {
        return apiError("Không tìm thấy đám cưới", 404);
      }
      
      const wedding = await prisma.wedding.findUnique({
        where: { id: weddingId },
      });
      if (!wedding) {
        return apiError("Không tìm thấy đám cưới", 404);
      }

      const where = guestIds
        ? { id: { in: guestIds as string[] }, weddingId }
        : { weddingId, isAttending: true, thankYouSent: false };

      const guests = await prisma.guest.findMany({
        where,
      });

      const results: { name: string; email: string; success: boolean; message: string }[] = [];
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      for (const guest of guests) {
        if (!guest.email) {
          results.push({ name: guest.name, email: "", success: false, message: "No email" });
          continue;
        }

        const galleryUrl = `${appUrl}/${wedding.slug}`;

        const result = await sendThankYouEmail(guest.email, {
          guestName: guest.name,
          groomName: wedding.groomName,
          brideName: wedding.brideName,
          galleryUrl,
        });

        if (result.success) {
          await prisma.guest.update({
            where: { id: guest.id },
            data: { thankYouSent: true },
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
