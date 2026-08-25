const fs = require('fs');
const filePath = 'd:/Data/weddingProject/src/app/[lang]/(public)/[slug]/invitation-client.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/status: "Sẽ tham dự"/g, 'status: dict.invitation.rsvp.attending');
content = content.replace(/rsvpForm\.status !== "Xin lỗi không thể"/g, 'rsvpForm.status !== dict.invitation.rsvp.declined');
content = content.replace(/Lễ cưới \$\{wedding\.groomName\} & \$\{wedding\.brideName\}/g, '${dict.wedding.ceremonyTitle.replace("{groom}", wedding.groomName).replace("{bride}", wedding.brideName)}');
content = content.replace(/Kính mời quý khách đến dự lễ cưới của chúng tôi\./g, '${dict.wedding.ceremonyDesc.replace("{groom}", wedding.groomName).replace("{bride}", wedding.brideName)}');
content = content.replace(/Việt Nam/g, '${dict.wedding.venue}');
content = content.replace(/dict\.wedding\.venue\}/g, 'dict.wedding.venue}'); // Fix duplicate bracket if any

fs.writeFileSync(filePath, content, 'utf8');
