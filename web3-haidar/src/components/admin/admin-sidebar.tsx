"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "@/lib/clsx";
import { logoutAction } from "@/app/admin/logout-action";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/pow", label: "POW Management", icon: "🗂️" },
  { href: "/admin/messages", label: "Messages", icon: "✉️" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export function AdminSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-60 shrink-0 md:min-h-screen bg-black/50 backdrop-blur-md border-b md:border-b-0 md:border-r border-lemon-green/20 px-4 py-5 md:py-8">
      <div className="mb-8 px-2">
        <span className="font-display font-bold text-lemon-green text-base tracking-wide">
          Web3 Haidar
        </span>
        <p className="text-muted text-xs mt-0.5 mb-0">Signed in as {userName}</p>
      </div>

      <nav className="flex md:flex-col gap-1.5 flex-wrap">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-lemon-green text-black font-semibold"
                  : "text-white hover:bg-lemon-green/10"
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <form action={logoutAction} className="mt-6 px-1">
        <button
          type="submit"
          className="text-sm text-muted hover:text-lemon-green transition-colors flex items-center gap-2"
        >
          🚪 Logout
        </button>
      </form>
    </aside>
  );
}
