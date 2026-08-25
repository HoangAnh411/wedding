const fs = require('fs');
const path = require('path');

const filePath = 'd:/Data/weddingProject/src/app/[lang]/(public)/[slug]/invitation-client.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add import
if (!content.includes('import { useTranslation }')) {
  content = content.replace(
    /import { useState, useEffect, useRef } from "react";/,
    `import { useState, useEffect, useRef } from "react";\nimport { useTranslation } from "@/components/i18n-provider";`
  );
}

// 2. Add const dict = useTranslation(); to PaymentSection
if (!content.includes('const dict = useTranslation();') || content.indexOf('const dict = useTranslation();') === -1) {
  content = content.replace(
    /const PaymentSection = \(\{ configs, guestName \}: \{ configs: WeddingData\['paymentConfigs'\], guestName\?: string \}\) => \{/,
    `const PaymentSection = ({ configs, guestName }: { configs: WeddingData['paymentConfigs'], guestName?: string }) => {\n  const dict = useTranslation();`
  );

  // 3. Add const dict = useTranslation(); to InvitationClient
  content = content.replace(
    /export default function InvitationClient\(\{ wedding, guestInfo \}: \{ wedding: WeddingData, guestInfo\?: \{ name: string; phone: string \| null \} \}\) \{/,
    `export default function InvitationClient({ wedding, guestInfo }: { wedding: WeddingData, guestInfo?: { name: string; phone: string | null } }) {\n  const dict = useTranslation();`
  );
}

// Replacements in PaymentSection
content = content.replace(/>🏦 Ngân hàng<\/div>/g, '>{`🏦 ${dict.invitation.payment.bankTitle}`}</div>');
content = content.replace(/>Số tiền \(VNĐ\)<\/label>/g, '>{dict.invitation.payment.amountLabel}</label>');
content = content.replace(/placeholder="VD: 500000"/g, 'placeholder={dict.invitation.payment.amountPlaceholder}');
content = content.replace(/>Lời nhắn<\/label>/g, '>{dict.invitation.payment.messageLabel}</label>');
content = content.replace(/placeholder="VD: Chuc mung hanh phuc"/g, 'placeholder={dict.invitation.payment.messagePlaceholder}');
content = content.replace(/' mung cuoi'/g, '` ${dict.invitation.payment.weddingGift}`');
content = content.replace(/" mung cuoi"/g, '` ${dict.invitation.payment.weddingGift}`');
content = content.replace(/alt="QR Mừng cưới"/g, 'alt={dict.invitation.payment.qrAlt}');
content = content.replace(/"Đã sao chép!" : "Copy số tài khoản"/g, 'dict.invitation.payment.copied : dict.invitation.payment.copyAccount');
content = content.replace(/>📱 MoMo<\/div>/g, '>{`📱 ${dict.invitation.payment.momoTitle}`}</div>');
content = content.replace(/>Mở MoMo<\/a>/g, '>{dict.invitation.payment.openMomo}</a>');
content = content.replace(/"Đã sao chép!" : "Copy SĐT"/g, 'dict.invitation.payment.copied : dict.invitation.payment.copyPhone');
content = content.replace(/>💳 PayPal<\/div>/g, '>{`💳 ${dict.invitation.payment.paypalTitle}`}</div>');
content = content.replace(/>Gửi qua PayPal<\/a>/g, '>{dict.invitation.payment.sendPaypal}</a>');
content = content.replace(/"Đã sao chép!" : "Copy email"/g, 'dict.invitation.payment.copied : dict.invitation.payment.copyEmail');
content = content.replace(/title="Mừng cưới"/g, 'title={dict.invitation.payment.title}');
content = content.replace(/>\s*Sự hiện diện của bạn là món quà quý giá nhất\. Nếu có lòng, bạn có thể gửi mừng cưới qua:\s*<\/p>/g, '>{dict.invitation.payment.description}</p>');


// Replacements in InvitationClient
content = content.replace(/>\s*Trân trọng kính mời: /g, '>{dict.invitation.hero.inviteText} ');
content = content.replace(/>Mở thiệp<\/p>/g, '>{dict.invitation.hero.openCard}</p>');
content = content.replace(/>Wedding Invitation<\/p>/g, '>{dict.invitation.hero.weddingInvitation}</p>');
content = content.replace(/>Cùng sự hiện diện của gia đình và bạn bè<\/p>/g, '>{dict.invitation.hero.withFamily}</p>');
content = content.replace(/>Nhà trai<\/p>/g, '>{dict.invitation.hero.groomFamily}</p>');
content = content.replace(/>Ông: /g, '>{dict.invitation.hero.mr} ');
content = content.replace(/>Bà: /g, '>{dict.invitation.hero.mrs} ');
content = content.replace(/>Nhà gái<\/p>/g, '>{dict.invitation.hero.brideFamily}</p>');
content = content.replace(/"Sắp diễn ra"/g, 'dict.invitation.hero.comingSoon');

// Handle lunar date prefix
content = content.replace(/`\(Nhằm ngày \$\{lDate\.day\} tháng \$\{lDate\.month\} năm Âm lịch\)`/g, '`(${dict.invitation.hero.lunarDatePrefix} ${lDate.day} ${dict.invitation.hero.lunarDateMiddle} ${lDate.month} ${dict.invitation.hero.lunarDateSuffix})`');

content = content.replace(/title="Chia sẻ qua Zalo"/g, 'title={dict.invitation.hero.shareZalo}');
content = content.replace(/title="Chia sẻ qua Facebook"/g, 'title={dict.invitation.hero.shareFb}');
content = content.replace(/title="Câu chuyện của chúng mình"/g, 'title={dict.invitation.story.title}');
content = content.replace(/title="Sự kiện"/g, 'title={dict.invitation.events.title}');
content = content.replace(/`\(âm lịch: \$\{lDate\.day\}\/\$\{lDate\.month\}\)`/g, '`(${dict.invitation.events.lunar} ${lDate.day}/${lDate.month})`');
content = content.replace(/>\s*Thêm vào lịch\s*<\/a>/g, '>\n                {dict.invitation.events.addToCalendar}\n              </a>');

content = content.replace(/title="Dress Code"/g, 'title={dict.invitation.dresscode.title}');
content = content.replace(/>Trang phục khuyến nghị khi tham dự<\/p>/g, '>{dict.invitation.dresscode.subtitle}</p>');
content = content.replace(/title="Trắng"/g, 'title={dict.invitation.dresscode.white}');
content = content.replace(/title="Hồng pastel"/g, 'title={dict.invitation.dresscode.pink}');
content = content.replace(/title="Xanh pastel"/g, 'title={dict.invitation.dresscode.blue}');
content = content.replace(/>Khuyến khích quý khách mặc trang phục theo tone màu Trắng, Hồng Pastel hoặc Xanh Pastel để khung hình thêm phần lung linh\.<\/p>/g, '>{dict.invitation.dresscode.description}</p>');

content = content.replace(/title="Di chuyển & Lưu trú"/g, 'title={dict.invitation.travel.title}');
content = content.replace(/>🚕 Di chuyển<\/h3>/g, '>{`🚕 ${dict.invitation.travel.transportTitle}`}</h3>');
content = content.replace(/>Bãi đỗ xe ô tô\/xe máy miễn phí tại khuôn viên nhà hàng\.<\/li>/g, '>{dict.invitation.travel.transport1}</li>');
content = content.replace(/>Có hỗ trợ gọi Taxi\/Grab cho khách có nhu cầu\.<\/li>/g, '>{dict.invitation.travel.transport2}</li>');
content = content.replace(/>🏨 Lưu trú<\/h3>/g, '>{`🏨 ${dict.invitation.travel.stayTitle}`}</h3>');
content = content.replace(/>Đối với khách ở xa, chúng tôi đã chuẩn bị phòng nghỉ tại khách sạn gần đó\. Vui lòng liên hệ trước để chúng tôi sắp xếp chu đáo\.<\/li>/g, '>{dict.invitation.travel.stay1}</li>');

content = content.replace(/title="Q&A"/g, 'title={dict.invitation.faqs.title}');
content = content.replace(/>Q: Đám cưới có tổ chức ngoài trời không\?<\/h4>/g, '>{`Q: ${dict.invitation.faqs.q1}`}</h4>');
content = content.replace(/>A: Lễ cưới sẽ diễn ra trong hội trường có máy lạnh, không bị ảnh hưởng bởi thời tiết\.<\/p>/g, '>{`A: ${dict.invitation.faqs.a1}`}</p>');
content = content.replace(/>Q: Có thể mang theo trẻ em không\?<\/h4>/g, '>{`Q: ${dict.invitation.faqs.q2}`}</h4>');
content = content.replace(/>A: Chúng tôi rất chào đón các bé\. Xin vui lòng báo số lượng trẻ em trong form RSVP để chúng tôi chuẩn bị ghế ngồi phù hợp\.<\/p>/g, '>{`A: ${dict.invitation.faqs.a2}`}</p>');

content = content.replace(/title="Album ảnh"/g, 'title={dict.invitation.gallery.title}');
content = content.replace(/title="Xác nhận tham dự"/g, 'title={dict.invitation.rsvp.title}');
content = content.replace(/>✅ Cảm ơn bạn đã xác nhận!<\/p>/g, '>{`✅ ${dict.invitation.rsvp.successTitle}`}</p>');
content = content.replace(/>Chúng mình rất mong được đón tiếp bạn\.<\/p>/g, '>{dict.invitation.rsvp.successDesc}</p>');
content = content.replace(/"Có lỗi xảy ra, vui lòng thử lại"/g, 'dict.invitation.rsvp.error');
content = content.replace(/placeholder="Họ và tên \*"/g, 'placeholder={dict.invitation.rsvp.name}');
content = content.replace(/placeholder="Số điện thoại"/g, 'placeholder={dict.invitation.rsvp.phone}');
content = content.replace(/placeholder="Email \(để nhận thư cảm ơn\/xác nhận\)"/g, 'placeholder={dict.invitation.rsvp.email}');
content = content.replace(/>Vui lòng chọn sự kiện bạn sẽ tham dự:<\/p>/g, '>{dict.invitation.rsvp.eventsPrompt}</p>');
content = content.replace(/>Sẽ tham dự<\/option>/g, '>{dict.invitation.rsvp.attending}</option>');
content = content.replace(/>Không thể tham dự<\/option>/g, '>{dict.invitation.rsvp.notAttending}</option>');
content = content.replace(/>Đi \{n\} người<\/option>/g, '>{`${dict.invitation.rsvp.guestCountPrefix} ${n} ${dict.invitation.rsvp.guestCountSuffix}`}</option>');
content = content.replace(/>Có thể tham dự<\/option>/g, '>{dict.invitation.rsvp.maybeAttending}</option>');
content = content.replace(/>Xin lỗi không thể<\/option>/g, '>{dict.invitation.rsvp.declined}</option>');
content = content.replace(/>Số lượng: \{n\} người<\/option>/g, '>{`${dict.invitation.rsvp.guestCountFull} ${n} ${dict.invitation.rsvp.guestCountSuffix}`}</option>');
content = content.replace(/placeholder="Lời nhắn cho cô dâu chú rể..."/g, 'placeholder={dict.invitation.rsvp.message}');
content = content.replace(/"Đang gửi\.\.\." : "Gửi xác nhận"/g, 'dict.invitation.rsvp.sending : dict.invitation.rsvp.submit');

content = content.replace(/title="Lời chúc"/g, 'title={dict.invitation.wishes.title}');
content = content.replace(/>Chưa có lời chúc nào\. Hãy là người đầu tiên!<\/p>/g, '>{dict.invitation.wishes.empty}</p>');
content = content.replace(/>✅ Cảm ơn! Lời chúc của bạn đã được gửi và đang chờ duyệt\.<\/p>/g, '>{`✅ ${dict.invitation.wishes.success}`}</p>');
content = content.replace(/placeholder="Tên của bạn \*"/g, 'placeholder={dict.invitation.wishes.name}');
content = content.replace(/placeholder="Lời chúc của bạn \*"/g, 'placeholder={dict.invitation.wishes.content}');
content = content.replace(/"Đang gửi\.\.\." : "Gửi lời chúc"/g, 'dict.invitation.wishes.sending : dict.invitation.wishes.submit');

content = content.replace(/title="Bản đồ chỉ đường"/g, 'title={dict.invitation.map.title}');
content = content.replace(/>\s*📍 Mở Google Maps\s*<\/a>/g, '>\n              {`📍 ${dict.invitation.map.openMap}`}\n            </a>');
content = content.replace(/>Cảm ơn bạn đã đến chia vui cùng chúng mình!<\/p>/g, '>{dict.invitation.footer.thanks}</p>');

fs.writeFileSync(filePath, content, 'utf8');

console.log('Script updated successfully.');
