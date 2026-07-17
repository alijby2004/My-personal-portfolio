import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { PowCard } from "@/components/pow-card";
import { GigsSection } from "@/components/gigs-section";
import { getOngoingJobs, getRecentGigs, getAllGigs } from "@/lib/pow";
import { fetchAllGigsAction } from "./actions";

export const metadata: Metadata = {
  title: "My POW",
  description:
    "Haidar's Proof of Work – community management, content creation, and Web3 contributions.",
};

// Revalidate periodically so admin edits show up without a full redeploy,
// while still benefiting from static caching between edits.
export const revalidate = 60;

export default async function PowPage() {
  const [ongoingJobs, recentGigs, allGigsForCount] = await Promise.all([
    getOngoingJobs(),
    getRecentGigs(5),
    getAllGigs(),
  ]);

  return (
    <PageShell>
      <h1>My Proof of Work</h1>
      <p>
        A collection of real contributions, campaigns, and projects
        I&apos;ve been part of across the Web3 ecosystem. Every item here
        represents hands-on experience.
      </p>

      <hr />

      <h2>🏘️ Ongoing Roles</h2>
      {ongoingJobs.length === 0 ? (
        <p className="text-muted text-center py-8">
          No active roles listed right now — check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5">
          {ongoingJobs.map((entry) => (
            <PowCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}

      <hr />

      <h2>✍️ Other Gigs & Contributions</h2>
      <GigsSection
        recentGigs={recentGigs}
        allGigsCount={allGigsForCount.length}
        fetchAllGigs={fetchAllGigsAction}
      />

      <hr />

      <div className="text-center py-2.5">
        <p className="text-muted mb-5">
          Interested in working together? Let&apos;s talk.
        </p>
        <div className="cta-row">
          <Link href="/contact" className="btn-primary">
            Contact Me
          </Link>
          <Link href="/about" className="btn-outline">
            About Me
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
