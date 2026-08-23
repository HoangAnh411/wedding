import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, apiSuccess, apiError, verifyWeddingOwnership } from "@/lib/api-helper";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown-ip";
    const rateLimitResult = rateLimit(`rsvp_${ip}`, 5, 60000);
    
    if (!rateLimitResult.success) {
      return apiError("Quá nhiều yêu cầu, vui lòng thử lại sau", 429);
    }

    const body = await request.json();
    const { weddingId, guestName, phone, email, isAttending, guestCount, message, events } = body;

    if (!weddingId || !guestName) {
      return apiError("Thiếu thông tin bắt buộc", 400);
    }

    const wedding = await prisma.wedding.findUnique({ where: { id: weddingId } });
    if (!wedding) {
      return apiError("Không tìm thấy đám cưới", 404);
    }

    let guestEmail = email;

    const rsvp = await prisma.$transaction(async (tx) => {
      let guest = null;
      
      if (phone) {
        guest = await tx.guest.findFirst({
          where: { phone, weddingId }
        });
      }

      if (!guest) {
        guest = await tx.guest.create({
          data: {
            name: guestName,
            phone: phone || null,
            email: email || null,
            weddingId,
            isAttending,
            rsvpAt: new Date(),
          }
        });
      } else {
        guest = await tx.guest.update({
          where: { id: guest.id },
          data: {
            isAttending,
            rsvpAt: new Date(),
            name: guestName,
            email: email || guest.email,
          }
        });
        if (!guestEmail && guest.email) {
          guestEmail = guest.email;
        }
      }

      // Xử lý RSVP theo từng sự kiện (nếu có mảng events truyền lên)
      if (events && Array.isArray(events) && events.length > 0) {
        const rsvpResponses = [];
        for (const ev of events) {
          await tx.rsvpResponse.deleteMany({
            where: { guestId: guest.id, eventId: ev.eventId }
          });

          const newRsvp = await tx.rsvpResponse.create({
            data: {
              guestId: guest.id,
              weddingId,
              eventId: ev.eventId,
              isAttending: ev.isAttending,
              guestCount: ev.guestCount || 1,
              message,
            }
          });
          rsvpResponses.push(newRsvp);
        }
        return rsvpResponses;
      } else {
        const newRsvp = await tx.rsvpResponse.create({
          data: {
            guestId: guest.id,
            weddingId,
            isAttending,
            guestCount: guestCount || 1,
            message,
          }
        });
        return [newRsvp];
      }
    });

    if (guestEmail) {
      // Gửi email không chặn request
      const { sendRsvpConfirmationEmail } = await import("@/lib/email");
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      sendRsvpConfirmationEmail(guestEmail, {
        guestName,
        groomName: wedding.groomName,
        brideName: wedding.brideName,
        weddingDate: wedding.weddingDate ? wedding.weddingDate.toLocaleDateString('vi-VN') : "Sắp diễn ra",
        venueName: wedding.venueName || "Việt Nam",
        isAttending,
        invitationUrl: `${appUrl}/${wedding.slug}`
      }).catch(err => console.error("Failed to send RSVP email", err));
    }

    return apiSuccess(rsvp);
  } catch (error) {
    return apiError(`Lỗi server: ${error instanceof Error ? error.message : "Unknown error"}`, 500);
  }
}

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, { userId, role }) => {
    const { searchParams } = new URL(request.url);
    const weddingId = searchParams.get("weddingId");

    if (!weddingId) {
      return apiError("Thiếu weddingId", 400);
    }

    if (!(await verifyWeddingOwnership(weddingId, userId, role))) {
      return apiError("Unauthorized", 403);
    }

    try {
      const responses = await prisma.rsvpResponse.findMany({
        where: { weddingId },
        include: { 
          wedding: true,
          event: true,
          guest: true
        },
        orderBy: { respondedAt: "desc" },
      });

      return apiSuccess(responses);
    } catch (error) {
      return apiError(`Lỗi server: ${error instanceof Error ? error.message : "Unknown error"}`, 500);
    }
  });
}