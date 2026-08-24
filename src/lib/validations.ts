import { z } from "zod";

// ============================================================
// Auth
// ============================================================
export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

// ============================================================
// Wedding
// ============================================================
export const weddingSchema = z.object({
  groomName: z.string().min(1, "Tên chú rể là bắt buộc"),
  brideName: z.string().min(1, "Tên cô dâu là bắt buộc"),
  slug: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  weddingDate: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  engagementDate: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  ceremonyDate: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  receptionDate: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  story: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  venueName: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  venueAddress: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  venueLat: z.number().optional(),
  venueLng: z.number().optional(),
  coverImage: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  galleryEnabled: z.boolean().optional(),
  musicEnabled: z.boolean().optional(),
  rsvpEnabled: z.boolean().optional(),
  wishesEnabled: z.boolean().optional(),
  isTemplate: z.boolean().optional(),
  clientEmail: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  password: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()).nullable(),
  theme: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  primaryColor: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  layoutConfig: z.any().optional(),
});

// ============================================================
// Guest
// ============================================================
export const guestSchema = z.object({
  weddingId: z.string().min(1),
  familySide: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  name: z.string().min(1, "Tên khách mời là bắt buộc"),
  phone: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  groupName: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  inviteCode: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  tableNumber: z.preprocess((v) => v === "" ? null : v, z.number().int().nullable().optional()),
  isAttending: z.preprocess((v) => v === "" ? null : v, z.boolean().nullable().optional()),
  plusOne: z.boolean().optional(),
  plusOneName: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  mealChoice: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  dietaryRestrictions: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
});

export const guestImportSchema = z.array(guestSchema);

// ============================================================
// RSVP
// ============================================================
export const rsvpSchema = z.object({
  weddingId: z.string().min(1),
  guestId: z.string().min(1),
  isAttending: z.boolean(),
  guestCount: z.number().int().min(1).max(10),
  mealChoice: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  dietaryRestrictions: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  message: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
});

// ============================================================
// Wish
// ============================================================
export const wishSchema = z.object({
  weddingId: z.string().min(1),
  guestName: z.string().min(1, "Tên là bắt buộc"),
  phone: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  content: z.string().min(1, "Lời chúc là bắt buộc").max(500, "Lời chúc không quá 500 ký tự"),
});

export const wishApprovalSchema = z.object({
  id: z.string().min(1),
  isApproved: z.boolean(),
});

// ============================================================
// Vendor
// ============================================================
export const vendorSchema = z.object({
  name: z.string().min(1, "Tên nhà cung cấp là bắt buộc"),
  category: z.string().min(1),
  contactName: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  contactPhone: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  contactEmail: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  address: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  website: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  serviceDescription: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  contractValue: z.preprocess((v) => v === "" ? null : v, z.number().nullable().optional()),
  paidAmount: z.preprocess((v) => v === "" ? null : v, z.number().nullable().optional()),
  status: z.enum(["contacted", "booked", "paid"]).optional(),
  notes: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  reminderDate: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
});

// ============================================================
// Budget Item
// ============================================================
export const budgetItemSchema = z.object({
  weddingId: z.string().min(1),
  category: z.string().min(1),
  itemName: z.string().min(1, "Tên khoản chi là bắt buộc"),
  estimatedCost: z.preprocess((v) => v === "" ? null : v, z.number().nullable().optional()),
  actualCost: z.preprocess((v) => v === "" ? null : v, z.number().nullable().optional()),
  vendorId: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()).nullable(),
  isPaid: z.boolean().optional(),
  paidDate: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  paymentMethod: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  notes: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
});

// ============================================================
// Checklist Item
// ============================================================
export const checklistItemSchema = z.object({
  weddingId: z.string().min(1),
  title: z.string().min(1, "Tiêu đề là bắt buộc"),
  category: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  phase: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  dueDate: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  dueRelativeDays: z.preprocess((v) => v === "" ? null : v, z.number().int().nullable().optional()),
  isCompleted: z.boolean().optional(),
  assignedTo: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  priority: z.enum(["low", "medium", "high"]).optional(),
  notes: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
});

// ============================================================
// Table
// ============================================================
export const tableSchema = z.object({
  weddingId: z.string().min(1),
  tableNumber: z.number().int().min(1),
  tableName: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  capacity: z.number().int().min(1).default(10),
  locationDescription: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  isHeadTable: z.boolean().optional(),
});

// ============================================================
// Money Gift
// ============================================================
export const moneyGiftSchema = z.object({
  weddingId: z.string().min(1),
  guestName: z.string().min(1, "Tên khách là bắt buộc"),
  phone: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  amount: z.number().positive("Số tiền phải lớn hơn 0"),
  paymentMethod: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  bankName: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  transactionId: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  receivedAt: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  isConfirmed: z.boolean().optional(),
});

// ============================================================
// Gallery Image
// ============================================================
export const galleryImageSchema = z.object({
  weddingId: z.string().min(1),
  imageUrl: z.string().min(1),
  caption: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  isVideo: z.boolean().optional(),
  videoUrl: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  orderIndex: z.number().int().optional(),
});

// ============================================================
// Music Track
// ============================================================
export const musicTrackSchema = z.object({
  weddingId: z.string().min(1),
  title: z.string().min(1),
  artist: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  url: z.string().min(1, "URL nhạc là bắt buộc"),
  coverUrl: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  isDefault: z.boolean().optional(),
});

// ============================================================
// Check-in
// ============================================================
export const checkInSchema = z.object({
  guestId: z.string().min(1),
  weddingId: z.string().min(1),
  checkInBy: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  notes: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
});

// ============================================================
// Email
// ============================================================
export const emailSchema = z.object({
  to: z.string().email("Email không hợp lệ"),
  guestName: z.string().min(1),
  groomName: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  brideName: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  weddingDate: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  venueName: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  venueAddress: z.preprocess((v) => v === "" ? null : v, z.string().nullable().optional()),
  invitationUrl: z.string().url("URL không hợp lệ"),
});

// ============================================================
// Zalo
// ============================================================
export const zaloSchema = z.object({
  phoneNumber: z.string().min(10, "Số điện thoại không hợp lệ"),
  templateId: z.string().min(1),
  templateData: z.record(z.string()).optional(),
});
