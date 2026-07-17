import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export async function syncAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) return;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: email },
  });

  if (existingAdmin) {
    await prisma.user.update({
      where: { email: email },
      data: { passwordHash: hashedPassword },
    });
  } else {
    await prisma.user.create({
      data: {
        email: email,
        passwordHash: hashedPassword,
        name: process.env.ADMIN_NAME || "Admin",
      },
    });
  }
}

