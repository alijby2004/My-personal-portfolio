"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
import { verifyPassword, hashPassword } from "@/lib/auth/password";
import { destroyAllSessionsForUser, createSession } from "@/lib/auth/session";

export type SettingsFormState = { error: string | null; success?: boolean };

const linksSchema = z.object({
  twitterUrl: z.string().trim().url("Enter a valid URL"),
  twitterHandle: z.string().trim().min(1).max(60),
  telegramUrl: z.string().trim().url("Enter a valid URL"),
  telegramHandle: z.string().trim().min(1).max(60),
  contactEmail: z.string().trim().email("Enter a valid email"),
});

export async function updateSiteLinks(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  await requireAdmin();

  const parsed = linksSchema.safeParse({
    twitterUrl: formData.get("twitterUrl"),
    twitterHandle: formData.get("twitterHandle"),
    telegramUrl: formData.get("telegramUrl"),
    telegramHandle: formData.get("telegramHandle"),
    contactEmail: formData.get("contactEmail"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const entries = Object.entries(parsed.data);
  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      })
    )
  );

  revalidatePath("/admin/settings");
  revalidatePath("/contact");
  revalidatePath("/", "layout");

  return { error: null, success: true };
}

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z.string().min(12, "New password must be at least 12 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

export async function changeAdminPassword(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await requireAdmin();

  const parsed = passwordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const validCurrent = await verifyPassword(
    parsed.data.currentPassword,
    session.user.passwordHash
  );
  if (!validCurrent) {
    return { error: "Current password is incorrect." };
  }

  const newHash = await hashPassword(parsed.data.newPassword);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { passwordHash: newHash },
  });

  // Invalidate every existing session (including this one) then issue a
  // fresh session for the current browser, so a password change actually
  // logs out any other device that might have a stolen cookie.
  await destroyAllSessionsForUser(session.user.id);
  await createSession(session.user.id);

  return { error: null, success: true };
}
