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
  {
    year: "2020",
    body: "My Web3 journey began. I started as an airdrop hunter — participating in testnets, exploring new ecosystems, and learning how blockchain technology worked from the inside out.",
  },
  {
    year: "2023",
    body: "I began investing in myself and expanding my skill set. I ventured into content creation, community management, moderation, and crypto trading — gradually transitioning from participant to contributor.",
  },
  {
    year: "2023 – Present",
    body: "Worked with multiple projects as an ambassador, community manager, and moderator. Won contests, helped grow communities, and built a reputation for simplifying complex ideas through content.",
  },
  {
    year: "Today",
    body: "Continuing to build skills in content creation, community management, and ecosystem growth. Web3 rewards consistency, curiosity, and the willingness to keep learning — and I'm excited about what comes next.",
  },
];

export default function AboutPage() {
  return (
    <PageShell>
      <h1>About Me</h1>
      <p>
        This page gives you an overview of who I am — my background,
        identity in Web3, the languages I speak, and what drives me.
      </p>

      <hr />

      <h2>Who Am I?</h2>

      <div className="glass-card flex flex-col md:flex-row items-start gap-6 p-6 mb-4">
        <div className="shrink-0 mx-auto md:mx-0">
          <Image
            src="https://i.ibb.co/S4QYYWdh/68984-removebg-preview.png"
            alt="Haidar physical character"
            width={160}
            height={196}
            className="rounded-xl"
          />
          <div className="w-full h-1.5 bg-lemon-green rounded-sm mt-1" />
        </div>
        <div>
          <h3>Physical Identity</h3>
          <div className="text-[0.95rem] leading-loose">
            <p className="mb-0">
              <b className="text-lemon-green">First Name:</b> Aliyu
            </p>
            <p className="mb-0">
              <b className="text-lemon-green">Surname:</b> Adamu
            </p>
            <p className="mb-0">
              <b className="text-lemon-green">Nationality:</b> Nigerian 🇳🇬
            </p>
            <p className="mb-0">
              <b className="text-lemon-green">Languages:</b> Hausa & English
            </p>
            <p className="mb-0">
              <b className="text-lemon-green">Year of Birth:</b> 2004
            </p>
          </div>
        </div>
      </div>

      <div className="glass-card flex flex-col md:flex-row items-start gap-6 p-6">
        <div className="shrink-0 mx-auto md:mx-0">
          <Image
            src="https://i.ibb.co/yFHsCypR/68844-removebg-preview.png"
            alt="Haidar Web3 character"
            width={160}
            height={160}
            className="rounded-xl"
          />
          <div className="w-full h-1.5 bg-lemon-green rounded-sm mt-1" />
        </div>
        <div>
          <h3>Web3 Identity</h3>
          <div className="text-[0.95rem] leading-loose">
            <p className="mb-0">
              <b className="text-lemon-green">Name:</b> Haidar
            </p>
            <p className="mb-0">
              <b className="text-lemon-green">Skills:</b> Community
              Management & Content Creation
            </p>
            <p className="mb-0">
              <b className="text-lemon-green">Experience:</b> 3 Years (as of
              2026)
            </p>
            <p className="mb-0">
              <b className="text-lemon-green">Main Focus:</b> Blockchain,
              Crypto, NFTs, Gaming & AI
            </p>
          </div>
        </div>
      </div>

      <hr />

      <h2>What I Do</h2>
      <p>
        I help Web3 projects communicate complex ideas in a simple and
        understandable way through educational content and storytelling.
      </p>
      <p>
        I also support communities through moderation and community
        management, ensuring members feel welcomed, valued, and heard. I
        believe strong communities are built on trust, engagement, and a
        positive environment.
      </p>
      <p>
        Beyond answering questions and keeping discussions active, I help
        maintain healthy communities by preventing scams, reducing spam, and
        creating a safe space where users can confidently interact and grow
        alongside the ecosystem.
      </p>

      <hr />

      <h2>My Journey</h2>

      <div className="relative pl-7 my-5">
        <div className="absolute left-[7px] top-1.5 bottom-1.5 w-0.5 bg-lemon-green/30" />
        {TIMELINE.map(({ year, body }) => (
          <div key={year} className="relative mb-7 last:mb-0">
            <div className="absolute -left-[25px] top-1.5 w-2.5 h-2.5 rounded-full bg-lemon-green border-2 border-dark-bg" />
            <div className="font-display text-[0.78rem] font-bold text-lemon-green uppercase tracking-wide mb-1">
              {year}
            </div>
            <p className="text-[0.93rem] mb-0">{body}</p>
          </div>
        ))}
      </div>

      <hr />

      <h2>Thanks for Stopping By 👋</h2>

      <div className="text-center py-2.5">
        <div className="text-center -mt-5 mb-2.5">
          <Image
            src="https://i.ibb.co/8gXphpRk/69937-removebg-preview.png"
            alt="Haidar"
            width={250}
            height={250}
            className="inline-block border-b-4 border-lemon-green mx-auto"
          />
        </div>

        <p className="font-bold">
          Thank you for taking the time to learn more about me and my journey
          🫡
        </p>
        <p className="text-muted max-w-[460px] mx-auto mb-6">
          I&apos;m always open to new opportunities, collaborations, and
          exciting projects where I can contribute and create value.
          Let&apos;s build something meaningful together.
        </p>
        <div className="cta-row">
          <Link href="/pow" className="btn-outline">
            Check My POW
          </Link>
          <Link href="/contact" className="btn-primary">
            Contact Me
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
