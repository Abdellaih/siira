import Link from "next/link";
import { useTranslations } from "next-intl";
import { getTranslations, getLocale } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("home");
  return {
    title: "سيرة — " + t("hero_title"),
    description: t("hero_subtitle"),
  };
}

const STYLES = [
  { key: "canadian", flag: "🇨🇦", sub_fr: "ATS · Letter", sub_en: "ATS · Letter", sub_ar: "ATS · Letter" },
  { key: "classic", flag: "🇲🇦", sub_fr: "Photo · A4", sub_en: "Photo · A4", sub_ar: "صورة · A4" },
  { key: "modern", flag: "⚡", sub_fr: "Double colonne", sub_en: "Two-column", sub_ar: "عمودان" },
  { key: "europass", flag: "🇪🇺", sub_fr: "CECR · A4", sub_en: "CEFR · A4", sub_ar: "CECR · A4" },
  { key: "ats", flag: "🤖", sub_fr: "Machine-lisible", sub_en: "Machine-readable", sub_ar: "قابل للآلة" },
  { key: "gulf", flag: "🌙", sub_fr: "Photo · Nationalité", sub_en: "Photo · Nationality", sub_ar: "صورة · جنسية" },
] as const;

export default async function HomePage() {
  const t = await getTranslations();
  const locale = await getLocale();

  return (
    <main className="flex min-h-screen flex-col" style={{ background: "var(--paper)" }}>
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <span className="font-serif text-2xl font-bold" style={{ color: "var(--ink)" }}>
          {t("nav.logo")}
        </span>
        <div className="flex items-center gap-4">
          <div className="flex gap-2 text-sm" style={{ color: "var(--muted)" }}>
            <Link href="/ar" className={locale === "ar" ? "font-medium" : "hover:underline"}>العربية</Link>
            <span>·</span>
            <Link href="/fr" className={locale === "fr" ? "font-medium" : "hover:underline"}>Français</Link>
            <span>·</span>
            <Link href="/en" className={locale === "en" ? "font-medium" : "hover:underline"}>English</Link>
          </div>
          <Link
            href="/auth/login"
            className="text-sm transition hover:underline"
            style={{ color: "var(--muted)" }}
          >
            {t("nav.login")}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center md:gap-12">
        <div className="max-w-2xl">
          <h1
            className="mb-4 font-serif text-4xl font-bold leading-tight md:text-5xl"
            style={{ color: "var(--ink)" }}
          >
            {t("home.hero_title").split(",")[0]},{" "}
            <span style={{ color: "var(--accent)" }}>
              {t("home.hero_title").split(",").slice(1).join(",").trim()}
            </span>
          </h1>
          <p className="text-lg md:text-xl" style={{ color: "var(--muted)" }}>
            {t("home.hero_subtitle")}
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/editor/guest"
            className="rounded px-8 py-3 text-base font-medium text-white transition hover:opacity-90"
            style={{ background: "var(--accent)" }}
          >
            {t("home.cta")}
          </Link>
          <span className="text-sm" style={{ color: "var(--muted)" }}>
            {t("home.cta_note")}
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {STYLES.map((s) => {
            const sub = locale === "ar" ? s.sub_ar : locale === "en" ? s.sub_en : s.sub_fr;
            return (
              <div
                key={s.key}
                className="rounded-full px-4 py-2 text-sm"
                style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
              >
                <span>{s.flag} </span>
                <span className="font-medium" style={{ color: "var(--ink)" }}>
                  {t(`editor.styles.${s.key}`)}
                </span>
                <span className="ml-2" style={{ color: "var(--muted)" }}>{sub}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section
        className="px-6 py-12"
        style={{ borderTop: "1px solid var(--border)", background: "var(--surface)" }}
      >
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center font-serif text-2xl font-bold" style={{ color: "var(--ink)" }}>
            {t("home.how_title")}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {(["1", "2", "3"] as const).map((n) => (
              <div key={n} className="flex flex-col gap-2">
                <div className="mb-1 font-serif text-4xl font-bold" style={{ color: "var(--accent)", opacity: 0.5 }}>
                  {n}
                </div>
                <h3 className="font-medium" style={{ color: "var(--ink)" }}>
                  {t(`home.step${n}_title`)}
                </h3>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  {t(`home.step${n}_body`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-6 py-6 text-center text-xs" style={{ borderTop: "1px solid var(--border)", color: "var(--muted)" }}>
        سيرة · Siira — {new Date().getFullYear()}
      </footer>
    </main>
  );
}
