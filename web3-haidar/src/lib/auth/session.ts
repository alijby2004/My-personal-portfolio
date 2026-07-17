import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// ─────────────────────────────────────────────────────────────────────────
// Session design:
// - Sessions are opaque random tokens stored in the DB (not JWTs). This
//   trades a small DB read per request for the ability to revoke a
//   session instantly (e.g. "log out everywhere") — important for a
//   security-conscious admin panel, and the read is cheap since Session
//   is indexed on id.
// - The cookie itself only holds the token; it is HttpOnly, Secure (in
//   prod), SameSite=Lax, so it can't be read or sent cross-site by JS.
// - Sessions expire after 7 days of being issued; there is no silent
//   sliding renewal, so a stolen cookie doesn't stay valid forever.
// - The cookie value is additionally HMAC-signed using SESSION_SECRET.
//   This was previously configured as an env var but never actually read
//   anywhere in the code. It's not strictly required for security (the
//   underlying token is already a random 256-bit value, not guessable),
//   but signing it means a malformed or tampered cookie is rejected
//   before it ever reaches the database — one less request hitting
//   Postgres for free, and it makes SESSION_SECRET's presence meaningful
//   rather than a dead config value.
// ─────────────────────────────────────────────────────────────────────────

const SESSION_COOKIE = "session_token";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    // Thrown lazily inside functions (not at module load time) so this
    // file can still be imported during `next build` static analysis
    // without a runtime secret present. It only actually matters once a
    // request tries to create or read a session.
    throw new Error(
      "SESSION_SECRET is missing or too short. Set it to a random 32+ byte " +
        "string (e.g. `openssl rand -base64 32`) in your environment."
    );
  }
  return secret;
}

function sign(token: string): string {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(token)
    .digest("hex");
}

function buildCookieValue(token: string): string {
  return `${token}.${sign(token)}`;
}

// Returns the raw token if the cookie's signature is valid, null otherwise.
// Verifying the signature here means a tampered or foreign cookie value is
// rejected without ever touching the database.
function verifyCookieValue(cookieValue: string): string | null {
  const separatorIndex = cookieValue.lastIndexOf(".");
  if (separatorIndex === -1) return null;

  const token = cookieValue.slice(0, separatorIndex);
  const signature = cookieValue.slice(separatorIndex + 1);
  const expected = sign(token);

  const sigBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  if (sigBuffer.length !== expectedBuffer.length) return null;
  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return null;

  return token;
}

export function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function createSession(
  userId: string,
  meta?: { userAgent?: string; ipAddress?: string }
) {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.session.create({
    data: {
      id: token,
      userId,
      expiresAt,
      userAgent: meta?.userAgent,
      ipAddress: meta?.ipAddress,
    },
  });

  cookies().set(SESSION_COOKIE, buildCookieValue(token), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return token;
}

export async function getCurrentSession() {
  const cookieValue = cookies().get(SESSION_COOKIE)?.value;
  if (!cookieValue) return null;

  const token = verifyCookieValue(cookieValue);
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { id: token },
    include: { user: true },
  });

  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: token } }).catch(() => {});
    return null;
  }

  return session;
}

export async function destroySession() {
  const cookieValue = cookies().get(SESSION_COOKIE)?.value;
  if (cookieValue) {
    const token = verifyCookieValue(cookieValue);
    if (token) {
      await prisma.session.delete({ where: { id: token } }).catch(() => {});
    }
  }
  cookies().delete(SESSION_COOKIE);
}

export async function destroyAllSessionsForUser(userId: string) {
  await prisma.session.deleteMany({ where: { userId } });
}
