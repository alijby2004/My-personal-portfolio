import { getSettings } from "@/lib/settings";

export async function SiteFooter() {
  const settings = await getSettings();

  return (
    <footer className="text-center mt-16 pt-7 pb-7 border-t border-lemon-green/20 text-[0.82rem] text-[#888]">
      <p className="mb-2.5 space-x-2">
        <a
          href={settings.twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lemon-green hover:underline"
        >
          𝕏 Twitter
        </a>
        <a
          href={settings.telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lemon-green hover:underline"
        >
          Telegram
        </a>
        <a
          href={`mailto:${settings.contactEmail}`}
          className="text-lemon-green hover:underline"
        >
          Email
        </a>
      </p>
      © {new Date().getFullYear()} Web3 Haidar · Built with passion and
      curiosity.
    </footer>
  );
}
