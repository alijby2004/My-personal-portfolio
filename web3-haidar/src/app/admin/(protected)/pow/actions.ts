"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
import { powEntrySchema } from "@/lib/validation/pow";
import {
  uploadImage,
  uploadDocument,
  deleteAsset,
  UploadValidationError,
} from "@/lib/cloudinary";
import type { PowImageKind } from "@prisma/client";

export type PowFormState = { error: string | null; fieldErrors?: Record<string, string> };

// Every mutation below starts with requireAdmin(). Server actions are
// callable as their own network endpoint regardless of which page renders
// the trigger button, so relying on "the page is behind the layout guard"
// is not sufficient — each action must independently verify the session.

function extractFieldsFromFormData(formData: FormData) {
  return {
    section: formData.get("section"),
    category: formData.get("category"),
    role: formData.get("role"),
    projectName: formData.get("projectName"),
    description: formData.get("description"),
    fullDetails: formData.get("fullDetails"),
    projectLink: formData.get("projectLink"),
    status: formData.get("status"),
    eventDate: formData.get("eventDate"),
    featured: formData.get("featured") === "on",
    pinned: formData.get("pinned") === "on",
    hidden: formData.get("hidden") === "on",
  };
}

async function uploadTaggedImages(
  formData: FormData,
  fieldName: string,
  kind: PowImageKind,
  powEntryId: string,
  folder: string
) {
  const files = formData.getAll(fieldName).filter(
    (f): f is File => f instanceof File && f.size > 0
  );
  let sortOrder = 0;
  for (const file of files) {
    const uploaded = await uploadImage(file, folder);
    await prisma.powImage.create({
      data: {
        powEntryId,
        url: uploaded.url,
        publicId: uploaded.publicId,
        kind,
        sortOrder: sortOrder++,
      },
    });
  }
}

async function uploadProofDocs(
  formData: FormData,
  powEntryId: string,
  folder: string
) {
  const files = formData
    .getAll("proofDocs")
    .filter((f): f is File => f instanceof File && f.size > 0);
  for (const file of files) {
    const uploaded = await uploadDocument(file, folder);
    await prisma.proofFile.create({
      data: {
        powEntryId,
        url: uploaded.url,
        publicId: uploaded.publicId,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      },
    });
  }
}

export async function createPowEntry(
  _prevState: PowFormState,
  formData: FormData
): Promise<PowFormState> {
  await requireAdmin();

  const parsed = powEntrySchema.safeParse(extractFieldsFromFormData(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { error: "Please fix the errors below.", fieldErrors };
  }

  const data = parsed.data;

  try {
    // Place new entries at the end of their section by default.
    const maxSort = await prisma.powEntry.aggregate({
      where: { section: data.section },
      _max: { sortOrder: true },
    });

    const entry = await prisma.powEntry.create({
      data: {
        section: data.section,
        category: data.category,
        role: data.role,
        projectName: data.projectName,
        description: data.description,
        fullDetails: data.fullDetails,
        projectLink: data.projectLink,
        status: data.status,
        eventDate: data.eventDate ? new Date(data.eventDate) : undefined,
        featured: data.featured,
        pinned: data.pinned,
        hidden: data.hidden,
        sortOrder: (maxSort._max.sortOrder ?? 0) + 1,
      },
    });

    const folder = `web3-haidar/pow/${entry.id}`;

    const logoFile = formData.get("logoFile");
    if (logoFile instanceof File && logoFile.size > 0) {
      const uploaded = await uploadImage(logoFile, folder);
      await prisma.powEntry.update({
        where: { id: entry.id },
        data: { logoUrl: uploaded.url },
      });
    }

    const featuredFile = formData.get("featuredImageFile");
    if (featuredFile instanceof File && featuredFile.size > 0) {
      const uploaded = await uploadImage(featuredFile, folder);
      await prisma.powEntry.update({
        where: { id: entry.id },
        data: { featuredImg: uploaded.url },
      });
    }

    await uploadTaggedImages(formData, "screenshotFiles", "SCREENSHOT", entry.id, folder);
    await uploadTaggedImages(formData, "proofImageFiles", "PROOF", entry.id, folder);
    await uploadTaggedImages(formData, "winnerImageFiles", "WINNER_ANNOUNCEMENT", entry.id, folder);
    await uploadProofDocs(formData, entry.id, folder);
  } catch (err) {
    if (err instanceof UploadValidationError) {
      return { error: err.message };
    }
    console.error("createPowEntry failed:", err);
    return { error: "Something went wrong while saving. Please try again." };
  }

  revalidatePath("/admin/pow");
  revalidatePath("/pow");
  redirect("/admin/pow");
}

export async function updatePowEntry(
  id: string,
  _prevState: PowFormState,
  formData: FormData
): Promise<PowFormState> {
  await requireAdmin();

  const parsed = powEntrySchema.safeParse(extractFieldsFromFormData(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { error: "Please fix the errors below.", fieldErrors };
  }

  const data = parsed.data;
  const folder = `web3-haidar/pow/${id}`;

  try {
    await prisma.powEntry.update({
      where: { id },
      data: {
        section: data.section,
        category: data.category,
        role: data.role,
        projectName: data.projectName,
        description: data.description,
        fullDetails: data.fullDetails,
        projectLink: data.projectLink,
        status: data.status,
        eventDate: data.eventDate ? new Date(data.eventDate) : null,
        featured: data.featured,
        pinned: data.pinned,
        hidden: data.hidden,
      },
    });

    const logoFile = formData.get("logoFile");
    if (logoFile instanceof File && logoFile.size > 0) {
      const uploaded = await uploadImage(logoFile, folder);
      await prisma.powEntry.update({
        where: { id },
        data: { logoUrl: uploaded.url },
      });
    }

    const featuredFile = formData.get("featuredImageFile");
    if (featuredFile instanceof File && featuredFile.size > 0) {
      const uploaded = await uploadImage(featuredFile, folder);
      await prisma.powEntry.update({
        where: { id },
        data: { featuredImg: uploaded.url },
      });
    }

    await uploadTaggedImages(formData, "screenshotFiles", "SCREENSHOT", id, folder);
    await uploadTaggedImages(formData, "proofImageFiles", "PROOF", id, folder);
    await uploadTaggedImages(formData, "winnerImageFiles", "WINNER_ANNOUNCEMENT", id, folder);
    await uploadProofDocs(formData, id, folder);
  } catch (err) {
    if (err instanceof UploadValidationError) {
      return { error: err.message };
    }
    console.error("updatePowEntry failed:", err);
    return { error: "Something went wrong while saving. Please try again." };
  }

  revalidatePath("/admin/pow");
  revalidatePath(`/admin/pow/${id}/edit`);
  revalidatePath("/pow");
  revalidatePath(`/pow/${id}`);
  redirect("/admin/pow");
}

export async function deletePowEntry(id: string) {
  await requireAdmin();

  const entry = await prisma.powEntry.findUnique({
    where: { id },
    include: { images: true, proofFiles: true },
  });
  if (!entry) return;

  // Best-effort cleanup of remote assets before removing the DB rows.
  await Promise.all([
    ...entry.images
      .filter((img) => img.publicId)
      .map((img) => deleteAsset(img.publicId as string, "image")),
    ...entry.proofFiles
      .filter((f) => f.publicId)
      .map((f) => deleteAsset(f.publicId as string, "raw")),
  ]);

  await prisma.powEntry.delete({ where: { id } }); // cascades images/proofFiles

  revalidatePath("/admin/pow");
  revalidatePath("/pow");
}

export async function toggleEntryFlag(
  id: string,
  flag: "featured" | "pinned" | "hidden"
) {
  await requireAdmin();
  const entry = await prisma.powEntry.findUnique({ where: { id } });
  if (!entry) return;

  // Written as an explicit switch rather than a dynamic `{ [flag]: value }`
  // object so the shape passed to Prisma's update() is always a concrete,
  // statically-known type instead of relying on TypeScript's inference of
  // a computed property key against the generated PowEntryUpdateInput type.
  switch (flag) {
    case "featured":
      await prisma.powEntry.update({
        where: { id },
        data: { featured: !entry.featured },
      });
      break;
    case "pinned":
      await prisma.powEntry.update({
        where: { id },
        data: { pinned: !entry.pinned },
      });
      break;
    case "hidden":
      await prisma.powEntry.update({
        where: { id },
        data: { hidden: !entry.hidden },
      });
      break;
  }

  revalidatePath("/admin/pow");
  revalidatePath("/pow");
}

export async function moveEntry(id: string, direction: "up" | "down") {
  await requireAdmin();

  const entry = await prisma.powEntry.findUnique({ where: { id } });
  if (!entry) return;

  const neighbor = await prisma.powEntry.findFirst({
    where: {
      section: entry.section,
      sortOrder:
        direction === "up" ? { lt: entry.sortOrder } : { gt: entry.sortOrder },
    },
    orderBy: { sortOrder: direction === "up" ? "desc" : "asc" },
  });

  if (!neighbor) return; // already at the edge

  await prisma.$transaction([
    prisma.powEntry.update({
      where: { id: entry.id },
      data: { sortOrder: neighbor.sortOrder },
    }),
    prisma.powEntry.update({
      where: { id: neighbor.id },
      data: { sortOrder: entry.sortOrder },
    }),
  ]);

  revalidatePath("/admin/pow");
  revalidatePath("/pow");
}

export async function deletePowImage(imageId: string) {
  await requireAdmin();
  const image = await prisma.powImage.findUnique({ where: { id: imageId } });
  if (!image) return;

  if (image.publicId) {
    await deleteAsset(image.publicId, "image");
  }
  await prisma.powImage.delete({ where: { id: imageId } });

  revalidatePath(`/admin/pow/${image.powEntryId}/edit`);
  revalidatePath(`/pow/${image.powEntryId}`);
}

export async function deleteProofFile(fileId: string) {
  await requireAdmin();
  const file = await prisma.proofFile.findUnique({ where: { id: fileId } });
  if (!file) return;

  if (file.publicId) {
    await deleteAsset(file.publicId, "raw");
  }
  await prisma.proofFile.delete({ where: { id: fileId } });

  revalidatePath(`/admin/pow/${file.powEntryId}/edit`);
  revalidatePath(`/pow/${file.powEntryId}`);
}
