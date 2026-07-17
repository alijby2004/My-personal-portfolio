import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { markMessageRead, deleteMessage } from "../actions";

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

export default async function MessageDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const message = await prisma.contactMessage.findUnique({
    where: { id: params.id },
  });

  if (!message) notFound();

  // Mark as read the moment the admin opens it, if not already.
  if (!message.read) {
    await markMessageRead(message.id, true);
  }

  const fields: [string, string | null | undefined][] = [
    ["Full Name", message.fullName],
    ["Email", message.email],
    ["Telegram", message.telegramHandle],
    ["Project Name", message.projectName],
    ["Project Website", message.projectWebsite],
    ["Type of Service", SERVICE_LABEL[message.serviceType] ?? message.serviceType],
    ["Budget", message.budget],
    ["Deadline", message.deadline],
  ];

  return (
    <div>
      <Link
        href="/admin/messages"
        className="text-sm text-lemon-green font-display font-semibold hover:underline"
      >
        ← Back to Messages
      </Link>

      <div className="flex items-center justify-between mt-4 mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold mb-1">
            {message.fullName}
          </h1>
          <p className="text-muted mb-0">
            Submitted {message.createdAt.toLocaleString()}
            {message.emailSent ? " · Email delivered ✅" : " · Email not sent ⚠️"}
          </p>
        </div>
        <div className="flex gap-2">
          <form action={markMessageRead.bind(null, message.id, !message.read)}>
            <button type="submit" className="btn-outline">
              Mark as {message.read ? "Unread" : "Read"}
            </button>
          </form>
          <form action={deleteMessage.bind(null, message.id)}>
            <ConfirmSubmitButton
              confirmMessage="Delete this message permanently?"
              className="text-sm px-5 py-2.5 rounded-pill border border-red-400/40 text-red-400 hover:border-red-400 font-display font-semibold"
            >
              Delete
            </ConfirmSubmitButton>
          </form>
        </div>
      </div>

      <div className="glass-card p-6 grid sm:grid-cols-2 gap-4 mb-6">
        {fields.map(([label, value]) =>
          value ? (
            <div key={label}>
              <div className="text-[0.72rem] uppercase tracking-wide text-muted mb-0.5">
                {label}
              </div>
              <div className="text-sm">{value}</div>
            </div>
          ) : null
        )}
      </div>

      <div className="glass-card p-6 mb-6">
        <div className="text-[0.72rem] uppercase tracking-wide text-muted mb-2">
          Description / Deliverables
        </div>
        <p className="whitespace-pre-line mb-0 text-sm">{message.description}</p>
      </div>

      {message.attachmentUrl && (
        <a
          href={message.attachmentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card flex items-center justify-between px-5 py-3.5 mb-6"
        >
          <span className="text-sm font-medium">📎 View Attachment</span>
          <span className="text-lemon-green text-sm font-display font-semibold">
            Open ↗
          </span>
        </a>
      )}

      <a
        href={`mailto:${message.email}`}
        className="btn-primary inline-block"
      >
        Reply via Email
      </a>
    </div>
  );
}
