import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";

const prisma = new PrismaClient();

// Reads the initial admin's credentials from environment variables rather
// than hardcoding them in source — so nothing sensitive ever lands in git
// history. Run with: npm run db:seed
// Requires ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME set in the shell or
// a local .env that dotenv/tsx picks up.
async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? "Haidar";

  if (!email || !password) {
    throw new Error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD environment variables before seeding.\n" +
        "Example: ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=xxxxxxxx npm run db:seed"
    );
  }

  if (password.length < 12) {
    throw new Error("ADMIN_PASSWORD should be at least 12 characters long.");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user ${email} already exists — skipping.`);
    return;
  }

  const passwordHash = await hashPassword(password);

  await prisma.user.create({
    data: { email, passwordHash, name },
  });

  console.log(`✅ Admin user created: ${email}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
