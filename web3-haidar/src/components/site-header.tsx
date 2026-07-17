"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "@/lib/clsx";

const NAV_LINKS = [
  { href: "/", label: "Homepage" },
  { href: "/pow", label: "My POW" },
  { href: "/contact", label: "Contact me" },
  { href: "/about", label: "About me" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="flex flex-col md:flex-row justify-between items-center gap-2.5 md:gap-0 bg-black/65 backdrop-blur-md border border-lemon-green/25 px-5 py-3 rounded-2xl mb-1.5">
      <div className="flex items-center gap-2.5">
        <Image
          src="https://i.ibb.co/LhdmmtGH/20260619-201056.jpg"
          alt="Haidar profile picture"
          width={36}
          height={36}
          className="rounded-full border-2 border-lemon-green object-cover"
        />
        <span className="font-display font-bold text-base text-lemon-green tracking-wide">
          Web3 Haidar
        </span>
      </div>
      <nav className="flex flex-wrap gap-1.5 justify-center">
        {NAV_LINKS.map((link) => {
          const isActive =
            link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "font-display text-[0.82rem] font-medium px-3.5 py-1.5 rounded-full border tracking-wide transition-colors",
                isActive
                  ? "bg-lemon-green text-black border-lemon-green"
                  : "text-white border-lemon-green/30 hover:bg-lemon-green hover:text-black hover:border-lemon-green"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
