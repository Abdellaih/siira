import React from "react";
import type { CVProfile } from "@/types/cv";
import { europassStyle } from "@/lib/styles/europass";
import { isFieldVisible, getPageDimensions } from "@/lib/styles/engine";
import { resolveTheme } from "@/lib/styles/customization";

interface Props { cv: CVProfile; forPDF?: boolean; }

const dims = getPageDimensions(europassStyle);

function fmt(date: string | null, current?: boolean, lang = "fr"): string {
  if (current) return lang === "fr" ? "en cours" : "present";
  if (!date) return "";
  const [year, month] = date.split("-");
  if (!month) return year;
  const d = new Date(Number(year), Number(month) - 1);
  return d.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", { month: "short", year: "numeric" });
}

export default function EuropassPreview({ cv, forPDF = false }: Props) {
  const theme = resolveTheme(europassStyle, cv.customization);
  const { personal } = cv;
  const lang = cv.cvLanguage === "fr" ? "fr" : "en";

  const LABELS = {
    fr: {
      personal: "Informations personnelles",
      summary: "Profil personnel",
      experience: "Expérience professionnelle",
      education: "Formation et diplômes",
      skills: "Compétences",
      languages: "Langues",
      certs: "Certifications",
      projects: "Projets",
      volunteering: "Bénévolat",
      interests: "Centres d'intérêt",
      from: "Du",
      to: "au",
      current: "en cours",
      dob: "Date de naissance",
      nationality: "Nationalité",
      driving: "Permis de conduire",
      understanding: "Compréhension",
      speaking: "Expression orale",
      writing: "Expression écrite",
      listening: "Écoute",
      reading: "Lecture",
    },
    en: {
      personal: "Personal information",
      summary: "Personal statement",
      experience: "Work experience",
      education: "Education and training",
      skills: "Skills",
      languages: "Language skills",
      certs: "Certifications",
      projects: "Projects",
      volunteering: "Volunteering",
      interests: "Interests",
      from: "From",
      to: "to",
      current: "present",
      dob: "Date of birth",
      nationality: "Nationality",
      driving: "Driving licence",
      understanding: "Understanding",
      speaking: "Speaking",
      writing: "Writing",
      listening: "Listening",
      reading: "Reading",
    },
  }[lang];

  const s: Record<string, React.CSSProperties> = {
    page: {
      width: forPDF ? dims.width : "100%",
      maxWidth: dims.width,
      minHeight: forPDF ? dims.height : undefined,
      margin: "0 auto",
      backgroundColor: "#fff",
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSize.body,
      color: theme.bodyColor,
      lineHeight: theme.lineHeight,
      boxSizing: "border-box" as const,
    },
    banner: {
      backgroundColor: theme.accentColor,
      color: "#fff",
      padding: "10mm 14mm 8mm",
    },
    bannerName: { fontSize: "18px", fontWeight: 700, marginBottom: "2px" },
    bannerHeadline: { fontSize: "11px", opacity: 0.85 },
    body: { padding: "8mm 14mm 12mm" },
    sectionRow: {
      display: "flex",
      gap: "12px",
      marginBottom: theme.sectionSpacing,
    },
    sectionLabel: {
      width: "36mm",
      flexShrink: 0,
      fontSize: theme.fontSize.heading,
      fontWeight: 700,
      color: theme.accentColor,
      textTransform: "uppercase" as const,
      letterSpacing: "0.4px",
      paddingTop: "2px",
    },
    sectionContent: { flex: 1, borderTop: `1px solid ${theme.borderColor}`, paddingTop: "6px" },
    entryBlock: { marginBottom: theme.sectionSpacing },
    dateRange: {
      fontSize: theme.fontSize.small,
      color: theme.mutedColor,
      marginBottom: "3px",
    },
    bold: { fontWeight: 700, fontSize: "10.5px", color: theme.headingColor },
    italic: { fontStyle: "italic", color: theme.mutedColor, fontSize: "10px", marginBottom: "3px" },
    bullet: { marginLeft: "14px", marginBottom: "2px", listStyle: "disc", fontSize: theme.fontSize.body },
    infoGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "3px 16px",
      fontSize: theme.fontSize.small,
      color: theme.mutedColor,
    },
    langTable: {
      width: "100%",
      borderCollapse: "collapse" as const,
      fontSize: theme.fontSize.small,
    },
    langTh: {
      border: `1px solid ${theme.borderColor}`,
      padding: "3px 5px",
      background: "#EEF2FF",
      color: theme.accentColor,
      fontWeight: 700,
      textAlign: "center" as const,
    },
    langTd: {
      border: `1px solid ${theme.borderColor}`,
      padding: "3px 5px",
      textAlign: "center" as const,
    },
  };

  function Section({ label, children }: { label: string; children: React.ReactNode }) {
    return (
      <div style={s.sectionRow}>
        <div style={s.sectionLabel}>{label}</div>
        <div style={s.sectionContent}>{children}</div>
      </div>
    );
  }

  const showPhoto = isFieldVisible("personal.photo", europassStyle) && personal.photoKey;
  const photoSrc = personal.photoKey?.startsWith("data:") ? personal.photoKey : personal.photoKey ? `/api/photo/${personal.photoKey}` : null;

  return (
    <div style={s.page} data-cv-page>
      {/* Blue header banner */}
      <div style={s.banner}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={s.bannerName}>
              {[personal.firstName, personal.lastName].filter(Boolean).join(" ")}
            </div>
            {personal.headline && <div style={s.bannerHeadline}>{personal.headline}</div>}
          </div>
          {showPhoto && photoSrc && (
            <img src={photoSrc} alt="" style={{ width: "25mm", height: "30mm", objectFit: "cover", borderRadius: "2px", border: "2px solid rgba(255,255,255,0.4)" }} />
          )}
        </div>
      </div>

      <div style={s.body}>
        {/* Personal info */}
        <Section label={LABELS.personal}>
          <div style={s.infoGrid}>
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>{personal.phoneCountryCode} {personal.phone}</span>}
            {(personal.city || personal.country) && <span>{[personal.city, personal.country].filter(Boolean).join(", ")}</span>}
            {personal.linkedin && <span>{personal.linkedin}</span>}
            {personal.website && <span>{personal.website}</span>}
            {isFieldVisible("personal.dateOfBirth", europassStyle) && personal.dateOfBirth && (
              <span>{LABELS.dob}: {new Date(personal.dateOfBirth).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB")}</span>
            )}
            {isFieldVisible("personal.nationality", europassStyle) && personal.nationality && (
              <span>{LABELS.nationality}: {personal.nationality}</span>
            )}
            {isFieldVisible("personal.drivingLicense", europassStyle) && personal.drivingLicense.length > 0 && (
              <span>{LABELS.driving}: {personal.drivingLicense.join(", ")}</span>
            )}
          </div>
        </Section>

        {cv.summary && (
          <Section label={LABELS.summary}>
            <p style={{ fontSize: theme.fontSize.body, lineHeight: 1.5 }}>{cv.summary}</p>
          </Section>
        )}

        {cv.experience.length > 0 && (
          <Section label={LABELS.experience}>
            {[...cv.experience].sort((a, b) => a.order - b.order).map((exp) => (
              <div key={exp.id} style={s.entryBlock}>
                <div style={s.dateRange}>{fmt(exp.startDate, false, lang)} – {exp.current ? LABELS.current : fmt(exp.endDate, false, lang)}</div>
                <div style={s.bold}>{exp.position}</div>
                <div style={s.italic}>{exp.company}{exp.location ? `, ${exp.location}` : ""}</div>
                <ul>{exp.bullets.filter(Boolean).map((b, i) => <li key={i} style={s.bullet}>{b}</li>)}</ul>
              </div>
            ))}
          </Section>
        )}

        {cv.education.length > 0 && (
          <Section label={LABELS.education}>
            {[...cv.education].sort((a, b) => a.order - b.order).map((edu) => (
              <div key={edu.id} style={s.entryBlock}>
                <div style={s.dateRange}>{fmt(edu.startDate, false, lang)} – {edu.current ? LABELS.current : fmt(edu.endDate, false, lang)}</div>
                <div style={s.bold}>{[edu.degree, edu.field].filter(Boolean).join(", ")}</div>
                <div style={s.italic}>{edu.institution}{edu.location ? `, ${edu.location}` : ""}</div>
                {edu.grade && <div style={{ fontSize: theme.fontSize.small, color: theme.mutedColor }}>{edu.grade}</div>}
              </div>
            ))}
          </Section>
        )}

        {cv.skills.length > 0 && (
          <Section label={LABELS.skills}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px" }}>
              {[...cv.skills].sort((a, b) => a.order - b.order).map((sk) => (
                <span key={sk.id} style={{ fontSize: theme.fontSize.body }}>
                  {sk.name}{sk.level ? ` — ${sk.level}` : ""}
                </span>
              ))}
            </div>
          </Section>
        )}

        {cv.languages.length > 0 && (
          <Section label={LABELS.languages}>
            <table style={s.langTable}>
              <thead>
                <tr>
                  <th style={{ ...s.langTh, textAlign: "left" as const }}>Langue</th>
                  <th style={s.langTh}>{LABELS.listening}</th>
                  <th style={s.langTh}>{LABELS.reading}</th>
                  <th style={s.langTh}>{LABELS.speaking}</th>
                  <th style={s.langTh}>{LABELS.writing}</th>
                </tr>
              </thead>
              <tbody>
                {[...cv.languages].sort((a, b) => a.order - b.order).map((l) => {
                  const level = l.cefrLevel ?? l.level ?? "—";
                  return (
                    <tr key={l.id}>
                      <td style={{ ...s.langTd, textAlign: "left" as const, fontWeight: 600 }}>{l.language}</td>
                      {[level, level, level, level].map((v, i) => (
                        <td key={i} style={s.langTd}>{v}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p style={{ fontSize: "8px", color: theme.mutedColor, marginTop: "3px" }}>
              Niveaux : A1/A2 Élémentaire · B1/B2 Indépendant · C1/C2 Expérimenté
            </p>
          </Section>
        )}

        {cv.certifications.length > 0 && (
          <Section label={LABELS.certs}>
            {[...cv.certifications].sort((a, b) => a.order - b.order).map((c) => (
              <div key={c.id} style={{ marginBottom: "5px", fontSize: theme.fontSize.body }}>
                <span style={{ fontWeight: 600 }}>{c.name}</span>
                {c.issuer && <span style={{ color: theme.mutedColor }}> — {c.issuer}</span>}
                {c.date && <span style={{ color: theme.mutedColor }}>, {c.date}</span>}
              </div>
            ))}
          </Section>
        )}

        {cv.interests.filter(Boolean).length > 0 && (
          <Section label={LABELS.interests}>
            <p style={{ fontSize: theme.fontSize.body }}>{cv.interests.filter(Boolean).join(" · ")}</p>
          </Section>
        )}
      </div>
    </div>
  );
}
