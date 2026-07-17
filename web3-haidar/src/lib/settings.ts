import { prisma } from "@/lib/prisma";

// Key/value settings table lets the admin change contact-link destinations
// without a code deploy. Defaults here match the original static site, so
// nothing changes visually until the admin actually edits something in
// /admin/settings.
export const DEFAULT_SETTINGS = {
  twitterUrl: "https://x.com/web3_haidar",
  twitterHandle: "@web3_haidar",
  telegramUrl: "https://t.me/web3haidar",
  telegramHandle: "@web3haidar",
  contactEmail: "web3haidar@gmail.com",
};

export type SiteSettings = typeof DEFAULT_SETTINGS;

export async function getSettings(): Promise<SiteSettings> {
  const rows = await prisma.setting.findMany();
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    twitterUrl: map.twitterUrl ?? DEFAULT_SETTINGS.twitterUrl,
    twitterHandle: map.twitterHandle ?? DEFAULT_SETTINGS.twitterHandle,
    telegramUrl: map.telegramUrl ?? DEFAULT_SETTINGS.telegramUrl,
    telegramHandle: map.telegramHandle ?? DEFAULT_SETTINGS.telegramHandle,
    contactEmail: map.contactEmail ?? DEFAULT_SETTINGS.contactEmail,
  };
}
