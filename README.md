# سيرة — Siira CV Builder

A multilingual CV builder for Moroccan job seekers. One profile, multiple styles, instant PDF download.

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Copy env vars
cp .env.example .env.local
# Fill in DATABASE_URL and other values

# 3. Run development server
npm run dev
# → http://localhost:3000

# 4. Run unit tests
npm test
```

## Phase 1 — what's built

- **Guest mode**: CV data stored in `localStorage`. No account needed.
- **Canadian style**: Full renderer + PDF export via Puppeteer.
- **Style engine**: Field rule system that warns without deleting data.
- **Editor**: Personal info, summary, experience, education, skills sections.
- **Live preview**: Debounced, same React component as PDF source.
- **Data model**: TypeScript types + Prisma schema (Phase 3 wires it up).

## Project structure

```
src/
  types/cv.ts              — All TypeScript types
  lib/
    styles/
      engine.ts            — Style rule evaluator
      canadian.ts          — Canadian style definition
      index.ts             — Style registry
    guest/
      storage.ts           — localStorage read/write
      useGuestCV.ts        — React hook with debounced autosave
  components/
    editor/                — Editor panel components
    preview/canadian/      — CanadianPreview (shared preview + PDF renderer)
  app/
    page.tsx               — Home page
    editor/[cvId]/         — Editor page
    render/[cvId]/         — Headless render route (Puppeteer visits this)
    api/pdf/               — PDF generation endpoint
```

## Roadmap

- **Phase 2**: 5 remaining styles, i18n (AR/FR/EN + full RTL), dark mode, photo upload
- **Phase 3**: Auth, accounts, cloud sync, data export/deletion, security hardening
- **Phase 4**: Landing page polish, style gallery, SEO, legal pages, deployment docs

## Deployment

Target stack: Vercel (app) + Neon (Postgres) + Cloudflare R2 (storage) + Resend (email) + Upstash Redis (rate limiting). See `DECISIONS.md` for rationale.
