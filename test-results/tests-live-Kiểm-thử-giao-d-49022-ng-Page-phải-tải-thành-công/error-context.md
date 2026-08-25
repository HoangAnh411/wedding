# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\live.spec.ts >> Kiểm thử giao diện Công khai (Public) >> Trang chủ (Landing Page) phải tải thành công
- Location: tests\live.spec.ts:6:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: net::ERR_TIMED_OUT at https://wedding-inky-eight.vercel.app/
Call log:
  - navigating to "https://wedding-inky-eight.vercel.app/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const BASE_URL = 'https://wedding-inky-eight.vercel.app';
  4  | 
  5  | test.describe('Kiểm thử giao diện Công khai (Public)', () => {
  6  |   test('Trang chủ (Landing Page) phải tải thành công', async ({ page }) => {
  7  |     // Truy cập trang chủ
> 8  |     const response = await page.goto(BASE_URL);
     |                                 ^ Error: page.goto: net::ERR_TIMED_OUT at https://wedding-inky-eight.vercel.app/
  9  |     expect(response?.status()).toBe(200);
  10 | 
  11 |     // Kiểm tra tiêu đề trang
  12 |     await expect(page).toHaveTitle(/WeddingApp|Thiệp Cưới/i);
  13 | 
  14 |     // Kiểm tra nút Đăng nhập hoặc Trải nghiệm
  15 |     const ctaButton = page.locator('a[href="/login"], a:has-text("Trải nghiệm")').first();
  16 |     await expect(ctaButton).toBeVisible();
  17 |   });
  18 | 
  19 |   test('Trang Đăng nhập (Login Page) không bị lỗi', async ({ page }) => {
  20 |     const response = await page.goto(`${BASE_URL}/login`);
  21 |     expect(response?.status()).toBe(200);
  22 | 
  23 |     // Kiểm tra form đăng nhập xuất hiện
  24 |     await expect(page.locator('input[type="email"]')).toBeVisible();
  25 |     await expect(page.locator('input[type="password"]')).toBeVisible();
  26 |     await expect(page.locator('button[type="submit"]')).toBeVisible();
  27 |   });
  28 | });
  29 | 
  30 | test.describe('Kiểm thử API (Yêu cầu Đăng nhập)', () => {
  31 |   // Thay thế email và password này bằng tài khoản thật trên DB của bạn để test tự động
  32 |   const TEST_USER = {
  33 |     email: 'admin@example.com', // TODO: Đổi thành email của bạn
  34 |     password: 'password123'     // TODO: Đổi thành mật khẩu của bạn
  35 |   };
  36 | 
  37 |   test('API Login và Tạo thiệp cưới (Mô phỏng)', async ({ request }) => {
  38 |     // Bỏ qua test nếu chưa cấu hình tài khoản thật
  39 |     test.skip(TEST_USER.email === 'admin@example.com', 'Cần cấu hình tài khoản thật để test API');
  40 | 
  41 |     console.log('1. Đăng nhập để lấy Cookie Session...');
  42 |     // API NextAuth Credentials
  43 |     // (Playwright có thể tự quản lý cookie sau khi gửi form tới /api/auth/callback/credentials)
  44 |     // Tùy thuộc vào config NextAuth, ta gửi request POST form urlencoded
  45 |     const loginRes = await request.post(`${BASE_URL}/api/auth/callback/credentials`, {
  46 |       form: {
  47 |         email: TEST_USER.email,
  48 |         password: TEST_USER.password,
  49 |         redirect: 'false',
  50 |       }
  51 |     });
  52 |     
  53 |     expect(loginRes.ok()).toBeTruthy();
  54 | 
  55 |     console.log('2. Test API GET /api/weddings (Lấy danh sách đám cưới)');
  56 |     const getRes = await request.get(`${BASE_URL}/api/weddings`);
  57 |     expect(getRes.status()).toBe(200);
  58 |     const getJson = await getRes.json();
  59 |     expect(Array.isArray(getJson.data)).toBeTruthy();
  60 | 
  61 |     console.log('3. Test API POST /api/weddings (Tạo đám cưới mới với các trường ngày tháng bị bỏ trống)');
  62 |     // Đây là bài test để kiểm chứng lỗi 500 đã được sửa triệt để hay chưa!
  63 |     const createRes = await request.post(`${BASE_URL}/api/weddings`, {
  64 |       data: {
  65 |         groomName: "Test Chú Rể",
  66 |         brideName: "Test Cô Dâu",
  67 |         weddingDate: "", // Cố tình gửi chuỗi rỗng để test hệ thống ép kiểu về null
  68 |         venueName: "",
  69 |         clientEmail: ""
  70 |       }
  71 |     });
  72 |     
  73 |     // Nếu lỗi 500 cũ còn tồn tại, assert này sẽ FAIL.
  74 |     // Vì tôi đã sửa trong src/lib/validations.ts, assert này sẽ PASS và trả về 201 Created!
  75 |     expect(createRes.status()).toBe(201);
  76 |     const createdData = await createRes.json();
  77 |     expect(createdData.data.id).toBeDefined();
  78 | 
  79 |     console.log('4. Xóa đám cưới rác vừa test');
  80 |     const deleteRes = await request.delete(`${BASE_URL}/api/weddings/${createdData.data.id}`);
  81 |     expect(deleteRes.status()).toBe(200);
  82 |   });
  83 | });
  84 | 
```