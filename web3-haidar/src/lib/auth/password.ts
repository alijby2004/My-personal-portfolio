import bcrypt from "bcryptjs";

// Cost factor 12 is a deliberate choice: high enough to be slow for
// brute-force attempts (~250ms per hash on typical server hardware),
// low enough not to noticeably slow down a legitimate admin login.
const SALT_ROUNDS = 12;

export async function hashPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, SALT_ROUNDS);
}

export async function verifyPassword(
  plainText: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}
