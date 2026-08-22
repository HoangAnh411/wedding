import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, apiSuccess, apiError } from "@/lib/api-helper";

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, { userId }) => {
    try {
      const body = await req.json();
      const { weddingId, gatewayType, accountNumber, accountName, bankName, qrCodeUrl, isActive } = body;

      if (!weddingId || !gatewayType) {
        return apiError("Thiếu thông tin bắt buộc", 400);
      }

      const wedding = await prisma.wedding.findFirst({
        where: { id: weddingId, userId },
      });

      if (!wedding) {
        return apiError("Không tìm thấy đám cưới", 404);
      }

      const config = await prisma.paymentConfig.upsert({
        where: { weddingId_gatewayType: { weddingId, gatewayType } },
        update: { accountNumber, accountName, bankName, qrCodeUrl, isActive },
        create: { weddingId, gatewayType, accountNumber, accountName, bankName, qrCodeUrl, isActive },
      });

      return apiSuccess({ data: config });
    } catch (error) {
      return apiError(`Lỗi server: ${error instanceof Error ? error.message : "Unknown error"}`, 500);
    }
  });
}
