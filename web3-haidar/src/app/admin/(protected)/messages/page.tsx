import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { clsx } from "@/lib/clsx";
import type { Prisma } from "@prisma/client";

const SERVICE_LABEL: Record<string, string> = {
  COMMUNITY_MANAGEMENT: "Community Management",
  MODERATOR: "Moderator",
  AMBASSADOR: "Ambassador",
  CONTENT_CREATION: "Content Creation",
  GRAPHIC_DESIGN: "Graphic Design",
  SOCIAL_MEDIA_MANAGEMENT: "Social Media Management",
  PARTNERSHIP: "Partnership",
  OTHER: "Other",
};

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: { q?: string; filter?: string };
}) {
  const q = searchParams.q?.trim() ?? "";
  const filter = searchParams.filter ?? "all";

  const where: Prisma.ContactMessageWhereInput = {
    ...(filter === "unread" ? { read: false } : {}),
    ...(filter === "read" ? { read: true } : {}),
    ...(q
      ? {
          OR: [
            { fullName: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { projectName: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const messages = await prisma.contactMessage.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const filterTabs = [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
    { key: "read", label: "Read" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-1">Messages</h1>
      <p className="text-muted mb-6">
        Every contact form submission lands here, in addition to being
        emailed to you directly.
      </p>

      <form className="flex flex-col sm:flex-row gap-3 mb-5" method="get">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by name, email, project…"
          className="flex-1 bg-black/40 border border-lemon-green/25 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#777] focus:outline-none focus:border-lemon-green"
        />
        <input type="hidden" name="filter" value={filter} />
        <button type="submit" className="btn-outline shrink-0">
          Search
        </button>
      </form>

      <div className="flex gap-2 mb-5">
        {filterTabs.map((tab) => (
          <Link
            key={tab.key}
            href={`/admin/messages?filter=${tab.key}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            className={clsx(
              "text-xs font-display font-medium px-3.5 py-1.5 rounded-full border transition-colors",
              filter === tab.key
                ? "bg-lemon-green text-black border-lemon-green"
                : "border-lemon-green/25 hover:border-lemon-green"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {messages.length === 0 ? (
        <p className="text-muted">No messages match your search.</p>
      ) : (
        <div className="space-y-2.5">
          {messages.map((msg) => (
            <Link
              key={msg.id}
              href={`/admin/messages/${msg.id}`}
              className="glass-card flex items-center justify-between px-5 py-4 block"
            >
              <div className="min-w-0">
                <div className="font-medium text-sm flex items-center gap-2">
                  {!msg.read && (
                    <span className="w-2 h-2 rounded-full bg-lemon-green inline-block shrink-0" />
                  )}
                  <span className="truncate">{msg.fullName}</span>
                  <span className="text-muted font-normal shrink-0">
                    — {SERVICE_LABEL[msg.serviceType] ?? msg.serviceType}
                  </span>
                </div>
                <div className="text-xs text-muted mt-0.5 truncate">
                  {msg.projectName} · {msg.email}
                </div>
              </div>
              <div className="text-xs text-muted shrink-0 ml-3">
                {msg.createdAt.toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
