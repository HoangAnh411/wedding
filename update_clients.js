const fs = require('fs');

function updateFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  if (!content.includes('useTranslation')) {
    content = content.replace('"use client";', '"use client";\n\nimport { useTranslation } from "@/components/i18n-provider";');
  }

  // Insert const dict = useTranslation(); right after function declaration
  if (!content.includes('const dict = useTranslation();')) {
    content = content.replace(/export default function ([A-Za-z]+)\(([^)]*)\) \{/, 'export default function $1($2) {\n  const dict = useTranslation();');
  }

  for (const [search, replace] of replacements) {
    content = content.split(search).join(replace);
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Updated ' + filePath);
}

// 1. Dashboard
updateFile('d:/Data/weddingProject/src/app/[lang]/admin/dashboard/dashboard-client.tsx', [
  ['>Tổng quan<', '>{dict.admin.dashboard.title}<'],
  ['>Chào mừng bạn đến với Wedding Admin<', '>{dict.admin.dashboard.welcome}<'],
  ['title="Khách mời"', 'title={dict.admin.dashboard.guests}'],
  ['subtitle={`${stats.confirmedGuests} đã xác nhận`}', 'subtitle={`${stats.confirmedGuests} ${dict.admin.dashboard.confirmedSuffix}`}'],
  ['title="Đã xác nhận"', 'title={dict.admin.dashboard.confirmed}'],
  ['% tham dự', '${dict.admin.dashboard.attendRateSuffix}'],
  ['"Chưa có dữ liệu"', 'dict.admin.dashboard.noData'],
  ['title="Tiến độ"', 'title={dict.admin.dashboard.progress}'],
  ['subtitle="Checklist"', 'subtitle={dict.admin.dashboard.checklist}'],
  ['>Chưa có đám cưới nào<', '>{dict.admin.dashboard.noWeddings}<'],
  ['>Tạo đám cưới đầu tiên để bắt đầu quản lý<', '>{dict.admin.dashboard.createFirstWedding}<'],
  ['>Tạo đám cưới mới<', '>{dict.admin.dashboard.createWeddingBtn}<'],
  ['>Đám cưới của bạn<', '>{dict.admin.dashboard.yourWeddings}<'],
  ['"Chưa có ngày"', 'dict.admin.dashboard.noDate']
]);

// 2. Payments
updateFile('d:/Data/weddingProject/src/app/[lang]/admin/payments/payments-client.tsx', [
  ['"Lỗi lưu cấu hình"', 'dict.admin.payments.saveError'],
  ['"Lưu cấu hình thành công"', 'dict.admin.payments.saveSuccess'],
  ['"Có lỗi xảy ra"', 'dict.admin.payments.genericError'],
  ['>Cấu hình thanh toán<', '>{dict.admin.payments.title}<'],
  ['>Thiết lập tài khoản nhận tiền mừng (QR code, chuyển khoản)<', '>{dict.admin.payments.description}<'],
  ['>Chuyển khoản ngân hàng<', '>{dict.admin.payments.bankTransfer}<'],
  ['>Ngân hàng<', '>{dict.admin.payments.bankName}<'],
  ['placeholder="VD: Vietcombank"', 'placeholder={dict.admin.payments.bankNamePlaceholder}'],
  ['>Số tài khoản<', '>{dict.admin.payments.accountNumber}<'],
  ['placeholder="Số tài khoản"', 'placeholder={dict.admin.payments.accountNumberPlaceholder}'],
  ['>Tên chủ tài khoản<', '>{dict.admin.payments.accountName}<'],
  ['placeholder="VD: NGUYEN VAN A"', 'placeholder={dict.admin.payments.accountNamePlaceholder}'],
  ['>URL Mã QR<', '>{dict.admin.payments.qrCodeUrl}<'],
  ['placeholder="https://..."', 'placeholder={dict.admin.payments.qrCodePlaceholder}'],
  ['>Kích hoạt phương thức này<', '>{dict.admin.payments.activateMethod}<'],
  ['"Đang lưu..."', 'dict.admin.payments.saving'],
  ['"Lưu cấu hình"', 'dict.admin.payments.saveConfig']
]);

// 3. Settings
updateFile('d:/Data/weddingProject/src/app/[lang]/admin/settings/settings-client.tsx', [
  ['"Failed to update profile"', 'dict.admin.settings.updateError'],
  ['"Cập nhật thông tin thành công"', 'dict.admin.settings.updateSuccess'],
  ['>Cài đặt<', '>{dict.admin.settings.title}<'],
  ['>Cấu hình thông tin tài khoản<', '>{dict.admin.settings.description}<'],
  ['>Thông tin tài khoản<', '>{dict.admin.settings.accountInfo}<'],
  ['>Email<', '>{dict.admin.settings.email}<'],
  ['>Email không thể thay đổi<', '>{dict.admin.settings.emailCannotChange}<'],
  ['>Tên<', '>{dict.admin.settings.name}<'],
  ['placeholder="Your name"', 'placeholder={dict.admin.settings.namePlaceholder}'],
  ['"Đang lưu..."', 'dict.admin.settings.saving'],
  ['"Lưu thay đổi"', 'dict.admin.settings.saveChanges']
]);

// 4. Staff
updateFile('d:/Data/weddingProject/src/app/[lang]/admin/staff/staff-client.tsx', [
  ['"Có lỗi xảy ra"', 'dict.admin.staff.genericError'],
  ['"Bạn có chắc chắn muốn xóa nhân viên này?"', 'dict.admin.staff.confirmDelete'],
  ['>+ Thêm nhân viên<', '>{dict.admin.staff.addStaffBtn}<'],
  ['>Thêm nhân viên mới<', '>{dict.admin.staff.addStaffTitle}<'],
  ['>Tên<', '>{dict.admin.staff.name}<'],
  ['>Email<', '>{dict.admin.staff.email}<'],
  ['>Mật khẩu<', '>{dict.admin.staff.password}<'],
  ['"Đang lưu..."', 'dict.admin.staff.saving'],
  ['"Lưu"', 'dict.admin.staff.save'],
  ['>Hủy<', '>{dict.admin.staff.cancel}<'],
  ['>Ngày tạo<', '>{dict.admin.staff.createdAt}<'],
  ['>Thao tác<', '>{dict.admin.staff.actions}<'],
  ['>Chưa có nhân viên nào.<', '>{dict.admin.staff.noStaff}<'],
  ['>Xóa<', '>{dict.admin.staff.delete}<']
]);

// 5. Vendors
updateFile('d:/Data/weddingProject/src/app/[lang]/admin/vendors/vendors-client.tsx', [
  ['"Xóa nhà cung cấp này?"', 'dict.admin.vendors.confirmDelete'],
  ['"Đã liên hệ"', 'dict.admin.vendors.statusContacted'],
  ['"Đã book"', 'dict.admin.vendors.statusBooked'],
  ['"Đã thanh toán"', 'dict.admin.vendors.statusPaid'],
  ['>Nhà cung cấp<', '>{dict.admin.vendors.title}<'],
  ['>Quản lý các dịch vụ cho đám cưới<', '>{dict.admin.vendors.description}<'],
  ['>+ Thêm nhà cung cấp<', '>{dict.admin.vendors.addVendorBtn}<'],
  ['>Tên<', '>{dict.admin.vendors.nameCol}<'],
  ['>Danh mục<', '>{dict.admin.vendors.categoryCol}<'],
  ['>Liên hệ<', '>{dict.admin.vendors.contactCol}<'],
  ['>Trạng thái<', '>{dict.admin.vendors.statusCol}<'],
  ['>Hợp đồng<', '>{dict.admin.vendors.contractCol}<'],
  ['>Đã trả<', '>{dict.admin.vendors.paidCol}<'],
  ['>Xóa<', '>{dict.admin.vendors.deleteBtn}<'],
  ['>Thêm nhà cung cấp<', '>{dict.admin.vendors.addVendorTitle}<'],
  ['>Tên *<', '>{dict.admin.vendors.nameLabel}<'],
  ['placeholder="Người liên hệ"', 'placeholder={dict.admin.vendors.contactNamePlaceholder}'],
  ['placeholder="SĐT"', 'placeholder={dict.admin.vendors.contactPhonePlaceholder}'],
  ['placeholder="Giá trị hợp đồng (VNĐ)"', 'placeholder={dict.admin.vendors.contractValuePlaceholder}'],
  ['>Hủy<', '>{dict.admin.vendors.cancelBtn}<'],
  ['"Đang thêm..."', 'dict.admin.vendors.addingBtn'],
  ['"Thêm"', 'dict.admin.vendors.addBtn']
]);
