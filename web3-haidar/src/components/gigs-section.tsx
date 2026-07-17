"use client";

import { useState } from "react";
import type { PowEntry, PowImage, ProofFile } from "@prisma/client";
import { PowCard } from "@/components/pow-card";

type PowCardData = PowEntry & { images: PowImage[]; proofFiles: ProofFile[] };

export function GigsSection({
  recentGigs,
  allGigsCount,
  fetchAllGigs,
}: {
  recentGigs: PowCardData[];
  allGigsCount: number;
  fetchAllGigs: () => Promise<PowCardData[]>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [allGigs, setAllGigs] = useState<PowCardData[] | null>(null);
  const [loading, setLoading] = useState(false);

  const hasMore = allGigsCount > recentGigs.length;
  const visibleGigs = expanded && allGigs ? allGigs : recentGigs;

  async function handleExploreMore() {
    if (!allGigs) {
      setLoading(true);
      try {
        const data = await fetchAllGigs();
        setAllGigs(data);
      } finally {
        setLoading(false);
      }
    }
    setExpanded(true);
  }

  if (recentGigs.length === 0) {
    return (
      <p className="text-muted text-center py-8">
        No gigs added yet — check back soon.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5">
        {visibleGigs.map((entry) => (
          <PowCard key={entry.id} entry={entry} />
        ))}
      </div>
      {!expanded && hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={handleExploreMore}
            disabled={loading}
            className="btn-outline disabled:opacity-50"
          >
            {loading ? "Loading…" : "Explore More"}
          </button>
        </div>
      )}
    </>
  );
}
