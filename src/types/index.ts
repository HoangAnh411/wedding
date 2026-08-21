export interface Wedding {
  id: string;
  userId: string;
  slug: string;
  title: string | null;
  groomName: string;
  brideName: string;
  weddingDate: string | null;
  engagementDate: string | null;
  ceremonyDate: string | null;
  receptionDate: string | null;
  story: string | null;
  venueName: string | null;
  venueAddress: string | null;
  venueLat: number | null;
  venueLng: number | null;
  coverImage: string | null;
  isTemplate: boolean;
  galleryEnabled: boolean;
  musicEnabled: boolean;
  rsvpEnabled: boolean;
  wishesEnabled: boolean;
}

export interface Guest {
  id: string;
  weddingId: string;
  familySide: string | null;
  name: string;
  phone: string | null;
  email: string | null;
  groupName: string | null;
  inviteCode: string | null;
  tableNumber: number | null;
  isAttending: boolean | null;
  plusOne: boolean;
  plusOneName: string | null;
  mealChoice: string | null;
  dietaryRestrictions: string | null;
  hasSentInvitation: boolean;
  hasOpenedInvitation: boolean;
  rsvpAt: string | null;
}

export interface TimelineEvent {
  id: string;
  weddingId: string;
  eventType: string | null;
  name: string;
  description: string | null;
  eventDate: string | null;
  eventTime: string | null;
  location: string | null;
  outfitDescription: string | null;
  orderIndex: number;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  contactName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  status: string | null;
  contractValue: number | null;
  paidAmount: number | null;
  notes: string | null;
}

export interface ChecklistItem {
  id: string;
  title: string;
  category: string | null;
  phase: string | null;
  dueDate: string | null;
  isCompleted: boolean;
  assignedTo: string | null;
  priority: string | null;
}

export interface BudgetItem {
  id: string;
  category: string;
  itemName: string;
  estimatedCost: number | null;
  actualCost: number | null;
  isPaid: boolean;
  vendorId: string | null;
}

export interface Table {
  id: string;
  tableNumber: number;
  tableName: string | null;
  capacity: number;
  isHeadTable: boolean;
}

export interface MoneyGift {
  id: string;
  guestName: string;
  phone: string | null;
  amount: number;
  paymentMethod: string | null;
  receivedAt: string | null;
}

export const VENDOR_CATEGORIES = [
  "Địa điểm tổ chức",
  "Nhiếp ảnh / Quay phim",
  "Trang phục",
  "Làm đẹp",
  "Ẩm thực / Bánh cưới",
  "Âm thanh - Ánh sáng",
  "MC - Ban nhạc - DJ",
  "Hoa tươi - Trang trí",
  "Xe hoa - Xe rước dâu",
  "Quà tặng khách mời",
  "Thiệp cưới - Văn phòng phẩm",
  "Du lịch - Trăng mật",
] as const;

export const CHECKLIST_PHASES = [
  "6-12 tháng trước",
  "3-6 tháng trước",
  "1-2 tháng trước",
  "Tuần cưới",
  "Sau đám cưới",
] as const;

export const BUDGET_CATEGORIES = [
  "Địa điểm",
  "Ảnh cưới & Video",
  "Trang phục",
  "Làm đẹp",
  "Ẩm thực",
  "Âm thanh & Ánh sáng",
  "Hoa & Trang trí",
  "MC & Giải trí",
  "Xe cộ",
  "Vàng cưới & Trang sức",
  "Quà tặng",
  "Phát sinh",
] as const;