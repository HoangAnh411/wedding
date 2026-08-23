import { google } from 'googleapis';
import { Readable } from 'stream';

/**
 * Khởi tạo Google Drive API client
 */
function getDriveClient() {
  const credentialsString = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  
  if (!credentialsString) {
    throw new Error('Thiếu cấu hình GOOGLE_SERVICE_ACCOUNT_JSON trong biến môi trường.');
  }

  // Parse JSON credentials
  let credentials;
  try {
    // Xử lý cả trường hợp truyền base64 hoặc JSON raw string
    if (!credentialsString.startsWith('{')) {
      credentials = JSON.parse(Buffer.from(credentialsString, 'base64').toString('utf-8'));
    } else {
      credentials = JSON.parse(credentialsString);
    }
  } catch (error) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON không hợp lệ.');
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  return google.drive({ version: 'v3', auth });
}

/**
 * Upload file stream lên Google Drive
 * @param fileBuffer Buffer của file cần upload
 * @param fileName Tên file
 * @param mimeType Định dạng MIME của file (vd: image/jpeg)
 * @returns Đường dẫn direct link để view file
 */
export async function uploadToGoogleDrive(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
  const drive = getDriveClient();
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!folderId) {
    throw new Error('Thiếu cấu hình GOOGLE_DRIVE_FOLDER_ID trong biến môi trường.');
  }

  // Chuyển Buffer thành Readable stream
  const bufferStream = new Readable();
  bufferStream.push(fileBuffer);
  bufferStream.push(null);

  try {
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [folderId],
      },
      media: {
        mimeType,
        body: bufferStream,
      },
      fields: 'id',
    });

    const fileId = response.data.id;
    if (!fileId) {
      throw new Error('Upload thất bại, không nhận được file ID.');
    }

    // Trả về direct view link của Google Drive
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  } catch (error) {
    console.error('Lỗi khi upload lên Google Drive:', error);
    throw new Error('Upload Google Drive thất bại.');
  }
}
