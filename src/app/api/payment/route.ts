import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, apiSuccess, apiError } from "@/lib/api-helper";

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, { userId }) => {
    try {
      const body = await req.json();
      const { gatewayType, accountNumber, accountName, bankName, qrCodeUrl, isActive, weddingId, momoPhone, paypalEmail } = body;

      if (!gatewayType) {
        return apiError("Thiếu thông tin bắt buộc", 400);
      }

      const config = await prisma.paymentConfig.upsert({
        where: {
          userId_gatewayType_weddingId: {
            userId,
            gatewayType,
            weddingId: weddingId || null,
          }
        },
        update: { accountNumber, accountName, bankName, qrCodeUrl, isActive, momoPhone, paypalEmail },
        create: { userId, gatewayType, accountNumber, accountName, bankName, qrCodeUrl, isActive, weddingId: weddingId || null, momoPhone, paypalEmail },
      });

      return apiSuccess({ data: config });
    } catch (error) {
      return apiError(`Lỗi server: ${error instanceof Error ? error.message : "Unknown error"}`, 500);
    }
  });
}
