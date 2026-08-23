import nodemailer from "nodemailer";

interface EmailSendResult {
  success: boolean;
  message: string;
  data?: unknown;
}

function getTransporter() {
  const host = process.env.MAIL_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.MAIL_PORT || "587");
  const user = process.env.MAIL_USERNAME || "";
  const pass = process.env.MAIL_PASSWORD || "";
  const encryption = process.env.MAIL_ENCRYPTION || "tls";

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: user && pass ? { user, pass } : undefined,
    tls: encryption === "tls" ? { rejectUnauthorized: false } : undefined,
    connectionTimeout: parseInt(process.env.MAIL_TIMEOUT || "20") * 1000,
  });
}

function getFromAddress(): string {
  const address = process.env.MAIL_FROM_ADDRESS || process.env.MAIL_USERNAME || "noreply@wedding.com";
  const name = process.env.MAIL_FROM_NAME || "Thiệp cưới";
  return `"${name}" <${address}>`;
}

/**
 * Send wedding invitation email via SMTP
 */
export async function sendInvitationEmail(
  to: string,
  data: {
    guestName: string;
    groomName: string;
    brideName: string;
    weddingDate: string;
    venueName: string;
    venueAddress: string;
    invitationUrl: string;
  },
): Promise<EmailSendResult> {
  const hasSmtpConfig = process.env.MAIL_HOST && process.env.MAIL_USERNAME && process.env.MAIL_PASSWORD;

  if (!hasSmtpConfig) {
    return {
      success: false,
      message: "SMTP chưa được cấu hình. Vui lòng cập nhật MAIL_HOST, MAIL_USERNAME, MAIL_PASSWORD trong .env",
    };
  }

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: getFromAddress(),
      to: [to],
      subject: `Thiệp cưới - ${data.groomName} & ${data.brideName}`,
      html: getInvitationEmailTemplate(data),
    });

    return {
      success: true,
      message: "Gửi email thành công",
      data: info,
    };
  } catch (error) {
    return {
      success: false,
      message: `Lỗi gửi email: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

function getInvitationEmailTemplate(data: {
  guestName: string;
  groomName: string;
  brideName: string;
  weddingDate: string;
  venueName: string;
  venueAddress: string;
  invitationUrl: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background: #f5f5f5; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background: #ffffff; border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #e11d48, #be123c); padding: 40px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 28px; margin: 0;">💍</h1>
              <h2 style="color: #ffffff; font-size: 24px; margin: 16px 0 0;">${data.groomName} & ${data.brideName}</h2>
              <p style="color: #fecaca; font-size: 14px; margin: 8px 0 0;">Wedding Invitation</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="font-size: 16px; color: #333; margin: 0;">Dear ${data.guestName},</p>
              <p style="font-size: 16px; color: #555; line-height: 1.6; margin: 16px 0 0;">
                Chúng tôi trân trọng kính mời bạn đến tham dự lễ cưới của chúng tôi.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0; background: #f9f9f9; border-radius: 12px; padding: 20px;">
                <tr>
                  <td style="font-size: 14px; color: #888; padding: 4px 0;">📅 Ngày</td>
                </tr>
                <tr>
                  <td style="font-size: 16px; color: #333; font-weight: bold; padding: 0 0 12px;">${data.weddingDate}</td>
                </tr>
                <tr>
                  <td style="font-size: 14px; color: #888; padding: 4px 0;">📍 Địa điểm</td>
                </tr>
                <tr>
                  <td style="font-size: 16px; color: #333; font-weight: bold; padding: 0;">${data.venueName}</td>
                </tr>
                <tr>
                  <td style="font-size: 14px; color: #666; padding: 4px 0 0;">${data.venueAddress}</td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 16px 0;">
                    <a href="${data.invitationUrl}" style="background: #e11d48; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; display: inline-block;">
                      Xem thiệp cưới
                    </a>
                  </td>
                </tr>
              </table>
              <p style="font-size: 14px; color: #888; text-align: center; margin: 24px 0 0;">
                Hoặc truy cập: <a href="${data.invitationUrl}" style="color: #e11d48;">${data.invitationUrl}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background: #f5f5f5; padding: 20px; text-align: center;">
              <p style="font-size: 12px; color: #aaa; margin: 0;">
                Trân trọng cảm ơn sự hiện diện của bạn!
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendAccountEmail(email: string, password: string, weddingTitle: string): Promise<EmailSendResult> {
  const hasSmtpConfig = process.env.MAIL_HOST && process.env.MAIL_USERNAME && process.env.MAIL_PASSWORD;

  if (!hasSmtpConfig) {
    return {
      success: false,
      message: "SMTP chưa được cấu hình.",
    };
  }

  const loginUrl = process.env.AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #e11d48; text-align: center;">Chào mừng đến với hệ thống quản lý Đám Cưới</h2>
      <p>Xin chào,</p>
      <p>Tài khoản của bạn đã được tạo thành công cho đám cưới: <strong>${weddingTitle}</strong>.</p>
      <p>Dưới đây là thông tin đăng nhập của bạn:</p>
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Đường dẫn:</strong> <a href="${loginUrl}" style="color: #e11d48;">${loginUrl}</a></p>
        <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
        <p style="margin: 5px 0;"><strong>Mật khẩu:</strong> ${password}</p>
      </div>
      <p>Vui lòng đăng nhập và đổi mật khẩu trong phần cài đặt tài khoản để đảm bảo tính bảo mật.</p>
      <p>Trân trọng,<br/>Đội ngũ Hỗ trợ</p>
    </div>
  `;

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: getFromAddress(),
      to: email,
      subject: 'Thông tin tài khoản quản lý đám cưới của bạn',
      html: html,
    });

    return {
      success: true,
      message: "Gửi email thành công",
      data: info,
    };
  } catch (error) {
    return {
      success: false,
      message: `Lỗi gửi email: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

export async function sendStaffAccountEmail(email: string, password: string, name: string): Promise<EmailSendResult> {
  const hasSmtpConfig = process.env.MAIL_HOST && process.env.MAIL_USERNAME && process.env.MAIL_PASSWORD;

  if (!hasSmtpConfig) {
    return {
      success: false,
      message: "SMTP chưa được cấu hình.",
    };
  }

  const loginUrl = process.env.AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #e11d48; text-align: center;">Hệ thống Quản lý Đám Cưới</h2>
      <p>Xin chào ${name},</p>
      <p>Bạn đã được tạo tài khoản Nhân viên (Staff) thành công trên hệ thống quản lý đám cưới.</p>
      <p>Dưới đây là thông tin đăng nhập của bạn:</p>
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Đường dẫn đăng nhập:</strong> <a href="${loginUrl}/admin/login" style="color: #e11d48;">${loginUrl}/admin/login</a></p>
        <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
        <p style="margin: 5px 0;"><strong>Mật khẩu:</strong> ${password}</p>
      </div>
      <p>Vui lòng đăng nhập và bảo mật thông tin tài khoản của bạn.</p>
      <p>Trân trọng,<br/>Đội ngũ Quản trị (Superadmin)</p>
    </div>
  `;

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: getFromAddress(),
      to: email,
      subject: 'Tài khoản nhân viên quản lý đám cưới của bạn',
      html: html,
    });

    return {
      success: true,
      message: "Gửi email thành công",
      data: info,
    };
  } catch (error) {
    return {
      success: false,
      message: `Lỗi gửi email: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

export async function sendThankYouEmail(
  to: string,
  data: {
    guestName: string;
    groomName: string;
    brideName: string;
    galleryUrl: string;
  }
): Promise<EmailSendResult> {
  const hasSmtpConfig = process.env.MAIL_HOST && process.env.MAIL_USERNAME && process.env.MAIL_PASSWORD;

  if (!hasSmtpConfig) {
    return {
      success: false,
      message: "SMTP chưa được cấu hình.",
    };
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #e11d48; text-align: center;">Chân thành cảm ơn!</h2>
      <p>Thân gửi ${data.guestName},</p>
      <p>Sự hiện diện của bạn là món quà vô giá, góp phần làm cho ngày vui của <strong>${data.groomName} & ${data.brideName}</strong> thêm trọn vẹn và ý nghĩa.</p>
      
      <p>Gia đình chúng tôi xin gửi lời cảm ơn chân thành và sâu sắc nhất đến bạn. Chúc bạn cùng gia đình luôn mạnh khỏe, hạnh phúc và thành công.</p>
      
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
        <p>Để lưu lại những khoảnh khắc tuyệt vời trong ngày cưới, mời bạn xem album ảnh tại đây:</p>
        <p style="margin: 20px 0;">
          <a href="${data.galleryUrl}" style="background-color: #e11d48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Xem Album Ảnh</a>
        </p>
      </div>
      
      <p>Trân trọng,<br/>${data.groomName} & ${data.brideName}</p>
    </div>
  `;

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: getFromAddress(),
      to,
      subject: `[Cảm ơn] Từ ${data.groomName} & ${data.brideName}`,
      html,
    });

    return {
      success: true,
      message: "Gửi email thành công",
      data: info,
    };
  } catch (error) {
    return {
      success: false,
      message: `Lỗi gửi email: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

export async function sendRsvpConfirmationEmail(
  to: string,
  data: {
    guestName: string;
    groomName: string;
    brideName: string;
    weddingDate: string;
    venueName: string;
    isAttending: boolean;
    invitationUrl: string;
  }
): Promise<EmailSendResult> {
  const hasSmtpConfig = process.env.MAIL_HOST && process.env.MAIL_USERNAME && process.env.MAIL_PASSWORD;

  if (!hasSmtpConfig) {
    return {
      success: false,
      message: "SMTP chưa được cấu hình.",
    };
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #e11d48; text-align: center;">Cảm ơn bạn đã xác nhận tham dự!</h2>
      <p>Xin chào ${data.guestName},</p>
      <p>Chúng tôi đã nhận được phản hồi RSVP của bạn cho lễ cưới của <strong>${data.groomName} & ${data.brideName}</strong>.</p>
      
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid ${data.isAttending ? '#10b981' : '#f43f5e'};">
        <p style="margin: 5px 0;"><strong>Trạng thái:</strong> ${data.isAttending ? 'Sẽ tham dự ✅' : 'Không thể tham dự ❌'}</p>
        ${data.isAttending ? `
          <p style="margin: 5px 0;"><strong>Thời gian:</strong> ${data.weddingDate}</p>
          <p style="margin: 5px 0;"><strong>Địa điểm:</strong> ${data.venueName}</p>
        ` : ''}
      </div>
      
      <p>Bạn có thể xem lại thông tin thiệp cưới tại đây:</p>
      <p style="text-align: center; margin: 20px 0;">
        <a href="${data.invitationUrl}" style="background-color: #e11d48; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Xem thiệp cưới</a>
      </p>
      
      <p>Trân trọng,<br/>Gia đình hai bên</p>
    </div>
  `;

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: getFromAddress(),
      to,
      subject: `[Xác nhận RSVP] Đám cưới ${data.groomName} & ${data.brideName}`,
      html,
    });

    return {
      success: true,
      message: "Gửi email thành công",
      data: info,
    };
  } catch (error) {
    return {
      success: false,
      message: `Lỗi gửi email: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}