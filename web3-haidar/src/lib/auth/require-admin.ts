import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";

// The single source of truth for "is this request actually authenticated".
// Both the admin layout (for page rendering) and every admin server action
// (for mutations) call this, so there is exactly one place that decides
// what a valid session looks like.
export async function requireAdmin() {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}
