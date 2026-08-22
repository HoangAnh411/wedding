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
  slug: z.string().optional(),
  weddingDate: z.string().optional(),
  engagementDate: z.string().optional(),
  ceremonyDate: z.string().optional(),
  receptionDate: z.string().optional(),
  story: z.string().optional(),
  venueName: z.string().optional(),
  venueAddress: z.string().optional(),
  venueLat: z.number().optional(),
  venueLng: z.number().optional(),
  coverImage: z.string().optional(),
  galleryEnabled: z.boolean().optional(),
  musicEnabled: z.boolean().optional(),
  rsvpEnabled: z.boolean().optional(),
  wishesEnabled: z.boolean().optional(),
  isTemplate: z.boolean().optional(),
  clientEmail: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
});

// ============================================================
// Guest
// ============================================================
export const guestSchema = z.object({
  weddingId: z.string().min(1),
  familySide: z.string().optional(),
  name: z.string().min(1, "Tên khách mời là bắt buộc"),
  phone: z.string().optional(),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  groupName: z.string().optional(),
  inviteCode: z.string().optional(),
  tableNumber: z.number().int().optional().nullable(),
  isAttending: z.boolean().optional().nullable(),
  plusOne: z.boolean().optional(),
  plusOneName: z.string().optional(),
  mealChoice: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
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
  mealChoice: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  message: z.string().optional(),
});

// ============================================================
// Wish
// ============================================================
export const wishSchema = z.object({
  weddingId: z.string().min(1),
  guestName: z.string().min(1, "Tên là bắt buộc"),
  phone: z.string().optional(),
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
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().optional(),
  address: z.string().optional(),
  website: z.string().optional(),
  serviceDescription: z.string().optional(),
  contractValue: z.number().optional().nullable(),
  paidAmount: z.number().optional().nullable(),
  status: z.enum(["contacted", "booked", "paid"]).optional(),
  notes: z.string().optional(),
  reminderDate: z.string().optional(),
});

// ============================================================
// Budget Item
// ============================================================
export const budgetItemSchema = z.object({
  weddingId: z.string().min(1),
  category: z.string().min(1),
  itemName: z.string().min(1, "Tên khoản chi là bắt buộc"),
  estimatedCost: z.number().optional().nullable(),
  actualCost: z.number().optional().nullable(),
  vendorId: z.string().optional().nullable(),
  isPaid: z.boolean().optional(),
  paidDate: z.string().optional(),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
});

// ============================================================
// Checklist Item
// ============================================================
export const checklistItemSchema = z.object({
  weddingId: z.string().min(1),
  title: z.string().min(1, "Tiêu đề là bắt buộc"),
  category: z.string().optional(),
  phase: z.string().optional(),
  dueDate: z.string().optional(),
  dueRelativeDays: z.number().int().optional().nullable(),
  isCompleted: z.boolean().optional(),
  assignedTo: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  notes: z.string().optional(),
});

// ============================================================
// Table
// ============================================================
export const tableSchema = z.object({
  weddingId: z.string().min(1),
  tableNumber: z.number().int().min(1),
  tableName: z.string().optional(),
  capacity: z.number().int().min(1).default(10),
  locationDescription: z.string().optional(),
  isHeadTable: z.boolean().optional(),
});

// ============================================================
// Money Gift
// ============================================================
export const moneyGiftSchema = z.object({
  weddingId: z.string().min(1),
  guestName: z.string().min(1, "Tên khách là bắt buộc"),
  phone: z.string().optional(),
  amount: z.number().positive("Số tiền phải lớn hơn 0"),
  paymentMethod: z.string().optional(),
  bankName: z.string().optional(),
  transactionId: z.string().optional(),
  receivedAt: z.string().optional(),
  isConfirmed: z.boolean().optional(),
});

// ============================================================
// Gallery Image
// ============================================================
export const galleryImageSchema = z.object({
  weddingId: z.string().min(1),
  imageUrl: z.string().min(1),
  caption: z.string().optional(),
  isVideo: z.boolean().optional(),
  videoUrl: z.string().optional(),
  orderIndex: z.number().int().optional(),
});

// ============================================================
// Music Track
// ============================================================
export const musicTrackSchema = z.object({
  weddingId: z.string().min(1),
  title: z.string().min(1),
  artist: z.string().optional(),
  url: z.string().min(1, "URL nhạc là bắt buộc"),
  coverUrl: z.string().optional(),
  isDefault: z.boolean().optional(),
});

// ============================================================
// Check-in
// ============================================================
export const checkInSchema = z.object({
  guestId: z.string().min(1),
  weddingId: z.string().min(1),
  checkInBy: z.string().optional(),
  notes: z.string().optional(),
});

// ============================================================
// Email
// ============================================================
export const emailSchema = z.object({
  to: z.string().email("Email không hợp lệ"),
  guestName: z.string().min(1),
  groomName: z.string().optional(),
  brideName: z.string().optional(),
  weddingDate: z.string().optional(),
  venueName: z.string().optional(),
  venueAddress: z.string().optional(),
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