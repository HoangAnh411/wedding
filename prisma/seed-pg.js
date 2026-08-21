const { Client } = require("pg");
const { hash } = require("bcryptjs");

const connectionString = "postgresql://postgres.dxigsewilgevlrdxlmvf:hoanganh%40411@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

async function main() {
  console.log("🌱 Seeding database...");

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });
  await client.connect();

  const hashedPassword = await hash("admin123", 12);

  // Create admin user
  const userRes = await client.query(
    `INSERT INTO users (id, email, password_hash, name, created_at, updated_at)
     VALUES (gen_random_uuid()::text, 'admin@wedding.com', $1, 'Admin Wedding', NOW(), NOW())
     ON CONFLICT (email) DO UPDATE SET name = 'Admin Wedding'
     RETURNING id`,
    [hashedPassword]
  );
  const userId = userRes.rows[0].id;
  console.log("  ✅ Created admin user: admin@wedding.com");

  // Create wedding
  const weddingRes = await client.query(
    `INSERT INTO weddings (id, user_id, slug, title, groom_name, bride_name, wedding_date, engagement_date, ceremony_date, reception_date, story, venue_name, venue_address, venue_lat, venue_lng, gallery_enabled, music_enabled, rsvp_enabled, wishes_enabled, created_at, updated_at)
     VALUES (gen_random_uuid()::text, $1, 'minh-linh', 'Minh & Linh', 'Minh', 'Linh', $2, $3, $4, $5, $6, $7, $8, $9, $10, true, true, true, true, NOW(), NOW())
     ON CONFLICT (slug) DO UPDATE SET title = 'Minh & Linh'
     RETURNING id`,
    [
      userId,
      "2026-12-20T10:00:00Z",
      "2026-11-15T08:00:00Z",
      "2026-12-20T09:00:00Z",
      "2026-12-20T11:30:00Z",
      "Chúng mình gặp nhau lần đầu tiên vào một ngày mưa ở thư viện đại học. Từ đó, mỗi ngày trôi qua đều có nhau. Sau 5 năm yêu thương, chúng mình quyết định cùng nhau bước vào một hành trình mới. Cảm ơn cuộc đời đã mang chúng mình đến bên nhau.",
      "Khách sạn Rex",
      "141 Nguyễn Huệ, Bến Nghé, Quận 1, TP.HCM",
      10.7769,
      106.7009,
    ]
  );
  const weddingId = weddingRes.rows[0].id;
  console.log("  ✅ Created wedding: minh-linh");

  // Create timeline events
  const events = [
    ["Lễ ăn hỏi", "engagement", "2026-11-15T08:00:00Z", "08:00", "Tư gia nhà gái", 1],
    ["Lễ rước dâu", "ceremony", "2026-12-20T09:00:00Z", "09:00", "Tư gia nhà gái", 2],
    ["Lễ thành hôn", "ceremony", "2026-12-20T10:00:00Z", "10:00", "Nhà thờ Đức Bà", 3],
    ["Tiệc cưới", "reception", "2026-12-20T11:30:00Z", "11:30", "Khách sạn Rex, Q.1", 4],
  ];
  for (const [name, type, date, time, location, order] of events) {
    await client.query(
      `INSERT INTO timeline_events (id, wedding_id, event_type, name, event_date, event_time, location, order_index, created_at)
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, NOW())`,
      [weddingId, type, name, date, time, location, order]
    );
  }
  console.log(`  ✅ Created ${events.length} timeline events`);

  // Create guests
  const guests = [
    ["Nguyễn Văn An", "Nhà trai", "Gia đình", "0901234567", "AN001", 1, true, true],
    ["Trần Thị Bình", "Nhà gái", "Gia đình", "0901234568", "BINH001", 1, true, true],
    ["Lê Văn Cường", "Nhà trai", "Bạn bè", "0901234569", "CUONG001", 2, null, false],
    ["Phạm Thị Dung", "Nhà gái", "Đồng nghiệp", "0901234570", "DUNG001", 3, false, true],
    ["Hoàng Văn Em", "Nhà trai", "Bạn bè", "0901234571", "EM001", 2, true, true],
    ["Đặng Thị Phương", "Nhà gái", "Bạn bè", "0901234572", "PHUONG001", 4, null, false],
    ["Võ Văn Giàu", "Nhà trai", "Đồng nghiệp", "0901234573", "GIAU001", 3, null, false],
    ["Ngô Thị Hạnh", "Nhà gái", "Gia đình", "0901234574", "HANH001", 1, null, false],
  ];
  for (const [name, familySide, groupName, phone, inviteCode, tableNumber, isAttending, hasSent] of guests) {
    await client.query(
      `INSERT INTO guests (id, wedding_id, family_side, name, phone, group_name, invite_code, table_number, is_attending, has_sent_invitation, created_at, updated_at)
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
      [weddingId, familySide, name, phone, groupName, inviteCode, tableNumber, isAttending, hasSent]
    );
  }
  console.log(`  ✅ Created ${guests.length} guests`);

  // Create tables
  const tables = [
    [1, "Bàn gia đình", 10, true],
    [2, "Bàn bạn bè nhà trai", 10, false],
    [3, "Bàn đồng nghiệp", 8, false],
    [4, "Bàn bạn bè nhà gái", 10, false],
    [5, "Bàn dự phòng", 10, false],
  ];
  for (const [num, name, cap, head] of tables) {
    await client.query(
      `INSERT INTO tables (id, wedding_id, table_number, table_name, capacity, is_head_table, created_at)
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, NOW())`,
      [weddingId, num, name, cap, head]
    );
  }
  console.log(`  ✅ Created ${tables.length} tables`);

  // Create vendors
  const vendors = [
    ["Nhiếp ảnh Ánh Dương", "Nhiếp ảnh / Quay phim", "Anh Tuấn", "0909888888", "booked", 15000000, 5000000],
    ["Nhà hàng Rex", "Địa điểm tổ chức", "Chị Hoa", "0909777777", "booked", 80000000, 20000000],
    ["MC Tuấn Anh", "MC - Ban nhạc - DJ", "Tuấn Anh", "0909666666", "contacted", 5000000, 0],
    ["Trang điểm Quỳnh", "Làm đẹp", "Quỳnh", "0909555555", "booked", 8000000, 2000000],
    ["Hoa tươi Lily", "Hoa tươi - Trang trí", "Chị Lily", "0909444444", "contacted", 12000000, 0],
  ];
  for (const [name, category, contact, phone, status, contractValue, paid] of vendors) {
    await client.query(
      `INSERT INTO vendors (id, wedding_id, name, category, contact_name, contact_phone, status, contract_value, paid_amount, created_at, updated_at)
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
      [weddingId, name, category, contact, phone, status, contractValue, paid]
    );
  }
  console.log(`  ✅ Created ${vendors.length} vendors`);

  // Create budget items
  const budgetItems = [
    ["Địa điểm", "Nhà hàng Rex", 80000000, 75000000, true],
    ["Ảnh cưới & Video", "Nhiếp ảnh Ánh Dương", 15000000, 15000000, false],
    ["Trang phục", "Váy cưới", 20000000, null, false],
    ["Hoa & Trang trí", "Trang trí sảnh", 10000000, 12000000, true],
    ["Làm đẹp", "Trang điểm cô dâu", 8000000, 8000000, false],
    ["MC & Giải trí", "MC Tuấn Anh", 5000000, null, false],
  ];
  for (const [category, itemName, estimated, actual, isPaid] of budgetItems) {
    await client.query(
      `INSERT INTO budget_items (id, wedding_id, category, item_name, estimated_cost, actual_cost, is_paid, created_at, updated_at)
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, NOW(), NOW())`,
      [weddingId, category, itemName, estimated, actual, isPaid]
    );
  }
  console.log(`  ✅ Created ${budgetItems.length} budget items`);

  // Create checklist items
  const checklistItems = [
    ["Chọn ngày cưới (xem ngày tốt)", "6-12 tháng trước", true, "high"],
    ["Xác định ngân sách tổng thể", "6-12 tháng trước", true, "high"],
    ["Đặt địa điểm tổ chức", "6-12 tháng trước", true, "high"],
    ["Chọn dịch vụ chụp ảnh cưới", "6-12 tháng trước", true, "medium"],
    ["Chọn nhẫn cưới", "3-6 tháng trước", false, "medium"],
    ["Đăng ký kết hôn", "3-6 tháng trước", false, "high"],
    ["Thiết kế thiệp cưới", "3-6 tháng trước", true, "medium"],
    ["Chọn trang phục cưới", "3-6 tháng trước", false, "medium"],
    ["Gửi thiệp mời", "1-2 tháng trước", false, "high"],
    ["Chọn thực đơn tiệc", "1-2 tháng trước", false, "medium"],
    ["Trang điểm thử", "1-2 tháng trước", false, "low"],
    ["Họp gia đình phân công", "Tuần cưới", false, "high"],
    ["Trang trí lễ đường", "Tuần cưới", false, "medium"],
    ["Gửi lời cảm ơn sau cưới", "Sau đám cưới", false, "medium"],
  ];
  for (const [title, phase, completed, priority] of checklistItems) {
    await client.query(
      `INSERT INTO checklist_items (id, wedding_id, title, phase, is_completed, priority, created_at, updated_at)
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, NOW(), NOW())`,
      [weddingId, title, phase, completed, priority]
    );
  }
  console.log(`  ✅ Created ${checklistItems.length} checklist items`);

  // Create wishes
  const wishes = [
    ["Thanh Hằng", "Chúc hai bạn trăm năm hạnh phúc, sớm sinh quý tử!", true],
    ["Minh Tuấn", "Happy wedding! Chúc anh chị mãi mãi hạnh phúc bên nhau!", true],
    ["Thu Thảo", "Chúc mừng cô dâu chú rể. Mong hai bạn luôn yêu thương nhau!", true],
  ];
  for (const [guestName, content, approved] of wishes) {
    await client.query(
      `INSERT INTO wishes (id, wedding_id, guest_name, content, is_approved, created_at)
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, NOW())`,
      [weddingId, guestName, content, approved]
    );
  }
  console.log(`  ✅ Created ${wishes.length} wishes`);

  // Create money gifts
  const moneyGifts = [
    ["Nguyễn Văn An", 1000000, "Tiền mặt", "2026-12-20"],
    ["Trần Thị Bình", 2000000, "Chuyển khoản", "2026-12-19"],
    ["Hoàng Văn Em", 500000, "Tiền mặt", "2026-12-20"],
    ["Đặng Thị Phương", 1500000, "MoMo", "2026-12-18"],
  ];
  for (const [name, amount, method, date] of moneyGifts) {
    await client.query(
      `INSERT INTO money_gifts (id, wedding_id, guest_name, amount, payment_method, received_at, created_at)
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, NOW())`,
      [weddingId, name, amount, method, date]
    );
  }
  console.log(`  ✅ Created ${moneyGifts.length} money gifts`);

  // Create payment config
  await client.query(
    `INSERT INTO payment_configs (id, wedding_id, gateway_type, bank_name, account_number, account_name, is_active, created_at)
     VALUES (gen_random_uuid()::text, $1, 'bank_transfer', 'Vietcombank', '1012345678', 'Nguyễn Văn Minh', true, NOW())`,
    [weddingId]
  );
  console.log("  ✅ Created payment configs");

  await client.end();
  console.log("\n🎉 Seed completed successfully!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});