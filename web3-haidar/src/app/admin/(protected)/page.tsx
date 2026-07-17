import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getDashboardStats() {
  const [
    totalProjects,
    activeJobs,
    completedGigs,
    totalMessages,
    unreadMessages,
    recentMessages,
  ] = await Promise.all([
    prisma.powEntry.count(),
    prisma.powEntry.count({
      where: { section: "ONGOING_JOB", status: "ACTIVE", hidden: false },
    }),
    prisma.powEntry.count({ where: { section: "OTHER_GIG" } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return {
    totalProjects,
    activeJobs,
    completedGigs,
    totalMessages,
    unreadMessages,
    recentMessages,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Total Projects", value: stats.totalProjects, icon: "🗂️" },
    { label: "Active Jobs", value: stats.activeJobs, icon: "💼" },
    { label: "Completed Gigs", value: stats.completedGigs, icon: "✅" },
    { label: "Contact Requests", value: stats.totalMessages, icon: "✉️" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-1">Dashboard</h1>
      <p className="text-muted mb-6">
        Overview of your portfolio activity.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon }) => (
          <div key={label} className="glass-card p-5">
            <div className="text-2xl mb-2">{icon}</div>
            <div className="font-display text-2xl font-bold text-lemon-green leading-none mb-1">
              {value}
            </div>
            <div className="text-xs text-muted uppercase tracking-wide">
              {label}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-display font-semibold text-lemon-green m-0">
          Recent Messages
        </h2>
        <Link
          href="/admin/messages"
          className="text-sm text-lemon-green font-display font-semibold hover:underline"
        >
          View all →
        </Link>
      </div>

      {stats.recentMessages.length === 0 ? (
        <p className="text-muted">No messages yet.</p>
      ) : (
        <div className="space-y-2.5">
          {stats.recentMessages.map((msg) => (
            <Link
              key={msg.id}
              href={`/admin/messages/${msg.id}`}
              className="glass-card flex items-center justify-between px-5 py-3.5 block"
            >
              <div>
                <div className="font-medium text-sm flex items-center gap-2">
                  {!msg.read && (
                    <span className="w-2 h-2 rounded-full bg-lemon-green inline-block" />
                  )}
                  {msg.fullName}{" "}
                  <span className="text-muted font-normal">
                    — {msg.projectName}
                  </span>
                </div>
                <div className="text-xs text-muted mt-0.5">{msg.email}</div>
              </div>
              <div className="text-xs text-muted shrink-0">
                {msg.createdAt.toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/pow/new" className="btn-primary">
          + Add New POW Entry
        </Link>
        <Link href="/admin/pow" className="btn-outline">
          Manage POW
        </Link>
      </div>
    </div>
  );
}
