import { NextRequest, NextResponse } from "next/server";
import type { ServiceType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { contactFormSchema } from "@/lib/validation/contact";
import { uploadAttachment, UploadValidationError } from "@/lib/cloudinary";
import { sendContactNotification } from "@/lib/email";
import { createRateLimiter } from "@/lib/rate-limit";

// 5 submissions per hour per IP. Generous enough for a genuine client who
// re-sends after a typo, restrictive enough to blunt scripted spam floods.
const contactLimiter = createRateLimiter(60 * 60 * 1000, 5);

// Unlike Next.js Server Actions (which get automatic same-origin
// enforcement via Origin-header checking), a plain Route Handler like this
// one does not get that protection for free — we verify it ourselves so a
// malicious page on another domain can't silently submit this form on a
// visitor's behalf using their session/cookies.
function isTrustedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) {
    // Same-origin requests from older browsers, or non-browser clients
    // (e.g. curl) legitimately omit Origin — allow through and rely on
    // the rate limiter + honeypot + validation for those cases.
    return true;
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return true;
  try {
    return new URL(origin).host === new URL(siteUrl).host;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ message: "Forbidden." }, { status: 403 });
  }

  const ip = request.headers.get("x-forwarded-for") ?? "unknown";

  const { allowed } = contactLimiter.check(ip);
  if (!allowed) {
    return NextResponse.json(
      { message: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { message: "Invalid form submission." },
      { status: 400 }
    );
  }

  // Honeypot check: a real visitor never sees or fills this field (it's
  // visually hidden off-screen). A non-empty value means a bot filled
  // every input it could find. We respond with a generic success so the
  // bot doesn't learn its submission was flagged, but we never write to
  // the DB or send an email.
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const rawFields = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    telegramHandle: formData.get("telegramHandle"),
    projectName: formData.get("projectName"),
    projectWebsite: formData.get("projectWebsite"),
    serviceType: formData.get("serviceType"),
    budget: formData.get("budget"),
    deadline: formData.get("deadline"),
    description: formData.get("description"),
    website: formData.get("website") ?? "",
  };

  const parsed = contactFormSchema.safeParse(rawFields);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return NextResponse.json(
      { message: "Please fix the errors below.", fieldErrors },
      { status: 400 }
    );
  }

  const data = parsed.data;

  let attachmentUrl: string | undefined;
  const attachment = formData.get("attachment");
  if (attachment instanceof File && attachment.size > 0) {
    try {
      const uploaded = await uploadAttachment(attachment, "web3-haidar/contact");
      attachmentUrl = uploaded.url;
    } catch (err) {
      if (err instanceof UploadValidationError) {
        return NextResponse.json({ message: err.message }, { status: 400 });
      }
      console.error("Contact attachment upload failed:", err);
      return NextResponse.json(
        { message: "Failed to upload attachment. Please try again." },
        { status: 500 }
      );
    }
  }

  const created = await (async () => {
    try {
      return await prisma.contactMessage.create({
        data: {
          fullName: data.fullName,
          email: data.email,
          telegramHandle: data.telegramHandle,
          projectName: data.projectName,
          projectWebsite: data.projectWebsite,
          serviceType: data.serviceType as ServiceType,
          budget: data.budget,
          deadline: data.deadline,
          description: data.description,
          attachmentUrl,
          ipAddress: ip,
        },
      });
    } catch (err) {
      // A database connectivity failure here would otherwise crash the
      // route handler with an unhandled exception, which the client-side
      // fetch in ContactForm can't parse as JSON — it shows up to the user
      // as a generic "network error" with no useful detail. Logging the
      // real cause server-side and returning clean JSON instead means
      // failures are actually diagnosable from Netlify's function logs.
      console.error("Contact form failed — database error:", err);
      return null;
    }
  })();

  if (!created) {
    return NextResponse.json(
      {
        message:
          "Something went wrong saving your message. Please try again in a moment.",
      },
      { status: 500 }
    );
  }

  // The submission is already durably stored at this point — if email
  // delivery fails, the admin still sees it in the Messages dashboard, so
  // we don't fail the whole request over a transient email-provider issue.
  try {
    await sendContactNotification(created);
    await prisma.contactMessage.update({
      where: { id: created.id },
      data: { emailSent: true },
    });
  } catch (err) {
    console.error("Failed to send contact notification email:", err);
  }

  return NextResponse.json({ ok: true });
}
