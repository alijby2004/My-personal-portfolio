import { prisma } from "@/lib/prisma";
import type { PowSection } from "@prisma/client";

// Centralizing these queries here (rather than calling prisma directly in
// page components) means the "ongoing jobs stay visible forever, gigs show
// latest 5 + explore more" business logic lives in exactly one place and is
// reused identically by the public POW page and the admin dashboard.

const PUBLIC_INCLUDE = {
  images: { orderBy: { sortOrder: "asc" as const } },
  proofFiles: true,
};

export async function getOngoingJobs() {
  return prisma.powEntry.findMany({
    where: { section: "ONGOING_JOB" as PowSection, hidden: false },
    orderBy: [{ pinned: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    include: PUBLIC_INCLUDE,
  });
}

export async function getRecentGigs(limit = 5) {
  return prisma.powEntry.findMany({
    where: { section: "OTHER_GIG" as PowSection, hidden: false },
    orderBy: [{ pinned: "desc" }, { eventDate: "desc" }, { createdAt: "desc" }],
    take: limit,
    include: PUBLIC_INCLUDE,
  });
}

export async function getAllGigs() {
  return prisma.powEntry.findMany({
    where: { section: "OTHER_GIG" as PowSection, hidden: false },
    orderBy: [{ pinned: "desc" }, { eventDate: "desc" }, { createdAt: "desc" }],
    include: PUBLIC_INCLUDE,
  });
}

export async function getPowEntryById(id: string) {
  return prisma.powEntry.findUnique({
    where: { id },
    include: PUBLIC_INCLUDE,
  });
}

export async function getPowStats() {
  const [activeJobs, completedGigs, totalProjects] = await Promise.all([
    prisma.powEntry.count({
      where: { section: "ONGOING_JOB", hidden: false, status: "ACTIVE" },
    }),
    prisma.powEntry.count({
      where: { section: "OTHER_GIG", hidden: false },
    }),
    prisma.powEntry.count(),
  ]);
  return { activeJobs, completedGigs, totalProjects };
}
