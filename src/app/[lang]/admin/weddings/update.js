const fs = require('fs');
const path = require('path');

const viPath = path.join(__dirname, '../../dictionaries/vi.json');
const enPath = path.join(__dirname, '../../dictionaries/en.json');

const viJson = JSON.parse(fs.readFileSync(viPath, 'utf8'));
const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const viUpdates = {
  weddings: {
    title: "Đám cưới",
    subtitle: "Quản lý các đám cưới của bạn",
    createNew: "+ Tạo đám cưới mới",
    noWedding: "Chưa có đám cưới nào",
    noWeddingDesc: "Tạo đám cưới đầu tiên để bắt đầu quản lý",
    createFirst: "Tạo đám cưới mới",
    noDate: "Chưa có ngày",
    guests: "khách",
    createModalTitle: "Tạo đám cưới mới",
    createModalDesc: "Điền thông tin cơ bản để bắt đầu",
    groomName: "Tên chú rể *",
    groomPlaceholder: "Nguyễn Văn A",
    brideName: "Tên cô dâu *",
    bridePlaceholder: "Trần Thị B",
    weddingDate: "Ngày cưới",
    venueName: "Địa điểm",
    venuePlaceholder: "Tên nhà hàng / khách sạn",
    clientEmail: "Email nhận tài khoản (Tùy chọn)",
    clientEmailDesc: "Nếu nhập, hệ thống sẽ tự động tạo tài khoản và gửi email cho người dùng.",
    creating: "Đang tạo...",
    createButton: "Tạo đám cưới",
    error: "Có lỗi xảy ra"
  },
  weddingDetail: {
    manageWedding: "Quản lý Đám cưới",
    noDate: "Chưa xác định",
    views: "lượt xem",
    copyLink: "Copy Link Thiệp",
    sendInvite: "Gửi Thiệp Mời",
    sending: "Đang gửi...",
    emailResult: "Kết quả gửi email thiệp mời:",
    success: "Thành công:",
    failed: "Thất bại:",
    guest: "Khách",
    stats: {
      totalGuests: "Tổng khách mời",
      confirmed: "Đã xác nhận",
      tables: "Bàn tiệc",
      tasks: "Công việc",
      gifts: "Quà mừng"
    },
    quickAccess: "Truy cập nhanh",
    confirmSendAll: "Gửi thiệp cho tất cả khách chưa nhận thiệp?",
    copied: "Đã copy link!",
    connError: "Lỗi kết nối"
  },
  budget: {
    title: "Ngân sách",
    subtitle: "Theo dõi chi phí đám cưới",
    addExpense: "+ Thêm khoản chi",
    estimated: "Dự kiến",
    actual: "Thực tế",
    paid: "Đã thanh toán",
    table: {
      item: "Khoản chi",
      category: "Danh mục",
      estimated: "Dự kiến",
      actual: "Thực tế",
      status: "TT"
    },
    deleteConfirm: "Xóa?",
    delete: "Xóa",
    addModal: {
      title: "Thêm khoản chi",
      itemName: "Tên khoản chi",
      estimated: "Số tiền dự kiến",
      addButton: "Thêm"
    }
  },
  checklist: {
    title: "Checklist",
    subtitle: "Theo dõi tiến độ chuẩn bị đám cưới",
    addTask: "+ Thêm việc",
    overallProgress: "Tiến độ tổng thể",
    completedTasks: "việc đã hoàn thành",
    priority: {
      high: "Quan trọng",
      medium: "Trung bình",
      low: "Thấp",
      mediumShort: "TB"
    },
    addModal: {
      title: "Thêm việc cần làm",
      taskName: "Việc cần làm",
      addButton: "Thêm"
    }
  },
  guests: {
    title: "Khách mời",
    subtitle: "Quản lý danh sách khách mời",
    importExcel: "📥 Import Excel",
    importing: "Đang import...",
    sendInvites: "✉️ Gửi Thiệp",
    sendThankYou: "💌 Gửi email Cảm ơn",
    addGuest: "+ Thêm khách",
    importResult: "Kết quả import:",
    importErrors: "lỗi",
    stats: {
      confirmed: "Đã xác nhận",
      pending: "Chờ xác nhận",
      declined: "Từ chối"
    },
    searchPlaceholder: "Tìm kiếm khách mời...",
    filters: {
      all: "Tất cả",
      groomSide: "Nhà trai",
      brideSide: "Nhà gái",
      family: "Gia đình",
      friends: "Bạn bè",
      colleagues: "Đồng nghiệp",
      others: "Khác",
      confirmed: "Đã xác nhận",
      pending: "Chưa xác nhận",
      declined: "Từ chối",
      notSent: "Chưa gửi thiệp"
    },
    table: {
      name: "Tên",
      side: "Phân loại",
      group: "Nhóm",
      phone: "SĐT",
      table: "Bàn",
      status: "Trạng thái",
      invite: "Thiệp",
      unclassified: "Chưa phân loại",
      pending: "Chờ",
      attending: "Đi",
      declined: "Từ chối",
      sent: "✅ Đã gửi",
      notSent: "⏳ Chưa gửi",
      notFound: "Không tìm thấy khách mời nào"
    },
    pagination: {
      prev: "Trước",
      next: "Sau",
      page: "Trang"
    },
    addModal: {
      title: "Thêm khách mời mới",
      name: "Tên khách mời *",
      side: "Phân loại",
      group: "Nhóm",
      phone: "Số điện thoại",
      email: "Email",
      cancel: "Hủy",
      saving: "Đang lưu...",
      save: "Lưu"
    },
    alerts: {
      confirmSendAll: "Gửi email thiệp cưới cho tất cả khách CHƯA GỬI và có email?",
      sendSuccess: "Đã gửi thành công ${sent} thiệp. Thất bại: ${failed}",
      sendError: "Lỗi khi gửi email",
      confirmThankYou: "Bạn có chắc chắn muốn gửi email cảm ơn đến TẤT CẢ khách mời Đã xác nhận tham dự?",
      addError: "Lỗi khi thêm khách"
    }
  }
};

const enUpdates = {
  weddings: {
    title: "Weddings",
    subtitle: "Manage your weddings",
    createNew: "+ Create new wedding",
    noWedding: "No weddings yet",
    noWeddingDesc: "Create your first wedding to start managing",
    createFirst: "Create new wedding",
    noDate: "No date set",
    guests: "guests",
    createModalTitle: "Create new wedding",
    createModalDesc: "Fill in the basic info to start",
    groomName: "Groom's name *",
    groomPlaceholder: "John Doe",
    brideName: "Bride's name *",
    bridePlaceholder: "Jane Doe",
    weddingDate: "Wedding date",
    venueName: "Venue",
    venuePlaceholder: "Restaurant / Hotel name",
    clientEmail: "Account email (Optional)",
    clientEmailDesc: "If entered, the system will auto-create an account and email the user.",
    creating: "Creating...",
    createButton: "Create wedding",
    error: "An error occurred"
  },
  weddingDetail: {
    manageWedding: "Manage Wedding",
    noDate: "Not set",
    views: "views",
    copyLink: "Copy Invite Link",
    sendInvite: "Send Invites",
    sending: "Sending...",
    emailResult: "Email invite results:",
    success: "Success:",
    failed: "Failed:",
    guest: "Guest",
    stats: {
      totalGuests: "Total guests",
      confirmed: "Confirmed",
      tables: "Tables",
      tasks: "Tasks",
      gifts: "Gifts"
    },
    quickAccess: "Quick Access",
    confirmSendAll: "Send invite to all guests who haven't received one?",
    copied: "Link copied!",
    connError: "Connection error"
  },
  budget: {
    title: "Budget",
    subtitle: "Track wedding expenses",
    addExpense: "+ Add expense",
    estimated: "Estimated",
    actual: "Actual",
    paid: "Paid",
    table: {
      item: "Item",
      category: "Category",
      estimated: "Estimated",
      actual: "Actual",
      status: "Status"
    },
    deleteConfirm: "Delete?",
    delete: "Delete",
    addModal: {
      title: "Add expense",
      itemName: "Item name",
      estimated: "Estimated amount",
      addButton: "Add"
    }
  },
  checklist: {
    title: "Checklist",
    subtitle: "Track wedding preparation progress",
    addTask: "+ Add task",
    overallProgress: "Overall progress",
    completedTasks: "tasks completed",
    priority: {
      high: "High",
      medium: "Medium",
      low: "Low",
      mediumShort: "Med"
    },
    addModal: {
      title: "Add task",
      taskName: "Task name",
      addButton: "Add"
    }
  },
  guests: {
    title: "Guests",
    subtitle: "Manage guest list",
    importExcel: "📥 Import Excel",
    importing: "Importing...",
    sendInvites: "✉️ Send Invites",
    sendThankYou: "💌 Send Thank You",
    addGuest: "+ Add guest",
    importResult: "Import result:",
    importErrors: "errors",
    stats: {
      confirmed: "Confirmed",
      pending: "Pending",
      declined: "Declined"
    },
    searchPlaceholder: "Search guests...",
    filters: {
      all: "All",
      groomSide: "Groom's side",
      brideSide: "Bride's side",
      family: "Family",
      friends: "Friends",
      colleagues: "Colleagues",
      others: "Others",
      confirmed: "Confirmed",
      pending: "Pending",
      declined: "Declined",
      notSent: "Not sent"
    },
    table: {
      name: "Name",
      side: "Side",
      group: "Group",
      phone: "Phone",
      table: "Table",
      status: "Status",
      invite: "Invite",
      unclassified: "Unclassified",
      pending: "Pending",
      attending: "Attending",
      declined: "Declined",
      sent: "✅ Sent",
      notSent: "⏳ Not sent",
      notFound: "No guests found"
    },
    pagination: {
      prev: "Prev",
      next: "Next",
      page: "Page"
    },
    addModal: {
      title: "Add new guest",
      name: "Guest name *",
      side: "Side",
      group: "Group",
      phone: "Phone number",
      email: "Email",
      cancel: "Cancel",
      saving: "Saving...",
      save: "Save"
    },
    alerts: {
      confirmSendAll: "Send wedding invites to all UNSENT guests with email?",
      sendSuccess: "Successfully sent ${sent} invites. Failed: ${failed}",
      sendError: "Error sending emails",
      confirmThankYou: "Are you sure you want to send thank you emails to ALL confirmed guests?",
      addError: "Error adding guest"
    }
  }
};

viJson.admin = { ...viJson.admin, ...viUpdates };
enJson.admin = { ...enJson.admin, ...enUpdates };

fs.writeFileSync(viPath, JSON.stringify(viJson, null, 2) + '\n');
fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2) + '\n');

console.log("Updated dictionaries.");

// Now replace text in files
function replaceInFile(filePath, replacements, useI18n = true) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (useI18n && !content.includes('useTranslation')) {
    content = content.replace('"use client";\n', '"use client";\n\nimport { useTranslation } from "@/components/i18n-provider";\n');
  }
  
  if (useI18n && !content.includes('const dict = useTranslation()')) {
    const componentRegex = /(export default function [a-zA-Z0-9_]+\s*\([^)]*\)\s*\{)/;
    content = content.replace(componentRegex, '$1\n  const dict = useTranslation();');
  }

  for (const [from, to] of replacements) {
    if (from instanceof RegExp) {
      content = content.replace(from, to);
    } else {
      content = content.split(from).join(to);
    }
  }
  
  fs.writeFileSync(filePath, content);
  console.log("Updated", filePath);
}

replaceInFile(path.join(__dirname, 'weddings-client.tsx'), [
  ['>Đám cưới<', '>{dict.admin.weddings.title}<'],
  ['>Quản lý các đám cưới của bạn<', '>{dict.admin.weddings.subtitle}<'],
  ['>+ Tạo đám cưới mới<', '>{dict.admin.weddings.createNew}<'],
  ['>Chưa có đám cưới nào<', '>{dict.admin.weddings.noWedding}<'],
  ['>Tạo đám cưới đầu tiên để bắt đầu quản lý<', '>{dict.admin.weddings.noWeddingDesc}<'],
  ['>\n            Tạo đám cưới mới\n          <', '>\n            {dict.admin.weddings.createFirst}\n          <'],
  ['"Chưa có ngày"', 'dict.admin.weddings.noDate'],
  ['>👥 {w.guestCount} khách<', '>👥 {w.guestCount} {dict.admin.weddings.guests}<'],
  ['>Tạo đám cưới mới<', '>{dict.admin.weddings.createModalTitle}<'],
  ['>Điền thông tin cơ bản để bắt đầu<', '>{dict.admin.weddings.createModalDesc}<'],
  ['>Tên chú rể *<', '>{dict.admin.weddings.groomName}<'],
  ['placeholder="Nguyễn Văn A"', 'placeholder={dict.admin.weddings.groomPlaceholder}'],
  ['>Tên cô dâu *<', '>{dict.admin.weddings.brideName}<'],
  ['placeholder="Trần Thị B"', 'placeholder={dict.admin.weddings.bridePlaceholder}'],
  ['>Ngày cưới<', '>{dict.admin.weddings.weddingDate}<'],
  ['>Địa điểm<', '>{dict.admin.weddings.venueName}<'],
  ['placeholder="Tên nhà hàng / khách sạn"', 'placeholder={dict.admin.weddings.venuePlaceholder}'],
  ['>Email nhận tài khoản (Tùy chọn)<', '>{dict.admin.weddings.clientEmail}<'],
  ['>Nếu nhập, hệ thống sẽ tự động tạo tài khoản và gửi email cho người dùng.<', '>{dict.admin.weddings.clientEmailDesc}<'],
  ['>Hủy<', '>{dict.common.cancel}<'], // assuming dict.common.cancel exists
  ['"Đang tạo..." : "Tạo đám cưới"', 'dict.admin.weddings.creating : dict.admin.weddings.createButton'],
  ['setError("Có lỗi xảy ra")', 'setError(dict.admin.weddings.error)']
]);

replaceInFile(path.join(__dirname, '[id]/wedding-detail-client.tsx'), [
  ['"Gửi thiệp cho tất cả khách chưa nhận thiệp?"', 'dict.admin.weddingDetail.confirmSendAll'],
  ['"Đã copy link!"', 'dict.admin.weddingDetail.copied'],
  ['>Quản lý Đám cưới<', '>{dict.admin.weddingDetail.manageWedding}<'],
  ['"Chưa xác định"', 'dict.admin.weddingDetail.noDate'],
  ['lượt xem', '{dict.admin.weddingDetail.views}'],
  ['>Copy Link Thiệp<', '>{dict.admin.weddingDetail.copyLink}<'],
  ['"Đang gửi..." : "Gửi Thiệp Mời"', 'dict.admin.weddingDetail.sending : dict.admin.weddingDetail.sendInvite'],
  ['>Kết quả gửi email thiệp mời:<', '>{dict.admin.weddingDetail.emailResult}<'],
  ['>Thành công:', '>{dict.admin.weddingDetail.success}'],
  ['>Thất bại:', '>{dict.admin.weddingDetail.failed}'],
  ['{r.name || "Khách"}', '{r.name || dict.admin.weddingDetail.guest}'],
  ['"Lỗi kết nối"', 'dict.admin.weddingDetail.connError'],
  ['title="Tổng khách mời"', 'title={dict.admin.weddingDetail.stats.totalGuests}'],
  ['title="Đã xác nhận"', 'title={dict.admin.weddingDetail.stats.confirmed}'],
  ['title="Bàn tiệc"', 'title={dict.admin.weddingDetail.stats.tables}'],
  ['title="Công việc"', 'title={dict.admin.weddingDetail.stats.tasks}'],
  ['title="Quà mừng"', 'title={dict.admin.weddingDetail.stats.gifts}'],
  ['>Truy cập nhanh<', '>{dict.admin.weddingDetail.quickAccess}<'],
  ['label="Khách mời"', 'label={dict.admin.sidebar.guests}'],
  ['label="Bàn tiệc"', 'label={dict.admin.sidebar.tables}'],
  ['label="Ngân sách"', 'label={dict.admin.sidebar.budget}'],
  ['label="Công việc"', 'label={dict.admin.sidebar.checklist}'],
  ['label="Thư viện ảnh"', 'label={dict.admin.sidebar.gallery}'],
  ['label="Nhạc nền"', 'label={dict.admin.sidebar.music}'],
  ['label="Lời chúc"', 'label={dict.admin.sidebar.wishes}'],
  ['label="Mừng cưới"', 'label={dict.admin.sidebar.moneyGifts}'],
  ['label="Check-in"', 'label={dict.admin.sidebar.checkin}'],
  ['label="Cài đặt"', 'label={dict.admin.sidebar.settings}']
]);

replaceInFile(path.join(__dirname, '[id]/budget/budget-client.tsx'), [
  ['confirm("Xóa?")', 'confirm(dict.admin.budget.deleteConfirm)'],
  ['>Ngân sách<', '>{dict.admin.budget.title}<'],
  ['>Theo dõi chi phí đám cưới<', '>{dict.admin.budget.subtitle}<'],
  ['>+ Thêm khoản chi<', '>{dict.admin.budget.addExpense}<'],
  ['>Dự kiến<', '>{dict.admin.budget.estimated}<'],
  ['>Thực tế<', '>{dict.admin.budget.actual}<'],
  ['>Đã thanh toán<', '>{dict.admin.budget.paid}<'],
  ['>Khoản chi<', '>{dict.admin.budget.table.item}<'],
  ['>Danh mục<', '>{dict.admin.budget.table.category}<'],
  ['>TT<', '>{dict.admin.budget.table.status}<'],
  ['>Xóa<', '>{dict.admin.budget.delete}<'],
  ['>Thêm khoản chi<', '>{dict.admin.budget.addModal.title}<'],
  ['placeholder="Tên khoản chi"', 'placeholder={dict.admin.budget.addModal.itemName}'],
  ['placeholder="Số tiền dự kiến"', 'placeholder={dict.admin.budget.addModal.estimated}'],
  ['>Hủy<', '>{dict.common.cancel}<'],
  ['>Thêm<', '>{dict.admin.budget.addModal.addButton}<']
]);

replaceInFile(path.join(__dirname, '[id]/checklist/checklist-client.tsx'), [
  ['>Checklist<', '>{dict.admin.checklist.title}<'],
  ['>Theo dõi tiến độ chuẩn bị đám cưới<', '>{dict.admin.checklist.subtitle}<'],
  ['>+ Thêm việc<', '>{dict.admin.checklist.addTask}<'],
  ['>Tiến độ tổng thể<', '>{dict.admin.checklist.overallProgress}<'],
  ['việc đã hoàn thành', '{dict.admin.checklist.completedTasks}'],
  ['"Quan trọng" : item.priority === "medium" ? "TB" : "Thấp"', 'dict.admin.checklist.priority.high : item.priority === "medium" ? dict.admin.checklist.priority.mediumShort : dict.admin.checklist.priority.low'],
  ['>Thêm việc cần làm<', '>{dict.admin.checklist.addModal.title}<'],
  ['placeholder="Việc cần làm"', 'placeholder={dict.admin.checklist.addModal.taskName}'],
  ['>Quan trọng<', '>{dict.admin.checklist.priority.high}<'],
  ['>Trung bình<', '>{dict.admin.checklist.priority.medium}<'],
  ['>Thấp<', '>{dict.admin.checklist.priority.low}<'],
  ['>Hủy<', '>{dict.common.cancel}<'],
  ['>Thêm<', '>{dict.admin.checklist.addModal.addButton}<']
]);

replaceInFile(path.join(__dirname, '[id]/guests/guests-client.tsx'), [
  ['"Tất cả"', 'dict.admin.guests.filters.all'],
  ['"Nhà trai"', 'dict.admin.guests.filters.groomSide'],
  ['"Nhà gái"', 'dict.admin.guests.filters.brideSide'],
  ['"Gia đình"', 'dict.admin.guests.filters.family'],
  ['"Bạn bè"', 'dict.admin.guests.filters.friends'],
  ['"Đồng nghiệp"', 'dict.admin.guests.filters.colleagues'],
  ['"Đã xác nhận"', 'dict.admin.guests.filters.confirmed'],
  ['"Chưa xác nhận"', 'dict.admin.guests.filters.pending'],
  ['"Từ chối"', 'dict.admin.guests.filters.declined'],
  ['"Chưa gửi thiệp"', 'dict.admin.guests.filters.notSent'],
  ['"Khác"', 'dict.admin.guests.filters.others'],
  ['>Khách mời<', '>{dict.admin.guests.title}<'],
  ['>Quản lý danh sách khách mời<', '>{dict.admin.guests.subtitle}<'],
  ['"Đang import..." : "📥 Import Excel"', 'importing ? dict.admin.guests.importing : dict.admin.guests.importExcel'],
  ['"Gửi email thiệp cưới cho tất cả khách CHƯA GỬI và có email?"', 'dict.admin.guests.alerts.confirmSendAll'],
  ['`Đã gửi thành công ${json.data.sent} thiệp. Thất bại: ${json.data.failed}`', 'dict.admin.guests.alerts.sendSuccess.replace("${sent}", json.data.sent.toString()).replace("${failed}", json.data.failed.toString())'],
  ['"Lỗi khi gửi email"', 'dict.admin.guests.alerts.sendError'],
  ['✉️ Gửi Thiệp', '{dict.admin.guests.sendInvites}'],
  ['"Bạn có chắc chắn muốn gửi email cảm ơn đến TẤT CẢ khách mời Đã xác nhận tham dự?"', 'dict.admin.guests.alerts.confirmThankYou'],
  ['💌 Gửi email Cảm ơn', '{dict.admin.guests.sendThankYou}'],
  ['>+ Thêm khách<', '>{dict.admin.guests.addGuest}<'],
  ['Kết quả import:', '{dict.admin.guests.importResult}'],
  ['>lỗi<', '>{dict.admin.guests.importErrors}<'],
  ['>Đã xác nhận<', '>{dict.admin.guests.stats.confirmed}<'],
  ['>Chờ xác nhận<', '>{dict.admin.guests.stats.pending}<'],
  ['>Từ chối<', '>{dict.admin.guests.stats.declined}<'],
  ['placeholder="Tìm kiếm khách mời..."', 'placeholder={dict.admin.guests.searchPlaceholder}'],
  ['>Tất cả<', '>{dict.admin.guests.filters.all}<'],
  ['>Nhà trai<', '>{dict.admin.guests.filters.groomSide}<'],
  ['>Nhà gái<', '>{dict.admin.guests.filters.brideSide}<'],
  ['>Gia đình<', '>{dict.admin.guests.filters.family}<'],
  ['>Bạn bè<', '>{dict.admin.guests.filters.friends}<'],
  ['>Đồng nghiệp<', '>{dict.admin.guests.filters.colleagues}<'],
  ['>Khác<', '>{dict.admin.guests.filters.others}<'],
  ['>Tên<', '>{dict.admin.guests.table.name}<'],
  ['>Phân loại<', '>{dict.admin.guests.table.side}<'],
  ['>Nhóm<', '>{dict.admin.guests.table.group}<'],
  ['>SĐT<', '>{dict.admin.guests.table.phone}<'],
  ['>Bàn<', '>{dict.admin.guests.table.table}<'],
  ['>Trạng thái<', '>{dict.admin.guests.table.status}<'],
  ['>Thiệp<', '>{dict.admin.guests.table.invite}<'],
  ['"Chưa phân loại"', 'dict.admin.guests.table.unclassified'],
  ['Chờ', '{dict.admin.guests.table.pending}'],
  ['Đi', '{dict.admin.guests.table.attending}'],
  ['Từ chối', '{dict.admin.guests.table.declined}'],
  ['✅ Đã gửi', '{dict.admin.guests.table.sent}'],
  ['⏳ Chưa gửi', '{dict.admin.guests.table.notSent}'],
  ['Không tìm thấy khách mời nào', '{dict.admin.guests.table.notFound}'],
  ['>Trước<', '>{dict.admin.guests.pagination.prev}<'],
  ['Trang ', '{dict.admin.guests.pagination.page} '],
  ['>Sau<', '>{dict.admin.guests.pagination.next}<'],
  ['>Thêm khách mời mới<', '>{dict.admin.guests.addModal.title}<'],
  ['>Tên khách mời *<', '>{dict.admin.guests.addModal.name}<'],
  ['>Số điện thoại<', '>{dict.admin.guests.addModal.phone}<'],
  ['>Email<', '>{dict.admin.guests.addModal.email}<'],
  ['>Hủy<', '>{dict.common.cancel}<'],
  ['"Đang lưu..." : "Lưu"', 'addLoading ? dict.admin.guests.addModal.saving : dict.admin.guests.addModal.save'],
  ['"Lỗi khi thêm khách"', 'dict.admin.guests.alerts.addError']
]);
