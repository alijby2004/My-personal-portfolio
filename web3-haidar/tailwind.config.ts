import type { Config } from "tailwindcss";

// These tokens are copied 1:1 from the original Style.css so the visual
// identity of the site (lemon-green on near-black, pill nav, glass cards)
// carries over exactly — nothing here is a redesign of the palette.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "lemon-green": "#ccff00",
        "lemon-dim": "#a8d400",
        "dark-bg": "#121212",
        "card-bg": "#1a1a1a",
        "card-border": "#2a2a2a",
        muted: "#aaaaaa",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "site-bg":
          "url('https://i.ibb.co/8Db4bt4D/Untitled-design-20260621-114822-0000.png')",
      },
      boxShadow: {
        avatar: "0 0 28px rgba(204,255,0,0.25)",
      },
      borderRadius: {
        card: "18px",
        pill: "30px",
      },
    },
  },
  plugins: [],
};

export default config;
