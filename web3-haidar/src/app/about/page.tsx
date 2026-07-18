import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "About Me",
  description:
    "Haidar – A professional community manager, SMM and content creator with hands-on Web3 experience.",
};

const TIMELINE = [
  { year: "2020", body: "My Web3 journey began. I started as an airdrop hunter — participating in testnets, exploring new ecosystems, and learning how blockchain technology worked from the inside out." },
  { year: "2023", body: "I began investing in myself and expanding my skill set. I ventured into content creation, community management, moderation, and crypto trading — gradually transitioning from participant to contributor." },
  { year: "2023 – Present", body: "Worked with multiple projects as an ambassador, community manager, and moderator. Won contests, helped grow communities, and built a reputation for simplifying complex ideas through content." },
  { year: "Today", body: "Continuing to build skills in content creation, community management, and ecosystem growth. Web3 rewards consistency, curiosity, and the willingness to keep learning — and I'm excited about what comes next." },
];

export default function AboutPage() {
  return (
    <PageShell>
      <h1>About Me</h1>
      <p>This page gives you an overview of who I am — my background, identity in Web3, the languages I speak, and what drives me.</p>

      <hr />

      <h2>Who Am I?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#121212] border border-white/10 rounded-3xl p-6 transition-all hover:border-white/20">
          <div className="flex flex-col items-center text-center">
            <Image src="https://i.ibb.co/S4QYYWdh/68984-removebg-preview.png" alt="Haidar physical character" width={140} height={170} className="rounded-2xl mb-4" />
            <h3 className="text-xl font-bold mb-4">Physical Identity</h3>
          </div>
          <div className="space-y-3 text-[0.9rem] text-gray-300">
            <p className="flex justify-between border-b border-white/5 pb-2"><span>First Name:</span> <span className="text-white font-medium">Aliyu</span></p>
            <p className="flex justify-between border-b border-white/5 pb-2"><span>Surname:</span> <span className="text-white font-medium">Adamu</span></p>
            <p className="flex justify-between border-b border-white/5 pb-2"><span>Nationality:</span> <span className="text-white font-medium">Nigerian 🇳🇬</span></p>
            <p className="flex justify-between border-b border-white/5 pb-2"><span>Languages:</span> <span className="text-white font-medium">Hausa & English</span></p>
            <p className="flex justify-between"><span>Year of Birth:</span> <span className="text-white font-medium">2004</span></p>
          </div>
        </div>

        <div className="bg-[#121212] border border-white/10 rounded-3xl p-6 transition-all hover:border-white/20">
          <div className="flex flex-col items-center text-center">
            <Image src="https://i.ibb.co/yFHsCypR/68844-removebg-preview.png" alt="Haidar Web3 character" width={140} height={140} className="rounded-2xl mb-4" />
            <h3 className="text-xl font-bold mb-4">Web3 Identity</h3>
          </div>
          <div className="space-y-3 text-[0.9rem] text-gray-300">
            <p className="flex justify-between border-b border-white/5 pb-2"><span>Name:</span> <span className="text-white font-medium">Haidar</span></p>
            <p className="flex justify-between border-b border-white/5 pb-2"><span>Skills:</span> <span className="text-white font-medium text-right ml-4">Community Mgmt & Content</span></p>
            <p className="flex justify-between border-b border-white/5 pb-2"><span>Experience:</span> <span className="text-white font-medium">3 Years (2026)</span></p>
            <p className="flex justify-between"><span>Main Focus:</span> <span className="text-white font-medium text-right ml-4">Blockchain, AI, Gaming</span></p>
          </div>
        </div>
      </div>

      <hr />

      <h2>What I Do</h2>
      <p>I help Web3 projects communicate complex ideas in a simple and understandable way through educational content and storytelling.</p>
      <p>I also support communities through moderation and community management, ensuring members feel welcomed, valued, and heard. I believe strong communities are built on trust, engagement, and a positive environment.</p>
      
      <hr />

      <h2>My Journey</h2>
      <div className="relative pl-7 my-5">
        <div className="absolute left-[7px] top-1.5 bottom-1.5 w-0.5 bg-lemon-green/30" />
        {TIMELINE.map(({ year, body }) => (
          <div key={year} className="relative mb-7 last:mb-0">
            <div className="absolute -left-[25px] top-1.5 w-2.5 h-2.5 rounded-full bg-lemon-green border-2 border-dark-bg" />
            <div className="font-display text-[0.78rem] font-bold text-lemon-green uppercase tracking-wide mb-1">{year}</div>
            <p className="text-[0.93rem] mb-0">{body}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
