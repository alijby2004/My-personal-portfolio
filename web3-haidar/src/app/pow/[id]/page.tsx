import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { getPowEntryById } from "@/lib/pow";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const entry = await getPowEntryById(params.id);
  if (!entry) return { title: "Not Found" };
  return {
    title: entry.projectName,
    description: entry.description,
  };
}

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Ongoing",
  COMPLETED: "Completed",
  WON: "Won 🏆",
  ARCHIVED: "Archived",
};

export default async function PowDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const entry = await getPowEntryById(params.id);

  if (!entry || entry.hidden) {
    notFound();
  }

  const winnerAnnouncements = entry.images.filter(
    (img) => img.kind === "WINNER_ANNOUNCEMENT"
  );
  const screenshots = entry.images.filter((img) => img.kind === "SCREENSHOT");
  const proofImages = entry.images.filter((img) => img.kind === "PROOF");

  return (
    <PageShell>
      <Link
        href="/pow"
        className="text-lemon-green text-sm font-display font-semibold hover:underline"
      >
        ← Back to POW
      </Link>

      <div className="flex items-start gap-4 mt-5 mb-2">
        {entry.logoUrl && (
          <Image
            src={entry.logoUrl}
            alt={`${entry.projectName} logo`}
            width={56}
            height={56}
            className="rounded-xl object-cover shrink-0"
          />
        )}
        <div>
          <div className="text-[0.75rem] font-display font-semibold uppercase tracking-wider text-lemon-green mb-1">
            {entry.category} · {entry.role}
          </div>
          <h1 className="mt-0">{entry.projectName}</h1>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-[0.85rem] font-display mb-6">
        <span className="badge">{STATUS_LABEL[entry.status] ?? entry.status}</span>
        {entry.eventDate && (
          <span className="badge">
            {new Date(entry.eventDate).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>
        )}
        {entry.projectLink && (
          <a
            href={entry.projectLink}
            target="_blank"
            rel="noopener noreferrer"
            className="badge hover:bg-lemon-green hover:text-black transition-colors"
          >
            Visit Project ↗
          </a>
        )}
      </div>

      {entry.featuredImg && (
        <Image
          src={entry.featuredImg}
          alt={entry.projectName}
          width={860}
          height={420}
          className="rounded-card w-full object-cover mb-6 border border-lemon-green/20"
        />
      )}

      <p>{entry.description}</p>

      {entry.fullDetails && (
        <>
          <hr />
          <h2>Details</h2>
          <p className="whitespace-pre-line">{entry.fullDetails}</p>
        </>
      )}

      {winnerAnnouncements.length > 0 && (
        <>
          <hr />
          <h2>🏆 Winner Announcement</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {winnerAnnouncements.map((img) => (
              <Image
                key={img.id}
                src={img.url}
                alt={img.caption ?? "Winner announcement"}
                width={400}
                height={300}
                className="rounded-xl border border-lemon-green/20 object-cover"
              />
            ))}
          </div>
        </>
      )}

      {screenshots.length > 0 && (
        <>
          <hr />
          <h2>Screenshots</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {screenshots.map((img) => (
              <Image
                key={img.id}
                src={img.url}
                alt={img.caption ?? "Screenshot"}
                width={400}
                height={300}
                className="rounded-xl border border-lemon-green/20 object-cover"
              />
            ))}
          </div>
        </>
      )}

      {proofImages.length > 0 && (
        <>
          <hr />
          <h2>Proof</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {proofImages.map((img) => (
              <Image
                key={img.id}
                src={img.url}
                alt={img.caption ?? "Proof"}
                width={400}
                height={300}
                className="rounded-xl border border-lemon-green/20 object-cover"
              />
            ))}
          </div>
        </>
      )}

      {entry.proofFiles.length > 0 && (
        <>
          <hr />
          <h2>Files</h2>
          <div className="space-y-2.5">
            {entry.proofFiles.map((file) => (
              <a
                key={file.id}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card flex items-center justify-between px-5 py-3.5"
              >
                <span className="text-sm font-medium">📄 {file.fileName}</span>
                <span className="text-lemon-green text-sm font-display font-semibold">
                  Open ↗
                </span>
              </a>
            ))}
          </div>
        </>
      )}

      <hr />

      <div className="text-center py-2.5">
        <div className="cta-row">
          <Link href="/pow" className="btn-outline">
            Back to POW
          </Link>
          <Link href="/contact" className="btn-primary">
            Contact Me
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
