const fs = require('fs');
const filePath = 'd:/Data/weddingProject/src/app/[lang]/(public)/[slug]/invitation-client.tsx';
let content = fs.readFileSync(filePath, 'utf8');
content = content.replace(/\$\{guestName\} mung cuoi/g, '${guestName} ${dict.invitation.payment.weddingGift}');
content = content.replace(/\{`Mở thiệp`\}/g, '{dict.invitation.hero.openCard}');
fs.writeFileSync(filePath, content, 'utf8');
