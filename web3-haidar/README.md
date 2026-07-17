# Web3 Haidar — Portfolio

A full-stack, database-driven portfolio for Web3 Haidar: public site (Home, About,
Proof of Work, Contact) plus a secure admin dashboard for managing everything
without touching code.

## Stack

- **Next.js 14** (App Router) — one codebase for the public site, the admin
  dashboard, and the API.
- **PostgreSQL** + **Prisma** — data and migrations.
- **Tailwind CSS** — styled with the original site's exact color/typography
  tokens (lemon-green on near-black, Space Grotesk + Inter).
- **Cloudinary** — image and file uploads (logos, screenshots, proof PDFs,
  contact-form attachments).
- **Resend** — transactional email for contact form notifications.
- **Custom session auth** — bcrypt-hashed passwords, HttpOnly session
  cookies backed by a database table (not JWT), so sessions can be revoked
  instantly.

---

## 1. Local Setup

### Prerequisites

- Node.js 18.18+
- A PostgreSQL database (local, or a free hosted instance — see §3)
- A free [Cloudinary](https://cloudinary.com) account
- A free [Resend](https://resend.com) account

### Install

```bash
npm install
```

### Environment variables

Copy `.env.example` to `.env` and fill in every value:

```bash
cp .env.example .env
```

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | Your Postgres connection string |
| `SESSION_SECRET` | Generate with `openssl rand -base64 32` |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary Dashboard → Account Details |
| `RESEND_API_KEY` | Resend Dashboard → API Keys |
| `CONTACT_NOTIFY_EMAIL` | The email address you want contact-form submissions sent to |
| `RESEND_FROM_EMAIL` | Must be on a domain you've verified in Resend (e.g. `notifications@yourdomain.com`) |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` locally; your real domain in production |

### Database setup

```bash
npm run db:migrate      # creates tables from prisma/schema.prisma
```

### Create your admin account

Credentials are never hardcoded anywhere in the source. The seed script
reads them from environment variables at the moment you run it:

```bash
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=a-strong-password-12+chars npm run db:seed
```

Use a password of at least 12 characters. You can change it any time from
**Admin → Settings** once logged in.

### Run locally

```bash
npm run dev
```

- Public site: http://localhost:3000
- Admin login: http://localhost:3000/admin/login

---

## 2. Day-to-Day Admin Usage

### Adding a new POW entry

1. Log in at `/admin/login`.
2. **Dashboard → Add New POW Entry**, or **POW Management → + Add New Entry**.
3. Choose a **Section**:
   - *Ongoing Job* — stays visible on the public POW page until you remove
     or hide it.
   - *Other Gig* — appears in the "Other Gigs" list; only the 5 most
     recent show by default, with an "Explore More" button revealing the
     rest.
4. Fill in category, role, project name, and a short description (shown on
   the card). "Full Details" is optional long-form text shown on the
   entry's detail page — line breaks are preserved.
5. Upload any of: project logo, featured image, screenshots, proof images,
   winner-announcement images, proof PDFs. All optional, all can be added
   later from the Edit page.
6. Save. It's live on `/pow` immediately unless you checked **Hidden**.

### Managing existing entries

From **POW Management** you can, per entry:
- **↑ / ↓** — reorder within its section
- **📌 Pin** — pinned entries always sort first within their section
- **⭐ Feature** — flag for potential future featured placement
- **👁️ Hide** — removes it from the public site without deleting it
- **✏️ Edit** — edit any field, add more media, or delete individual
  images/files
- **🗑️ Delete** — permanently removes the entry and all its media
  (asks for confirmation first)

### Messages

Every contact-form submission is saved and also emailed to
`CONTACT_NOTIFY_EMAIL`. If email delivery ever fails (e.g. a Resend outage),
the message is still safely in your **Messages** inbox — the submission is
never lost.

- Unread messages show a green dot; opening one marks it read automatically.
- Use the search box or the All / Unread / Read filters to find something.
- Each message has a **Reply via Email** button (opens your mail client)
  and a delete option.

### Settings

- **Contact Links** — update your X, Telegram, and email — these
  automatically update the footer and Contact page site-wide.
- **Change Password** — requires your current password; changing it signs
  out every other active session (e.g. if you're logged in on another
  device or suspect your session was compromised).

---

## 3. Deployment

Recommended free-tier stack:

- **App hosting:** [Vercel](https://vercel.com) — native Next.js support,
  zero-config deploys from GitHub.
- **Database:** [Neon](https://neon.tech) — serverless Postgres, generous
  free tier, works well with Vercel's serverless functions.
- **Files:** Cloudinary (already set up in §1).
- **Email:** Resend (already set up in §1).

### Steps

1. **Push this project to a GitHub repository.**
2. **Create a Neon database.** Copy its connection string into
   `DATABASE_URL`.
3. **Import the project into Vercel** (New Project → import your repo).
4. **Add all environment variables** from your `.env` into Vercel's
   Project Settings → Environment Variables. Set `NEXT_PUBLIC_SITE_URL` to
   your real production URL (e.g. `https://web3haidar.com`).
5. **Deploy.** Vercel runs `npm run build`, which runs
   `prisma generate` automatically (see `postinstall` in `package.json`).
6. **Run migrations against production** once, from your local machine,
   pointed at the production `DATABASE_URL`:
   ```bash
   npm run db:deploy
   ```
7. **Seed your admin user** against production the same way as local setup
   (§1), using the production `DATABASE_URL`.
8. **Verify your sending domain in Resend** so `RESEND_FROM_EMAIL` isn't
   flagged as spam — Resend's dashboard walks you through adding a couple
   of DNS records.
9. Visit `https://yourdomain.com/admin/login` and confirm you can log in.

### Custom domain

Add it in Vercel's Project Settings → Domains, point your DNS per Vercel's
instructions, then update `NEXT_PUBLIC_SITE_URL` to match and redeploy.

---

## 4. Security Notes

- Passwords are hashed with bcrypt (cost factor 12) — never stored or
  logged in plaintext.
- Sessions are opaque, database-backed tokens in HttpOnly, Secure (in
  production), SameSite=Lax cookies — not JWTs — so any session can be
  revoked instantly server-side.
- `/admin/*` is protected two ways: an edge-middleware cookie check (fast,
  first line of defense) and a database-verified session check in the
  admin layout (the real gate).
- Login is rate-limited (5 attempts / 15 minutes per IP+email); the
  contact form is rate-limited (5 submissions / hour per IP) and has a
  honeypot field to silently drop bot spam.
- The `/api/contact` route validates its `Origin` header (CSRF
  protection); all admin mutations are Next.js Server Actions, which get
  the same protection automatically.
- All inputs are validated server-side with Zod — client-side validation
  is convenience only and is never trusted on its own.
- File uploads are type- and size-restricted server-side regardless of
  what the browser's file picker allows.
- Standard defensive headers (`X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy`) are set site-wide in
  `next.config.js`.
- `/admin` is excluded from `robots.txt` and marked `noindex` at the page
  level.

### Scaling note

Rate limiting is currently in-memory per server instance, which is
sufficient for a single-admin portfolio site. If this app ever runs across
multiple server instances behind a load balancer, swap `src/lib/rate-limit.ts`
for a shared store (e.g. Upstash Redis) so limits are enforced globally
rather than per-instance.

---

## 5. Project Structure

```
prisma/
  schema.prisma        # Data model
  seed.ts               # Creates the initial admin user from env vars
src/
  app/
    (public pages)       # /, /about, /pow, /pow/[id], /contact
    api/contact/          # Contact form submission endpoint
    admin/
      login/               # Public login page (outside the auth layout)
      (protected)/          # Everything requiring a valid session
        page.tsx              # Dashboard
        pow/                  # POW management (CRUD, media, reorder)
        messages/             # Contact message inbox
        settings/             # Site links + password change
  components/            # Shared UI, split into public / admin
  lib/
    auth/                 # Password hashing, sessions, rate limiting
    validation/            # Zod schemas (shared client/server)
    cloudinary.ts           # Upload/delete helpers
    email.ts                # Resend integration
    pow.ts, settings.ts      # Data-access helpers
```
