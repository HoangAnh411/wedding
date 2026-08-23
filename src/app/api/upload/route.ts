import { NextRequest } from "next/server";
import { withAuth, apiSuccess, apiError } from "@/lib/api-helper";
import { uploadToGoogleDrive } from "@/lib/gdrive";

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

      const ext = file.name.split(".").pop()?.toLowerCase() || "png";
      const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp3', 'mp4'];
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

      if (file.size > MAX_FILE_SIZE) return apiError('File quá lớn (tối đa 5MB)', 400);
      if (!ALLOWED_EXTENSIONS.includes(ext)) return apiError('Định dạng file không được hỗ trợ', 400);

      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
      
      // Upload trực tiếp lên Google Drive thay vì lưu local filesystem
      const url = await uploadToGoogleDrive(buffer, filename, file.type || "application/octet-stream");

      return apiSuccess({ url, filename });
    } catch (err) {
      return apiError(
        `Lỗi upload: ${err instanceof Error ? err.message : "Unknown"}`,
        500,
      );
    }
  });
}