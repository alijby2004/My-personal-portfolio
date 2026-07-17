import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { clsx } from "@/lib/clsx";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import {
  deletePowEntry,
  toggleEntryFlag,
  moveEntry,
} from "./actions";

async function getGroupedEntries() {
  const entries = await prisma.powEntry.findMany({
    orderBy: [{ section: "asc" }, { sortOrder: "asc" }],
  });
  return {
    ongoing: entries.filter((e) => e.section === "ONGOING_JOB"),
    gigs: entries.filter((e) => e.section === "OTHER_GIG"),
  };
}

function EntryRow({ entry, isFirst, isLast }: { entry: Awaited<ReturnType<typeof getGroupedEntries>>["ongoing"][number]; isFirst: boolean; isLast: boolean }) {
  return (
    <div className="glass-card px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {entry.logoUrl ? (
          <Image
            src={entry.logoUrl}
            alt=""
            width={40}
            height={40}
            className="rounded-lg object-cover shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-black/40 shrink-0" />
        )}
        <div className="min-w-0">
          <div className="font-medium text-sm truncate flex items-center gap-2">
            {entry.projectName}
            {entry.hidden && (
              <span className="text-[0.65rem] uppercase tracking-wide text-muted border border-muted/40 rounded-full px-2 py-0.5">
                Hidden
              </span>
            )}
            {entry.pinned && (
              <span className="text-[0.65rem] uppercase tracking-wide text-lemon-green border border-lemon-green/40 rounded-full px-2 py-0.5">
                Pinned
              </span>
            )}
            {entry.featured && (
              <span className="text-[0.65rem] uppercase tracking-wide text-lemon-green border border-lemon-green/40 rounded-full px-2 py-0.5">
                Featured
              </span>
            )}
          </div>
          <div className="text-xs text-muted truncate">
            {entry.category} · {entry.role}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
        <form action={moveEntry.bind(null, entry.id, "up")}>
          <button
            type="submit"
            disabled={isFirst}
            className="text-xs px-2 py-1.5 rounded-lg border border-lemon-green/20 hover:border-lemon-green disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move up"
          >
            ↑
          </button>
        </form>
        <form action={moveEntry.bind(null, entry.id, "down")}>
          <button
            type="submit"
            disabled={isLast}
            className="text-xs px-2 py-1.5 rounded-lg border border-lemon-green/20 hover:border-lemon-green disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move down"
          >
            ↓
          </button>
        </form>
        <form action={toggleEntryFlag.bind(null, entry.id, "pinned")}>
          <button
            type="submit"
            className={clsx(
              "text-xs px-2.5 py-1.5 rounded-lg border transition-colors",
              entry.pinned
                ? "bg-lemon-green text-black border-lemon-green"
                : "border-lemon-green/20 hover:border-lemon-green"
            )}
          >
            📌 Pin
          </button>
        </form>
        <form action={toggleEntryFlag.bind(null, entry.id, "featured")}>
          <button
            type="submit"
            className={clsx(
              "text-xs px-2.5 py-1.5 rounded-lg border transition-colors",
              entry.featured
                ? "bg-lemon-green text-black border-lemon-green"
                : "border-lemon-green/20 hover:border-lemon-green"
            )}
          >
            ⭐ Feature
          </button>
        </form>
        <form action={toggleEntryFlag.bind(null, entry.id, "hidden")}>
          <button
            type="submit"
            className={clsx(
              "text-xs px-2.5 py-1.5 rounded-lg border transition-colors",
              entry.hidden
                ? "bg-muted/40 text-white border-muted"
                : "border-lemon-green/20 hover:border-lemon-green"
            )}
          >
            {entry.hidden ? "🙈 Hidden" : "👁️ Hide"}
          </button>
        </form>
        <Link
          href={`/admin/pow/${entry.id}/edit`}
          className="text-xs px-2.5 py-1.5 rounded-lg border border-lemon-green/20 hover:border-lemon-green"
        >
          ✏️ Edit
        </Link>
        <form action={deletePowEntry.bind(null, entry.id)}>
          <ConfirmSubmitButton
            confirmMessage={`Delete "${entry.projectName}"? This also removes its images and files. This cannot be undone.`}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-red-400/30 text-red-400 hover:border-red-400"
          >
            🗑️ Delete
          </ConfirmSubmitButton>
        </form>
      </div>
    </div>
  );
}

export default async function PowManagementPage() {
  const { ongoing, gigs } = await getGroupedEntries();

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold mb-1">POW Management</h1>
          <p className="text-muted mb-0">
            Everything here is reflected live on your public POW page.
          </p>
        </div>
        <Link href="/admin/pow/new" className="btn-primary">
          + Add New Entry
        </Link>
      </div>

      <h2 className="text-lg font-display font-semibold text-lemon-green">
        Ongoing Roles ({ongoing.length})
      </h2>
      <div className="space-y-2.5 mb-8">
        {ongoing.length === 0 && (
          <p className="text-muted text-sm">No ongoing roles yet.</p>
        )}
        {ongoing.map((entry, i) => (
          <EntryRow
            key={entry.id}
            entry={entry}
            isFirst={i === 0}
            isLast={i === ongoing.length - 1}
          />
        ))}
      </div>

      <h2 className="text-lg font-display font-semibold text-lemon-green">
        Other Gigs ({gigs.length})
      </h2>
      <div className="space-y-2.5">
        {gigs.length === 0 && (
          <p className="text-muted text-sm">No gigs added yet.</p>
        )}
        {gigs.map((entry, i) => (
          <EntryRow
            key={entry.id}
            entry={entry}
            isFirst={i === 0}
            isLast={i === gigs.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
