const { execSync } = require('child_process');

function pushDb() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('Lỗi: Không tìm thấy DATABASE_URL trong biến môi trường.');
    process.exit(1);
  }

  // Tự động tạo DIRECT_URL từ DATABASE_URL bằng cách đổi port 6543 -> 5432 và xoá query pgbouncer
  let directUrl = dbUrl;
  if (directUrl.includes('6543')) {
    directUrl = directUrl.replace(':6543', ':5432');
  }
  // Remove any query parameters like ?pgbouncer=true&sslmode=require
  if (directUrl.includes('?')) {
    directUrl = directUrl.split('?')[0];
  }

  console.log('Đang chạy Prisma DB Push với DIRECT_URL tự động tạo...');
  
  try {
    execSync('npx prisma db push', {
      stdio: 'inherit',
      env: {
        ...process.env,
        DIRECT_URL: directUrl
      }
    });
    console.log('Prisma DB Push thành công!');
  } catch (error) {
    console.error('Lỗi khi chạy prisma db push:', error.message);
    process.exit(1);
  }
}

pushDb();
