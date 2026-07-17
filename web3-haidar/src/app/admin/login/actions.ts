"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { checkLoginRateLimit, resetLoginRateLimit } from "@/lib/auth/rate-limit";
import { syncAdminUser } from "@/lib/sync-admin"; // Wannan shi ne sabon aikin

export type LoginState = { error: string | null };

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const ip = headers().get("x-forwarded-for") ?? "unknown";
  const rateLimitKey = `ip:${ip}:email:${email}`;
  const allowed = await checkLoginRateLimit(rateLimitKey);

  if (!allowed) {
    return { error: "Too many attempts. Please try again later." };
  }

  const genericError = "Invalid email or password.";

  try {
    // Wannan shi ne aikin da zai sa login ɗinka ya yi aiki
    await syncAdminUser(); 
    
    const user = await prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      return { error: genericError };
    }

    const validPassword = await verifyPassword(password, user.passwordHash);
    if (!validPassword) {
      return { error: genericError };
    }

    resetLoginRateLimit(rateLimitKey);

    await createSession(user.id, {
      userAgent: headers().get("user-agent") ?? undefined,
      ipAddress: ip,
    });
  } catch (err) {
    console.error("Login failed:", err);
    return { error: "Something went wrong. Please try again." };
  }

  redirect("/admin");
}
