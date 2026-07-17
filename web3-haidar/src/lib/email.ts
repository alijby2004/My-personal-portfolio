import { Resend } from "resend";
import type { ContactMessage } from "@prisma/client";

const resend = new Resend(process.env.RESEND_API_KEY);

// Kept intentionally simple (plain-text-ish HTML, no React Email templates)
// since this sends one internal notification per submission, not
// marketing/transactional email at scale — a lightweight template is
// easier to maintain than a full templating pipeline for this volume.
export async function sendContactNotification(message: ContactMessage) {
  const to = process.env.CONTACT_NOTIFY_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!to || !from) {
    throw new Error(
      "CONTACT_NOTIFY_EMAIL and RESEND_FROM_EMAIL must be set to send contact notifications."
    );
  }

  const rows: [string, string | null | undefined][] = [
    ["Full Name", message.fullName],
    ["Email", message.email],
    ["Telegram", message.telegramHandle],
    ["Project Name", message.projectName],
    ["Project Website", message.projectWebsite],
    ["Service Type", message.serviceType],
    ["Budget", message.budget],
    ["Deadline", message.deadline],
  ];

  const rowsHtml = rows
    .filter(([, value]) => Boolean(value))
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#888;font-size:13px;">${label}</td><td style="padding:4px 0;font-size:13px;">${escapeHtml(
          value as string
        )}</td></tr>`
    )
    .join("");

  await resend.emails.send({
    from,
    to,
    replyTo: message.email,
    subject: `New inquiry: ${message.projectName} (${message.serviceType})`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;">
        <h2 style="color:#111;">New Contact Form Submission</h2>
        <table>${rowsHtml}</table>
        <p style="margin-top:16px;color:#111;font-size:14px;white-space:pre-line;">${escapeHtml(
          message.description
        )}</p>
        ${
          message.attachmentUrl
            ? `<p><a href="${message.attachmentUrl}">View attachment</a></p>`
            : ""
        }
      </div>
    `,
  });
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
