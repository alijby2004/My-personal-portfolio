import { createRateLimiter } from "@/lib/rate-limit";

// 5 attempts per 15 minutes per (IP + email) pair — enough headroom for a
// legitimate admin who fat-fingers their password a couple of times,
// tight enough to make brute-forcing impractical.
const loginLimiter = createRateLimiter(15 * 60 * 1000, 5);

export function checkLoginRateLimit(identifier: string) {
  return loginLimiter.check(identifier);
}

export function resetLoginRateLimit(identifier: string) {
  loginLimiter.reset(identifier);
}
