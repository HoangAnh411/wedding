import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, apiSuccess, apiError, verifyWeddingOwnership } from "@/lib/api-helper";
import * as XLSX from "xlsx";

export async function POST(req: NextRequest) {
  return withAuth(req, async (req, { userId, role }) => {
    try {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const weddingId = formData.get("weddingId") as string | null;

      if (!file || !weddingId) {
        return apiError("Thiếu file hoặc weddingId", 400);
      }

      if (!(await verifyWeddingOwnership(weddingId, userId, role))) {
        return apiError("Không tìm thấy đám cưới", 404);
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

      const guests: { id: string; name: string }[] = [];
      const errors: { row: number; error: string }[] = [];

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const name = String(
          row.name || row.Name || row.Tên || row["Họ tên"] || "",
        ).trim();
        if (!name) {
          errors.push({ row: i + 2, error: "Thiếu tên khách mời" });
          continue;
        }

        try {
          const guest = await prisma.guest.create({
            data: {
              weddingId,
              name,
              phone: String(
                row.phone || row.Phone || row.SĐT || row["Số điện thoại"] || "",
              ).trim() || undefined,
              email: String(row.email || row.Email || "").trim() || undefined,
              familySide: String(
                row.familySide ||
                  row["Family side"] ||
                  row["Phân loại"] ||
                  "",
              ).trim() || undefined,
              groupName: String(
                row.groupName ||
                  row.Group ||
                  row.Nhóm ||
                  "",
              ).trim() || undefined,
              tableNumber: Number(
                row.tableNumber ||
                  row["Table number"] ||
                  row["Bàn số"] ||
                  0,
              ) || null,
              plusOne:
                row.plusOne === "Yes" ||
                row.plusOne === true ||
                row["Plus one"] === "Yes" ||
                row["Plus one"] === true ||
                row["Khách đi kèm"] === "Yes" ||
                false,
              inviteCode: `INV${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            },
          });
          guests.push({ id: guest.id, name: guest.name });
        } catch (err) {
          errors.push({
            row: i + 2,
            error: `Lỗi: ${err instanceof Error ? err.message : "Unknown"}`,
          });
        }
      }

      return apiSuccess({
        imported: guests.length,
        total: rows.length,
        guests,
        errors,
      });
    } catch (err) {
      return apiError(
        `Lỗi xử lý file: ${err instanceof Error ? err.message : "Unknown"}`,
        400,
      );
    }
  });
}