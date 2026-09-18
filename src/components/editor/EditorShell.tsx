"use client";

import { useState, useDeferredValue, useCallback } from "react";
import { useTranslations } from "next-intl";
import type { CVProfile } from "@/types/cv";
import { getStyle } from "@/lib/styles";
import { getStyleWarnings } from "@/lib/styles/engine";
import CVPreview from "@/components/preview/CVPreview";
import SectionPersonal from "./SectionPersonal";
import SectionExperience from "./SectionExperience";
import SectionEducation from "./SectionEducation";
import SectionSkills from "./SectionSkills";
import SectionLanguages from "./SectionLanguages";
import SectionCertifications from "./SectionCertifications";
import SectionProjects from "./SectionProjects";
import SectionVolunteering from "./SectionVolunteering";
import SectionInterests from "./SectionInterests";
import StyleWarningBanner from "./StyleWarningBanner";
import StyleCustomizer from "./StyleCustomizer";
import ThemeToggle from "@/components/ui/ThemeToggle";

type SectionId =
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "languages"
  | "certifications"
  | "projects"
  | "volunteering"
  | "interests";

const SECTION_IDS: SectionId[] = [
  "personal", "summary", "experience", "education", "skills",
  "languages", "certifications", "projects", "volunteering", "interests",
];

interface Props {
  cv: CVProfile;
  saving: boolean;
  onUpdate: (updater: (prev: CVProfile) => CVProfile) => void;
}

export default function EditorShell({ cv, saving, onUpdate }: Props) {
  const t = useTranslations("editor");
  const [activeSection, setActiveSection] = useState<SectionId>("personal");
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const [downloading, setDownloading] = useState(false);

  const deferredCV = useDeferredValue(cv);
  const style = getStyle(cv.activeStyleId);
  const warnings = getStyleWarnings(cv, style, cv.cvLanguage);

  const update = useCallback(
    (updater: (prev: CVProfile) => CVProfile) => onUpdate(updater),
    [onUpdate],
  );

  async function downloadPDF() {
    setDownloading(true);
    try {
      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cv),
      });
      if (!res.ok) throw new Error("failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${cv.name || "cv"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert(t("pdf_error"));
    } finally {
      setDownloading(false);
    }
  }

  function renderSection() {
    switch (activeSection) {
      case "personal":
        return (
          <SectionPersonal
            cv={cv}
            style={style}
            onChange={(patch) => update((p) => ({ ...p, personal: { ...p.personal, ...patch } }))}
          />
        );
      case "summary":
        return (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-stone-600 dark:text-stone-400">
              {t("summary_label")}
            </label>
            <textarea
              rows={8}
              value={cv.summary}
              placeholder={t("summary_placeholder")}
              onChange={(e) => update((p) => ({ ...p, summary: e.target.value }))}
              className="w-full resize-none rounded border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 outline-none transition focus:border-accent focus:ring-1 focus:ring-accent dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
            />
            <p className="text-xs text-stone-400">{t("summary_hint")}</p>
          </div>
        );
      case "experience":
        return <SectionExperience cv={cv} onChange={(e) => update((p) => ({ ...p, experience: e }))} />;
      case "education":
        return <SectionEducation cv={cv} onChange={(e) => update((p) => ({ ...p, education: e }))} />;
      case "skills":
        return <SectionSkills cv={cv} onChange={(e) => update((p) => ({ ...p, skills: e }))} />;
      case "languages":
        return <SectionLanguages cv={cv} onChange={(e) => update((p) => ({ ...p, languages: e }))} />;
      case "certifications":
        return <SectionCertifications cv={cv} onChange={(e) => update((p) => ({ ...p, certifications: e }))} />;
      case "projects":
        return <SectionProjects cv={cv} onChange={(e) => update((p) => ({ ...p, projects: e }))} />;
      case "volunteering":
        return <SectionVolunteering cv={cv} onChange={(e) => update((p) => ({ ...p, volunteering: e }))} />;
      case "interests":
        return <SectionInterests cv={cv} onChange={(e) => update((p) => ({ ...p, interests: e }))} />;
    }
  }

  return (
    <div className="flex h-screen flex-col bg-white dark:bg-stone-950">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3 dark:border-stone-700 dark:bg-stone-950">
        <div className="flex items-center gap-3">
          <a href="/" className="font-serif text-lg font-bold text-stone-800 dark:text-stone-100">
            سيرة
          </a>
          <span className="hidden text-sm text-stone-400 sm:inline">·</span>
          <span className="hidden max-w-[120px] truncate text-sm text-stone-500 dark:text-stone-400 sm:inline">
            {cv.name}
          </span>
          {saving && (
            <span className="animate-pulse text-xs text-stone-400">{t("saving")}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={cv.activeStyleId}
            onChange={(e) =>
              update((p) => ({ ...p, activeStyleId: e.target.value as CVProfile["activeStyleId"] }))
            }
            className="hidden rounded border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-700 outline-none focus:border-accent dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 sm:block"
          >
            {(["canadian", "classic", "modern", "europass", "ats", "gulf"] as const).map((id) => (
              <option key={id} value={id}>{t(`styles.${id}`)}</option>
            ))}
          </select>

          <StyleCustomizer
            styleId={cv.activeStyleId}
            value={cv.customization}
            onChange={(patch) =>
              update((p) => ({
                ...p,
                customization: { ...p.customization, ...patch },
              }))
            }
          />

          <ThemeToggle />

          <button
            type="button"
            onClick={downloadPDF}
            disabled={downloading}
            className="rounded bg-accent px-4 py-1.5 text-sm font-medium text-white transition hover:bg-accent/90 disabled:opacity-60"
          >
            {downloading ? t("downloading") : t("download")}
          </button>
        </div>
      </header>

      {/* Mobile tab switcher */}
      <div className="flex border-b border-stone-200 dark:border-stone-700 lg:hidden">
        {(["edit", "preview"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setMobileTab(tab)}
            className={`flex-1 py-2.5 text-sm font-medium transition ${
              mobileTab === tab
                ? "border-b-2 border-accent text-accent"
                : "text-stone-500"
            }`}
          >
            {tab === "edit" ? t("edit_tab") : t("preview_tab")}
          </button>
        ))}
      </div>

      {/* Main split */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor panel */}
        <div
          className={`w-full flex-col lg:flex lg:w-[42%] lg:border-r lg:border-stone-200 lg:dark:border-stone-700 ${
            mobileTab === "edit" ? "flex" : "hidden"
          }`}
        >
          {/* Section nav */}
          <nav className="flex overflow-x-auto border-b border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-950">
            {SECTION_IDS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveSection(id)}
                className={`shrink-0 px-3 py-3 text-xs transition sm:text-sm ${
                  activeSection === id
                    ? "border-b-2 border-accent font-medium text-accent"
                    : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
                }`}
              >
                {t(`sections.${id}`)}
              </button>
            ))}
          </nav>

          {/* Warning banner */}
          {warnings.length > 0 && (
            <div className="border-b border-stone-200 p-3 dark:border-stone-700">
              <StyleWarningBanner
                warnings={warnings}
                styleName={t(`styles.${cv.activeStyleId}`)}
              />
            </div>
          )}

          {/* Section content */}
          <div className="flex-1 overflow-y-auto p-4">{renderSection()}</div>
        </div>

        {/* Preview panel */}
        <div
          className={`w-full flex-1 lg:flex ${mobileTab === "preview" ? "flex" : "hidden lg:flex"}`}
        >
          <div className="h-full w-full overflow-auto bg-stone-100 p-4 dark:bg-stone-800">
            <div
              className="mx-auto shadow-xl"
              style={{ maxWidth: style.pageSize === "LETTER" ? "215.9mm" : "210mm" }}
            >
              <CVPreview cv={deferredCV} />
            </div>
          </div>
        </div>
      </div>

      {/* Guest notice */}
      <div className="border-t border-stone-200 bg-stone-50 px-4 py-2 text-center text-xs text-stone-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400">
        {t("guest_notice")}{" "}
        <a href="/auth/signup" className="text-accent hover:underline">
          {t("create_account")}
        </a>{" "}
        {t("guest_notice_suffix")}
      </div>
    </div>
  );
}
