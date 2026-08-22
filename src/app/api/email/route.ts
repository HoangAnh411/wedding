import { NextRequest } from "next/server";
import { sendInvitationEmail } from "@/lib/email";
import { withAuth, apiSuccess, apiError } from "@/lib/api-helper";

export async function POST(request: NextRequest) {
  return withAuth(request, async () => {
    try {
      const body = await request.json();
      const { guests, groomName, brideName, weddingDate, venueName, venueAddress } = body;

      if (!guests || !Array.isArray(guests) || guests.length === 0) {
        return apiError("Thiếu danh sách khách mời", 400);
      }

      const results = [];
      const chunkSize = 20;

      for (let i = 0; i < guests.length; i += chunkSize) {
        const chunk = guests.slice(i, i + chunkSize);
        
        const promises = chunk.map(guest => {
          if (!guest.to || !guest.guestName) {
            return Promise.resolve({ success: false, message: "Thiếu thông tin" });
          }
          return sendInvitationEmail(guest.to, {
            guestName: guest.guestName,
            groomName: groomName || "Chú rể",
            brideName: brideName || "Cô dâu",
            weddingDate: weddingDate || "Sắp diễn ra",
            venueName: venueName || "Địa điểm tổ chức",
            venueAddress: venueAddress || "",
            invitationUrl: guest.invitationUrl || "",
          });
        });

        const chunkResults = await Promise.all(promises);
        results.push(...chunkResults);

        if (i + chunkSize < guests.length) {
          // Wait 1 second between chunks
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      const successCount = results.filter(r => r.success).length;
      return apiSuccess({ 
        message: `Đã gửi ${successCount}/${guests.length} email thành công`, 
        results 
      });


    } catch (error) {
      return apiError(`Lỗi server: ${error instanceof Error ? error.message : "Unknown error"}`, 500);
    }
  });
}