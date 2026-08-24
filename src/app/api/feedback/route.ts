import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, apiSuccess, apiError } from "@/lib/api-helper";
import { z } from "zod";

const rateLimit = new Map<string, number>();

const feedbackSchema = z.object({
  name: z.string().min(1, "Thiếu tên"),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  category: z.string().min(1, "Thiếu danh mục"),
  subject: z.string().min(1, "Thiếu tiêu đề"),
  content: z.string().min(1, "Thiếu nội dung"),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    // Giới hạn 1 phút (60000ms)
    if (rateLimit.has(ip) && now - rateLimit.get(ip)! < 60000) {
      return apiError("Bạn đã gửi feedback quá nhanh, vui lòng chờ 1 phút rồi thử lại", 429);
    }
    rateLimit.set(ip, now);

    const body = await request.json();
    const parsed = feedbackSchema.safeParse(body);

    if (!parsed.success) {
      return apiError("Dữ liệu không hợp lệ", 400);
    }

    const { name, email, category, subject, content } = parsed.data;

    const feedback = await prisma.feedback.create({
      data: {
        name,
        email: email || null,
        category,
        subject,
        content,
        status: "new",
      },
    });

    return apiSuccess(feedback);
  } catch (error) {
    return apiError(`Lỗi server: ${error instanceof Error ? error.message : "Unknown error"}`, 500);
  }
}

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, { role }) => {
    if (role !== "SUPERADMIN") {
      return apiError("Không có quyền truy cập", 403);
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;
    
    const status = url.searchParams.get("status");
    const category = url.searchParams.get("category");

    try {
      const where: any = {};
      if (status) where.status = status;
      if (category) where.category = category;

      const [feedbacks, total] = await Promise.all([
        prisma.feedback.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.feedback.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);
      return apiSuccess(feedbacks, 200, { total, page, limit, totalPages });
    } catch (error) {
      return apiError(`Lỗi server: ${error instanceof Error ? error.message : "Unknown error"}`, 500);
    }
  });
}

export async function PUT(request: NextRequest) {
  return withAuth(request, async (req, { role }) => {
    if (role !== "SUPERADMIN") {
      return apiError("Không có quyền truy cập", 403);
    }

    try {
      const body = await request.json();
      const { id, status, priority, adminNotes } = body;

      if (!id) {
        return apiError("Thiếu id", 400);
      }

      const existing = await prisma.feedback.findUnique({ where: { id } });
      if (!existing) return apiError("Not found", 404);

      const updateData: any = {};
      if (status !== undefined) updateData.status = status;
      if (priority !== undefined) updateData.priority = priority;
      if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
      
      if (status === "resolved" && existing.status !== "resolved") {
        updateData.resolvedAt = new Date();
      } else if (status !== "resolved" && status !== undefined) {
        updateData.resolvedAt = null;
      }

      const feedback = await prisma.feedback.update({
        where: { id },
        data: updateData,
      });

      return apiSuccess(feedback);
    } catch (error) {
      return apiError(`Lỗi server: ${error instanceof Error ? error.message : "Unknown error"}`, 500);
    }
  });
}
