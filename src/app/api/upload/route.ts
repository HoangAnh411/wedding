import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { withAuth, apiSuccess, apiError } from "@/lib/api-helper";

export async function POST(req: NextRequest) {
  return withAuth(req, async () => {
    try {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return apiError("Thiếu file", 400);
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = file.name.split(".").pop() || "png";
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const uploadDir = join(process.cwd(), "public", "uploads");
      const filepath = join(uploadDir, filename);

      await mkdir(uploadDir, { recursive: true });
      await writeFile(filepath, buffer);

      const url = `/uploads/${filename}`;

      return apiSuccess({ url, filename });
    } catch (err) {
      return apiError(
        `Lỗi upload: ${err instanceof Error ? err.message : "Unknown"}`,
        500,
      );
    }
  });
}