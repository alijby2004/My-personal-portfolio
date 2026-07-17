import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

// Belt-and-suspenders alongside robots.ts: even if a crawler ignores
// robots.txt, this tells it directly not to index anything under /admin.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This is the real, database-backed auth check (unlike the lightweight
  // cookie-presence check in middleware.ts). Every admin route is a server
  // component rendered under this layout, so nothing under /admin ever
  // renders without a verified, non-expired session.
  const session = await requireAdmin();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-dark-bg">
      <AdminSidebar userName={session.user.name} />
      <main className="flex-1 px-5 py-6 md:px-10 md:py-8 max-w-5xl">
        {children}
      </main>
    </div>
  );
}
