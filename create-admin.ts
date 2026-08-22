import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@wedding.com";
  const password = "admin";
  const passwordHash = await hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: "SUPERADMIN",
    },
    create: {
      email,
      name: "Super Admin",
      passwordHash,
      role: "SUPERADMIN",
    },
  });

  console.log("Superadmin created! Email: admin@wedding.com | Password: admin");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
