import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { ContactForm } from "@/components/contact-form";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Contact Me",
  description:
    "Get in touch with Haidar for community management, content creation, or collaboration opportunities.",
};

export default async function ContactPage() {
  const settings = await getSettings();

  const CONTACT_LINKS = [
    {
      icon: "𝕏",
      platform: "Twitter / X",
      handle: settings.twitterHandle,
      href: settings.twitterUrl,
    },
    {
      icon: "✈️",
      platform: "Telegram",
      handle: settings.telegramHandle,
      href: settings.telegramUrl,
    },
    {
      icon: "✉️",
      platform: "Email",
      handle: settings.contactEmail,
      href: `mailto:${settings.contactEmail}`,
    },
  ];

  return (
    <PageShell>
      <h1>Let&apos;s Connect</h1>
      <p>
        Have a project in mind, or just want to say hi? Reach out directly
        through any of the platforms below, or fill out the form and
        I&apos;ll get back to you as soon as I can.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        {CONTACT_LINKS.map(({ icon, platform, handle, href }) => (
          <a
            key={platform}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card text-center px-5 py-6 hover:-translate-y-1 transform duration-200"
          >
            <div className="text-3xl mb-2.5">{icon}</div>
            <div className="font-display font-bold text-base text-lemon-green mb-1">
              {platform}
            </div>
            <div className="text-[0.82rem] text-muted">{handle}</div>
          </a>
        ))}
      </div>

      <hr />

      <h2>Or send me a message directly</h2>
      <p>
        Fill in the details below — this goes straight to my inbox, no need
        to open your email app.
      </p>

      <ContactForm />
    </PageShell>
  );
}
