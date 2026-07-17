import Image from "next/image";
import Link from "next/link";
import type { PowEntry, PowImage, ProofFile } from "@prisma/client";
import { clsx } from "@/lib/clsx";

type PowCardData = PowEntry & {
  images: PowImage[];
  proofFiles: ProofFile[];
};

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Ongoing",
  COMPLETED: "Completed",
  WON: "Won 🏆",
  ARCHIVED: "Archived",
};

export function PowCard({ entry }: { entry: PowCardData }) {
  const hasProof = entry.proofFiles.length > 0 || entry.images.length > 0;

  return (
    <Link
      href={`/pow/${entry.id}`}
      className="glass-card p-5.5 p-[22px] block hover:-translate-y-1 transform duration-200"
    >
      {entry.logoUrl && (
        <Image
          src={entry.logoUrl}
          alt={`${entry.projectName} logo`}
          width={40}
          height={40}
          className="rounded-lg mb-3 object-cover"
        />
      )}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="text-[0.72rem] font-display font-semibold uppercase tracking-wider text-lemon-green">
          {entry.category}
        </div>
        {entry.pinned && (
          <span className="text-[0.65rem] font-display uppercase tracking-wide text-lemon-green border border-lemon-green/40 rounded-full px-2 py-0.5">
            Pinned
          </span>
        )}
      </div>
      <h3>{entry.projectName}</h3>
      <p className="text-[0.88rem] text-[#bbb] mb-3.5 line-clamp-3">
        {entry.description}
      </p>
      <div className="flex items-center justify-between text-[0.82rem] font-display font-semibold">
        <span
          className={clsx(
            "text-lemon-green",
            entry.status === "ARCHIVED" && "text-muted"
          )}
        >
          {STATUS_LABEL[entry.status] ?? entry.status}
        </span>
        {hasProof && <span className="text-muted">View proof →</span>}
      </div>
    </Link>
  );
}
