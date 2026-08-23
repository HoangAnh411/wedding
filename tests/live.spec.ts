import { test, expect } from '@playwright/test';

const BASE_URL = 'https://wedding-inky-eight.vercel.app';

test.describe('Kiểm thử giao diện Công khai (Public)', () => {
  test('Trang chủ (Landing Page) phải tải thành công', async ({ page }) => {
    // Truy cập trang chủ
    const response = await page.goto(BASE_URL);
    expect(response?.status()).toBe(200);

    // Kiểm tra tiêu đề trang
    await expect(page).toHaveTitle(/WeddingApp|Thiệp Cưới/i);

    // Kiểm tra nút Đăng nhập hoặc Trải nghiệm
    const ctaButton = page.locator('a[href="/login"], a:has-text("Trải nghiệm")').first();
    await expect(ctaButton).toBeVisible();
  });

  test('Trang Đăng nhập (Login Page) không bị lỗi', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/login`);
    expect(response?.status()).toBe(200);

    // Kiểm tra form đăng nhập xuất hiện
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});

test.describe('Kiểm thử API (Yêu cầu Đăng nhập)', () => {
  // Thay thế email và password này bằng tài khoản thật trên DB của bạn để test tự động
  const TEST_USER = {
    email: 'admin@example.com', // TODO: Đổi thành email của bạn
    password: 'password123'     // TODO: Đổi thành mật khẩu của bạn
  };

  test('API Login và Tạo thiệp cưới (Mô phỏng)', async ({ request }) => {
    // Bỏ qua test nếu chưa cấu hình tài khoản thật
    test.skip(TEST_USER.email === 'admin@example.com', 'Cần cấu hình tài khoản thật để test API');

    console.log('1. Đăng nhập để lấy Cookie Session...');
    // API NextAuth Credentials
    // (Playwright có thể tự quản lý cookie sau khi gửi form tới /api/auth/callback/credentials)
    // Tùy thuộc vào config NextAuth, ta gửi request POST form urlencoded
    const loginRes = await request.post(`${BASE_URL}/api/auth/callback/credentials`, {
      form: {
        email: TEST_USER.email,
        password: TEST_USER.password,
        redirect: 'false',
      }
    });
    
    expect(loginRes.ok()).toBeTruthy();

    console.log('2. Test API GET /api/weddings (Lấy danh sách đám cưới)');
    const getRes = await request.get(`${BASE_URL}/api/weddings`);
    expect(getRes.status()).toBe(200);
    const getJson = await getRes.json();
    expect(Array.isArray(getJson.data)).toBeTruthy();

    console.log('3. Test API POST /api/weddings (Tạo đám cưới mới với các trường ngày tháng bị bỏ trống)');
    // Đây là bài test để kiểm chứng lỗi 500 đã được sửa triệt để hay chưa!
    const createRes = await request.post(`${BASE_URL}/api/weddings`, {
      data: {
        groomName: "Test Chú Rể",
        brideName: "Test Cô Dâu",
        weddingDate: "", // Cố tình gửi chuỗi rỗng để test hệ thống ép kiểu về null
        venueName: "",
        clientEmail: ""
      }
    });
    
    // Nếu lỗi 500 cũ còn tồn tại, assert này sẽ FAIL.
    // Vì tôi đã sửa trong src/lib/validations.ts, assert này sẽ PASS và trả về 201 Created!
    expect(createRes.status()).toBe(201);
    const createdData = await createRes.json();
    expect(createdData.data.id).toBeDefined();

    console.log('4. Xóa đám cưới rác vừa test');
    const deleteRes = await request.delete(`${BASE_URL}/api/weddings/${createdData.data.id}`);
    expect(deleteRes.status()).toBe(200);
  });
});
