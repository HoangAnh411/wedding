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