interface ZaloSendResult {
  success: boolean;
  message: string;
  data?: unknown;
}

/**
 * Send invitation via Zalo Notification Service (ZNS)
 * Requires Zalo Official Account (OA) with verified template
 */
export async function sendZaloInvitation(
  phoneNumber: string,
  templateId: string,
  data: Record<string, string>,
): Promise<ZaloSendResult> {
  const accessToken = process.env.ZALO_OA_ACCESS_TOKEN;
  const oaId = process.env.ZALO_OA_ID;

  if (!accessToken || !oaId) {
    return {
      success: false,
      message: "Zalo OA chưa được cấu hình. Vui lòng cập nhật ZALO_OA_ACCESS_TOKEN và ZALO_OA_ID trong .env",
    };
  }

  try {
    const response = await fetch(
      `https://openapi.zalo.me/v3/oa/template/${templateId}/send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access_token: accessToken,
        },
        body: JSON.stringify({
          phone: phoneNumber,
          template_id: templateId,
          template_data: data,
        }),
      },
    );

    const result = await response.json();

    if (result.error) {
      return {
        success: false,
        message: `Zalo API error: ${result.error.message || result.error}`,
      };
    }

    return {
      success: true,
      message: "Gửi thiệp qua Zalo thành công",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: `Lỗi kết nối Zalo: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

/**
 * Send notification to guest via Zalo OA message
 */
export async function sendZaloNotification(
  userId: string,
  message: string,
): Promise<ZaloSendResult> {
  const accessToken = process.env.ZALO_OA_ACCESS_TOKEN;

  if (!accessToken) {
    return { success: false, message: "Zalo OA chưa được cấu hình" };
  }

  try {
    const response = await fetch(
      `https://openapi.zalo.me/v2.0/oa/message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access_token: accessToken,
        },
        body: JSON.stringify({
          recipient: { user_id: userId },
          message: {
            text: message,
          },
        }),
      },
    );

    const result = await response.json();

    if (result.error) {
      return {
        success: false,
        message: `Zalo API error: ${result.error.message || result.error}`,
      };
    }

    return { success: true, message: "Gửi thông báo Zalo thành công", data: result };
  } catch (error) {
    return {
      success: false,
      message: `Lỗi kết nối Zalo: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}