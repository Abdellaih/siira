# Architecture decisions

## Stack

| Decision | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 App Router | i18n routing, SSR for SEO, code splitting, React ecosystem |
| Styling | Tailwind CSS + CSS custom properties | Logical RTL properties, design tokens in CSS vars |
| i18n | next-intl | Best App Router integration, RTL-aware |
| Database | PostgreSQL via Prisma + Neon | Relational schema correct for structured CV data; Neon free tier |
| Auth | Auth.js v5 | Credentials + Google OAuth; extensible |
| Password hashing | Argon2id via @node-rs/argon2 | Faster than pure-JS bcrypt; OWASP recommended |
| File storage | Cloudflare R2 | Zero egress cost; signed URLs for private photos |
| Email | Resend | Simple API; good deliverability |
| Rate limiting | Upstash Redis | Serverless Redis; integrates with Vercel Edge |
| PDF | Puppeteer + @sparticuz/chromium-min | Only approach that handles Arabic correctly without font hacks |
| Unit tests | Vitest | ESM-native, fast, TypeScript-first |
| E2E tests | Playwright | Real browser, mobile viewports, screenshot diffing |

## Key architectural choices

**PDF generation via headless browser (not a PDF library)**
Arabic PDF requires correct letter shaping and bidirectional text. Browsers do this natively. PDF libraries (jsPDF, pdfmake, react-pdf) require extensive manual Arabic font patches and are fragile. Puppeteer visits `/render/[cvId]` — the same React component that renders in the preview — ensuring pixel-perfect consistency. The render route requires a short-lived token and is marked `noindex`.

**One data model, style as a lens**
The `CVProfile` type is style-agnostic. A `StyleDefinition` declares field rules (required/optional/hidden/discouraged). The engine evaluates rules against the profile and returns warnings — it never mutates the profile. Switching styles never loses data.

**Guest mode in localStorage, not cookies**
CVs contain personal data. Storing in localStorage keeps it device-local and avoids any server-side data processing for unauthenticated users. A clear notice in the UI explains this. Session cookies are only used for authenticated accounts.

**Non-guessable IDs with nanoid**
CVs use `nanoid(21)` IDs (~126 bits of entropy) rather than sequential integers. This prevents ID enumeration attacks even before authentication middleware is in place.

## Design

**Colour accent: Moroccan brick-red (#B83D10)**
Chosen for its grounding in real Moroccan material culture (pisé, brick). Not a brand-agency palette. Used only on primary CTA and key interactions.

**Typefaces: Lora (headings) + Inter (UI) + Noto Naskh Arabic**
Lora gives the site a document-adjacent feel without being cold. Inter is the best Latin face for dense UI at 14–16px. Noto Naskh Arabic is the highest-quality free Arabic typeface for body text.

**The document is always visible**
The CV preview is never behind a button. On desktop it occupies 60% of the screen. On mobile, a tab switch (not a modal) reveals it. The goal: users always see the live output of what they type.
