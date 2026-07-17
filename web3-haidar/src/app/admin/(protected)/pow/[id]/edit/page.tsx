import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { PowForm } from "@/components/admin/pow-form";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { updatePowEntry, deletePowImage, deleteProofFile } from "../../actions";

const KIND_LABEL: Record<string, string> = {
  SCREENSHOT: "Screenshot",
  PROOF: "Proof",
  WINNER_ANNOUNCEMENT: "Winner Announcement",
};

export default async function EditPowEntryPage({
  params,
}: {
  params: { id: string };
}) {
  const entry = await prisma.powEntry.findUnique({
    where: { id: params.id },
    include: { images: true, proofFiles: true },
  });

  if (!entry) notFound();

  const updateWithId = updatePowEntry.bind(null, entry.id);

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-1">Edit POW Entry</h1>
      <p className="text-muted mb-6">{entry.projectName}</p>

      <PowForm action={updateWithId} entry={entry} submitLabel="Save Changes" />

      {(entry.images.length > 0 || entry.proofFiles.length > 0) && (
        <div className="glass-card p-6 mt-6">
          <h3 className="mt-0">Existing Media</h3>

          {entry.images.length > 0 && (
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              {entry.images.map((img) => (
                <div key={img.id} className="relative">
                  <Image
                    src={img.url}
                    alt={img.caption ?? "POW media"}
                    width={200}
                    height={140}
                    className="rounded-lg object-cover w-full h-[110px] border border-lemon-green/20"
                  />
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[0.7rem] text-muted uppercase tracking-wide">
                      {KIND_LABEL[img.kind] ?? img.kind}
                    </span>
                    <form action={deletePowImage.bind(null, img.id)}>
                      <ConfirmSubmitButton
                        confirmMessage="Delete this image? This cannot be undone."
                        className="text-[0.7rem] text-red-400 hover:underline"
                      >
                        Delete
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}

          {entry.proofFiles.length > 0 && (
            <div className="space-y-2">
              {entry.proofFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between bg-black/30 rounded-lg px-4 py-2.5"
                >
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline"
                  >
                    📄 {file.fileName}
                  </a>
                  <form action={deleteProofFile.bind(null, file.id)}>
                    <ConfirmSubmitButton
                      confirmMessage="Delete this file? This cannot be undone."
                      className="text-[0.7rem] text-red-400 hover:underline"
                    >
                      Delete
                    </ConfirmSubmitButton>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
