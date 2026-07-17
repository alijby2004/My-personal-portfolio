import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";

const BADGES = ["🌐 Blockchain", "💎 NFTs", "🎮 Gaming", "🤖 AI", "₿ Crypto"];

const SNAPSHOT_STATS = [
  { stat: "3+", label: "Years in Web3" },
  { stat: "10+", label: "Projects Contributed To" },
  { stat: "2", label: "Core Skills" },
  { stat: "∞", label: "Passion for Web3" },
];

const WHAT_I_DO = [
  {
    emoji: "🏘️",
    title: "Community Management",
    body: "I build and maintain thriving communities by fostering engagement, managing moderation, and ensuring every member feels heard and valued. I prevent scams, reduce spam, and create a safe space for users to grow.",
  },
  {
    emoji: "✍️",
    title: "Content Creation",
    body: "I translate complex Web3 concepts into clear, engaging content — from educational threads and explainers to storytelling campaigns. My goal is to make blockchain accessible to everyone.",
  },
  {
    emoji: "📣",
    title: "Social Media Management",
    body: "I help projects grow their online presence through consistent, high-quality content strategies across Twitter/X, Telegram, and Discord.",
  },
];

export default function HomePage() {
  return (
    <PageShell>
      <section className="text-center px-5 pt-14 pb-8">
        <Image
          src="https://i.ibb.co/LhdmmtGH/20260619-201056.jpg"
          alt="Haidar"
          width={110}
          height={110}
          priority
          className="rounded-full border-[3px] border-lemon-green object-cover mx-auto mb-5 shadow-avatar"
        />
        <h1 className="text-[2.4rem] mb-2.5">
          Hi, I&apos;m <span className="text-lemon-green">Haidar</span> 👋
        </h1>
        <p className="text-[1.05rem] text-[#bbb] max-w-[520px] mx-auto mb-7">
          Web3 Community Manager · Content Creator · SMM
          <br />
          Helping projects grow, communicate, and build lasting communities.
        </p>
        <div className="flex flex-wrap justify-center gap-2.5 mb-8">
          {BADGES.map((badge) => (
            <span key={badge} className="badge">
              {badge}
            </span>
          ))}
        </div>
        <div className="cta-row">
          <Link href="/pow" className="btn-primary">
            View My Work
          </Link>
          <Link href="/contact" className="btn-outline">
            Get In Touch
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
        {SNAPSHOT_STATS.map(({ stat, label }) => (
          <div
            key={label}
            className="glass-card text-center px-5 py-5 hover:-translate-y-1 transform duration-200"
          >
            <div className="font-display text-3xl font-bold text-lemon-green leading-none mb-1.5">
              {stat}
            </div>
            <div className="text-[0.8rem] text-muted uppercase tracking-wide">
              {label}
            </div>
          </div>
        ))}
      </div>

      <hr />

      <h2>What I Do</h2>

      <div className="space-y-4">
        {WHAT_I_DO.map(({ emoji, title, body }) => (
          <div key={title} className="glass-card p-6">
            <h3>
              {emoji} {title}
            </h3>
            <p className="mb-0">{body}</p>
          </div>
        ))}
      </div>

      <hr />

      <div className="text-center py-4">
        <h2 className="mb-3">Ready to work together?</h2>
        <p className="text-muted max-w-[480px] mx-auto mb-6">
          Whether you need a community manager, a content creator, or both —
          I&apos;m available for new collaborations.
        </p>
        <div className="cta-row">
          <Link href="/about" className="btn-outline">
            Learn About Me
          </Link>
          <Link href="/contact" className="btn-primary">
            Contact Me
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
