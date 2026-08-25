const fs = require('fs');
const path = require('path');

const viPath = 'd:/Data/weddingProject/src/app/[lang]/dictionaries/vi.json';
const enPath = 'd:/Data/weddingProject/src/app/[lang]/dictionaries/en.json';

const viData = JSON.parse(fs.readFileSync(viPath, 'utf8'));
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const viInvitation = {
  payment: {
    bankTitle: "Ngân hàng",
    amountLabel: "Số tiền (VNĐ)",
    amountPlaceholder: "VD: 500000",
    messageLabel: "Lời nhắn",
    messagePlaceholder: "VD: Chuc mung hanh phuc",
    weddingGift: "mung cuoi",
    qrAlt: "QR Mừng cưới",
    copied: "Đã sao chép!",
    copyAccount: "Copy số tài khoản",
    momoTitle: "MoMo",
    openMomo: "Mở MoMo",
    copyPhone: "Copy SĐT",
    paypalTitle: "PayPal",
    sendPaypal: "Gửi qua PayPal",
    copyEmail: "Copy email",
    title: "Mừng cưới",
    description: "Sự hiện diện của bạn là món quà quý giá nhất. Nếu có lòng, bạn có thể gửi mừng cưới qua:"
  },
  hero: {
    inviteText: "Trân trọng kính mời:",
    openCard: "Mở thiệp",
    weddingInvitation: "Wedding Invitation",
    withFamily: "Cùng sự hiện diện của gia đình và bạn bè",
    groomFamily: "Nhà trai",
    brideFamily: "Nhà gái",
    mr: "Ông:",
    mrs: "Bà:",
    comingSoon: "Sắp diễn ra",
    lunarDatePrefix: "Nhằm ngày",
    lunarDateMiddle: "tháng",
    lunarDateSuffix: "năm Âm lịch",
    shareZalo: "Chia sẻ qua Zalo",
    shareFb: "Chia sẻ qua Facebook"
  },
  story: {
    title: "Câu chuyện của chúng mình"
  },
  events: {
    title: "Sự kiện",
    lunar: "âm lịch:",
    addToCalendar: "Thêm vào lịch"
  },
  dresscode: {
    title: "Dress Code",
    subtitle: "Trang phục khuyến nghị khi tham dự",
    description: "Khuyến khích quý khách mặc trang phục theo tone màu Trắng, Hồng Pastel hoặc Xanh Pastel để khung hình thêm phần lung linh.",
    white: "Trắng",
    pink: "Hồng pastel",
    blue: "Xanh pastel"
  },
  travel: {
    title: "Di chuyển & Lưu trú",
    transportTitle: "Di chuyển",
    transport1: "Bãi đỗ xe ô tô/xe máy miễn phí tại khuôn viên nhà hàng.",
    transport2: "Có hỗ trợ gọi Taxi/Grab cho khách có nhu cầu.",
    stayTitle: "Lưu trú",
    stay1: "Đối với khách ở xa, chúng tôi đã chuẩn bị phòng nghỉ tại khách sạn gần đó. Vui lòng liên hệ trước để chúng tôi sắp xếp chu đáo."
  },
  faqs: {
    title: "Q&A",
    q1: "Đám cưới có tổ chức ngoài trời không?",
    a1: "Lễ cưới sẽ diễn ra trong hội trường có máy lạnh, không bị ảnh hưởng bởi thời tiết.",
    q2: "Có thể mang theo trẻ em không?",
    a2: "Chúng tôi rất chào đón các bé. Xin vui lòng báo số lượng trẻ em trong form RSVP để chúng tôi chuẩn bị ghế ngồi phù hợp."
  },
  gallery: {
    title: "Album ảnh"
  },
  rsvp: {
    title: "Xác nhận tham dự",
    successTitle: "Cảm ơn bạn đã xác nhận!",
    successDesc: "Chúng mình rất mong được đón tiếp bạn.",
    error: "Có lỗi xảy ra, vui lòng thử lại",
    name: "Họ và tên *",
    phone: "Số điện thoại",
    email: "Email (để nhận thư cảm ơn/xác nhận)",
    eventsPrompt: "Vui lòng chọn sự kiện bạn sẽ tham dự:",
    attending: "Sẽ tham dự",
    notAttending: "Không thể tham dự",
    maybeAttending: "Có thể tham dự",
    declined: "Xin lỗi không thể",
    guestCountPrefix: "Đi",
    guestCountSuffix: "người",
    guestCountFull: "Số lượng:",
    message: "Lời nhắn cho cô dâu chú rể...",
    sending: "Đang gửi...",
    submit: "Gửi xác nhận"
  },
  wishes: {
    title: "Lời chúc",
    empty: "Chưa có lời chúc nào. Hãy là người đầu tiên!",
    success: "Cảm ơn! Lời chúc của bạn đã được gửi và đang chờ duyệt.",
    error: "Có lỗi xảy ra, vui lòng thử lại",
    name: "Tên của bạn *",
    content: "Lời chúc của bạn *",
    sending: "Đang gửi...",
    submit: "Gửi lời chúc"
  },
  map: {
    title: "Bản đồ chỉ đường",
    openMap: "Mở Google Maps"
  },
  footer: {
    thanks: "Cảm ơn bạn đã đến chia vui cùng chúng mình!"
  }
};

const enInvitation = {
  payment: {
    bankTitle: "Bank",
    amountLabel: "Amount (VND)",
    amountPlaceholder: "Ex: 500000",
    messageLabel: "Message",
    messagePlaceholder: "Ex: Happy Wedding",
    weddingGift: "wedding gift",
    qrAlt: "Wedding Gift QR",
    copied: "Copied!",
    copyAccount: "Copy account number",
    momoTitle: "MoMo",
    openMomo: "Open MoMo",
    copyPhone: "Copy phone number",
    paypalTitle: "PayPal",
    sendPaypal: "Send via PayPal",
    copyEmail: "Copy email",
    title: "Wedding Gift",
    description: "Your presence is our greatest gift. If you wish, you can send a wedding gift via:"
  },
  hero: {
    inviteText: "Cordially invited:",
    openCard: "Open Invitation",
    weddingInvitation: "Wedding Invitation",
    withFamily: "Together with their families and friends",
    groomFamily: "Groom's Family",
    brideFamily: "Bride's Family",
    mr: "Mr.",
    mrs: "Mrs.",
    comingSoon: "Coming soon",
    lunarDatePrefix: "On",
    lunarDateMiddle: "of",
    lunarDateSuffix: "Lunar Calendar",
    shareZalo: "Share via Zalo",
    shareFb: "Share via Facebook"
  },
  story: {
    title: "Our Story"
  },
  events: {
    title: "Events",
    lunar: "lunar:",
    addToCalendar: "Add to Calendar"
  },
  dresscode: {
    title: "Dress Code",
    subtitle: "Recommended attire",
    description: "We encourage guests to wear White, Pastel Pink, or Pastel Blue to make the photos more sparkling.",
    white: "White",
    pink: "Pastel Pink",
    blue: "Pastel Blue"
  },
  travel: {
    title: "Travel & Stay",
    transportTitle: "Transportation",
    transport1: "Free car/motorbike parking at the venue.",
    transport2: "We can help call Taxi/Grab for guests who need it.",
    stayTitle: "Accommodation",
    stay1: "For guests from far away, we have prepared rooms at a nearby hotel. Please contact us in advance to arrange."
  },
  faqs: {
    title: "Q&A",
    q1: "Will the wedding be outdoors?",
    a1: "The wedding will take place in an air-conditioned hall, unaffected by the weather.",
    q2: "Can I bring children?",
    a2: "We warmly welcome children. Please indicate the number of children in the RSVP form so we can prepare suitable seating."
  },
  gallery: {
    title: "Gallery"
  },
  rsvp: {
    title: "RSVP",
    successTitle: "Thank you for confirming!",
    successDesc: "We look forward to seeing you.",
    error: "An error occurred, please try again",
    name: "Full Name *",
    phone: "Phone Number",
    email: "Email (for thank you/confirmation)",
    eventsPrompt: "Please select the events you will attend:",
    attending: "Will attend",
    notAttending: "Cannot attend",
    maybeAttending: "Maybe",
    declined: "Sorry, I cannot",
    guestCountPrefix: "With",
    guestCountSuffix: "people",
    guestCountFull: "Quantity:",
    message: "Message for the couple...",
    sending: "Sending...",
    submit: "Send RSVP"
  },
  wishes: {
    title: "Wishes",
    empty: "No wishes yet. Be the first to send one!",
    success: "Thank you! Your wish has been sent and is pending approval.",
    error: "An error occurred, please try again",
    name: "Your Name *",
    content: "Your Wish *",
    sending: "Sending...",
    submit: "Send Wish"
  },
  map: {
    title: "Map & Directions",
    openMap: "Open Google Maps"
  },
  footer: {
    thanks: "Thank you for coming to celebrate with us!"
  }
};

viData.invitation = viInvitation;
enData.invitation = enInvitation;

fs.writeFileSync(viPath, JSON.stringify(viData, null, 2) + '\n', 'utf8');
fs.writeFileSync(enPath, JSON.stringify(enData, null, 2) + '\n', 'utf8');

console.log('Dictionaries updated successfully.');
