"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import {
  checkLoginRateLimit,
  resetLoginRateLimit,
} from "@/lib/auth/rate-limit";

export type LoginState = { error: string | null };

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const ip = headers().get("x-forwarded-for") ?? "unknown";
  const rateLimitKey = `${ip}:${email}`;
  const { allowed, retryAfterMs } = checkLoginRateLimit(rateLimitKey);

  if (!allowed) {
    const minutes = Math.ceil((retryAfterMs ?? 0) / 60000);
    return {
      error: `Too many attempts. Please try again in ${minutes} minute(s).`,
    };
  }

  // Deliberately generic error message for both "no such user" and "wrong
  // password" — a distinct message for each would let an attacker enumerate
  // valid admin emails.
  const genericError = "Invalid email or password.";

  let user;
  try {
    user = await prisma.user.findUnique({ where: { email } });
  } catch (err) {
    // A database connectivity failure (bad DATABASE_URL, unreachable host,
    // Prisma engine binary mismatch on the deploy platform, etc.) would
    // otherwise throw here unhandled and crash the whole Server Action.
    // Logging it server-side and returning a clean message means a DB
    // outage shows up as a readable error instead of a blank/broken page.
    console.error("Login failed — database error:", err);
    return {
      error: "Something went wrong. Please try again in a moment.",
    };
  }

  if (!user) {
    return { error: genericError };
  }

  const validPassword = await verifyPassword(password, user.passwordHash);
  if (!validPassword) {
    return { error: genericError };
  }

  resetLoginRateLimit(rateLimitKey);

  try {
    await createSession(user.id, {
      userAgent: headers().get("user-agent") ?? undefined,
      ipAddress: ip,
    });
  } catch (err) {
    console.error("Login failed — could not create session:", err);
    return {
      error: "Something went wrong. Please try again in a moment.",
    };
  }

  redirect("/admin");
}
