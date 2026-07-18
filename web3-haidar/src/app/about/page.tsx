import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "About Me",
  description: "Haidar – A professional community manager, SMM and content creator with hands-on Web3 experience.",
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
        {/* Physical Identity */}
        <div className="bg-[#1f0d14] border border-pink-500/20 rounded-3xl p-6 transition-all hover:border-pink-500/40">
          <div className="relative w-32 h-32 mx-auto mb-4 bg-pink-900/20 rounded-2xl border border-pink-500/30 flex items-center justify-center">
            <Image src="https://i.ibb.co/S4QYYWdh/68984-removebg-preview.png" alt="Physical Identity" width={100} height={120} />
          </div>
          <h3 className="text-xl font-bold text-center mb-4">Physical Identity</h3>
          <div className="space-y-3 text-[0.9rem] text-gray-300">
            <p className="flex justify-between border-b border-pink-500/10 pb-2"><span>First Name:</span> <span className="text-white font-medium">Aliyu</span></p>
            <p className="flex justify-between border-b border-pink-500/10 pb-2"><span>Surname:</span> <span className="text-white font-medium">Adamu</span></p>
            <p className="flex justify-between border-b border-pink-500/10 pb-2"><span>Nationality:</span> <span className="text-white font-medium">Nigerian 🇳🇬</span></p>
            <p className="flex justify-between border-b border-pink-500/10 pb-2"><span>Languages:</span> <span className="text-white font-medium">Hausa & English</span></p>
            <p className="flex justify-between"><span>Year of Birth:</span> <span className="text-white font-medium">2004</span></p>
          </div>
        </div>

        {/* Web3 Identity */}
        <div className="bg-[#1f0d14] border border-pink-500/20 rounded-3xl p-6 transition-all hover:border-pink-500/40">
          <div className="relative w-32 h-32 mx-auto mb-4 bg-pink-900/20 rounded-2xl border border-pink-500/30 flex items-center justify-center">
            <Image src="https://i.ibb.co/yFHsCypR/68844-removebg-preview.png" alt="Web3 Identity" width={100} height={100} />
          </div>
          <h3 className="text-xl font-bold text-center mb-4">Web3 Identity</h3>
          <div className="space-y-3 text-[0.9rem] text-gray-300">
            <p className="flex justify-between border-b border-pink-500/10 pb-2"><span>Name:</span> <span className="text-white font-medium">Haidar</span></p>
            <p className="flex justify-between border-b border-pink-500/10 pb-2"><span>Skills:</span> <span className="text-white font-medium text-right ml-2">Community Mgmt & Content</span></p>
            <p className="flex justify-between border-b border-pink-500/10 pb-2"><span>Experience:</span> <span className="text-white font-medium">3 Years (2026)</span></p>
            <p className="flex justify-between"><span>Main Focus:</span> <span className="text-white font-medium text-right ml-2">Blockchain, AI, Gaming</span></p>
          </div>
        </div>
      </div>

      <h2>What I Do</h2>
      <p>I help Web3 projects communicate complex ideas in a simple and understandable way through educational content and storytelling.</p>
      <p>I also support communities through moderation and community management, ensuring members feel welcomed, valued, and heard. I believe strong communities are built on trust, engagement, and a positive environment.</p>
      <p>Beyond answering questions and keeping discussions active, I help maintain healthy communities by preventing scams, reducing spam, and creating a safe space where users can confidently interact and grow alongside the ecosystem.</p>

      <h2>My Journey</h2>
      <div className="relative pl-7 my-5">
        <div className="absolute left-[7px] top-1.5 bottom-1.5 w-0.5 bg-pink-500/30" />
        {TIMELINE.map(({ year, body }) => (
          <div key={year} className="relative mb-7 last:mb-0">
            <div className="absolute -left-[25px] top-1.5 w-2.5 h-2.5 rounded-full bg-pink-500 border-2 border-black" />
            <div className="font-display text-[0.78rem] font-bold text-pink-400 uppercase tracking-wide mb-1">{year}</div>
            <p className="text-[0.93rem] mb-0 text-gray-300">{body}</p>
          </div>
        ))}
      </div>

      <div className="text-center py-8 bg-[#1f0d14] rounded-3xl border border-pink-500/20 mt-10">
        <Image src="https://i.ibb.co/8gXphpRk/69937-removebg-preview.png" alt="Haidar" width={200} height={200} className="inline-block mb-4" />
        <p className="font-bold text-white mb-6">Thank you for taking the time to learn more about me and my journey 🫡</p>
        <div className="flex justify-center gap-4">
          <Link href="/pow" className="px-6 py-3 rounded-full border border-pink-500 text-pink-200 hover:bg-pink-500/10">View My Work</Link>
          <Link href="/contact" className="px-6 py-3 rounded-full bg-pink-600 text-white hover:bg-pink-500">Contact Me</Link>
        </div>
      </div>
    </PageShell>
  );
}
