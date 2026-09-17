import React from "react";
import type { CVProfile } from "@/types/cv";
import { atsStyle } from "@/lib/styles/ats";
import { getPageDimensions } from "@/lib/styles/engine";
import { resolveTheme } from "@/lib/styles/customization";

interface Props { cv: CVProfile; forPDF?: boolean; }

const dims = getPageDimensions(atsStyle);

function fullName(cv: CVProfile) {
  return [cv.personal.firstName, cv.personal.lastName].filter(Boolean).join(" ");
}

function formatDate(date: string | null, current?: boolean): string {
  if (current) return "Present";
  if (!date) return "";
  const [year, month] = date.split("-");
  return month ? `${month}/${year}` : year;
}

export default function ATSPreview({ cv, forPDF = false }: Props) {
  const theme = resolveTheme(atsStyle, cv.customization);
  const { personal } = cv;

  const contact = [
    personal.email,
    personal.phone ? `${personal.phoneCountryCode} ${personal.phone}` : "",
    personal.city && personal.country ? `${personal.city}, ${personal.country}` : personal.city || personal.country,
    personal.linkedin,
    personal.website,
  ].filter(Boolean).join(" | ");

  const s: Record<string, React.CSSProperties> = {
    page: {
      width: forPDF ? dims.width : "100%",
      maxWidth: dims.width,
      minHeight: forPDF ? dims.height : undefined,
      margin: "0 auto",
      padding: theme.pagePadding,
      backgroundColor: "#fff",
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSize.body,
      color: theme.bodyColor,
      lineHeight: theme.lineHeight,
      boxSizing: "border-box" as const,
    },
    name: {
      fontSize: theme.fontSize.name,
      fontWeight: 700,
      textAlign: "center" as const,
      marginBottom: "2px",
    },
    headline: {
      fontSize: "11px",
      textAlign: "center" as const,
      color: theme.mutedColor,
      marginBottom: "4px",
    },
    contact: {
      fontSize: theme.fontSize.small,
      textAlign: "center" as const,
      color: theme.mutedColor,
      marginBottom: "14px",
    },
    sectionTitle: {
      fontSize: theme.fontSize.heading,
      fontWeight: 700,
      textTransform: "uppercase" as const,
      letterSpacing: "1px",
      borderBottom: `1.5px solid ${theme.borderColor}`,
      paddingBottom: "2px",
      marginBottom: "8px",
      marginTop: "12px",
    },
    entryRow: { marginBottom: "8px" },
    entryHeader: {
      display: "flex",
      justifyContent: "space-between",
      fontWeight: 700,
      fontSize: "10.5px",
    },
    subline: { fontSize: "10px", color: theme.mutedColor, marginBottom: "3px" },
    bullet: { marginLeft: "16px", marginBottom: "2px", fontSize: theme.fontSize.body, listStyle: "disc" },
  };

  return (
    <div style={s.page} data-cv-page>
      {fullName(cv) && <div style={s.name}>{fullName(cv)}</div>}
      {personal.headline && <div style={s.headline}>{personal.headline}</div>}
      {contact && <div style={s.contact}>{contact}</div>}

      {cv.summary && (
        <>
          <div style={s.sectionTitle}>Summary</div>
          <p style={{ fontSize: theme.fontSize.body, lineHeight: 1.5 }}>{cv.summary}</p>
        </>
      )}

      {cv.experience.length > 0 && (
        <>
          <div style={s.sectionTitle}>Experience</div>
          {[...cv.experience].sort((a, b) => a.order - b.order).map((exp) => (
            <div key={exp.id} style={s.entryRow}>
              <div style={s.entryHeader}>
                <span>{exp.position} — {exp.company}</span>
                <span>{formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}</span>
              </div>
              {exp.location && <div style={s.subline}>{exp.location}</div>}
              <ul>
                {exp.bullets.filter(Boolean).map((b, i) => (
                  <li key={i} style={s.bullet}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}

      {cv.education.length > 0 && (
        <>
          <div style={s.sectionTitle}>Education</div>
          {[...cv.education].sort((a, b) => a.order - b.order).map((edu) => (
            <div key={edu.id} style={s.entryRow}>
              <div style={s.entryHeader}>
                <span>{[edu.degree, edu.field].filter(Boolean).join(", ")} — {edu.institution}</span>
                <span>{formatDate(edu.startDate)} – {edu.current ? "Present" : formatDate(edu.endDate)}</span>
              </div>
              {edu.grade && <div style={s.subline}>{edu.grade}</div>}
            </div>
          ))}
        </>
      )}

      {cv.skills.length > 0 && (
        <>
          <div style={s.sectionTitle}>Skills</div>
          <p style={{ fontSize: theme.fontSize.body }}>
            {[...cv.skills].sort((a, b) => a.order - b.order).map((sk) => sk.name).join(", ")}
          </p>
        </>
      )}

      {cv.certifications.length > 0 && (
        <>
          <div style={s.sectionTitle}>Certifications</div>
          {[...cv.certifications].sort((a, b) => a.order - b.order).map((c) => (
            <div key={c.id} style={s.entryRow}>
              <div style={s.entryHeader}>
                <span>{c.name} — {c.issuer}</span>
                {c.date && <span>{c.date}</span>}
              </div>
            </div>
          ))}
        </>
      )}

      {cv.projects.length > 0 && (
        <>
          <div style={s.sectionTitle}>Projects</div>
          {[...cv.projects].sort((a, b) => a.order - b.order).map((p) => (
            <div key={p.id} style={s.entryRow}>
              <div style={s.entryHeader}>
                <span>{p.name}</span>
                {p.startDate && <span>{formatDate(p.startDate)} – {p.current ? "Present" : formatDate(p.endDate)}</span>}
              </div>
              {p.technologies.length > 0 && <div style={s.subline}>{p.technologies.join(", ")}</div>}
              {p.description && <p style={{ fontSize: theme.fontSize.body }}>{p.description}</p>}
            </div>
          ))}
        </>
      )}

      {cv.languages.length > 0 && (
        <>
          <div style={s.sectionTitle}>Languages</div>
          <p style={{ fontSize: theme.fontSize.body }}>
            {[...cv.languages].sort((a, b) => a.order - b.order)
              .map((l) => `${l.language}${l.cefrLevel ? ` (${l.cefrLevel})` : l.level ? ` (${l.level})` : ""}`)
              .join(", ")}
          </p>
        </>
      )}

      {cv.volunteering.length > 0 && (
        <>
          <div style={s.sectionTitle}>Volunteering</div>
          {[...cv.volunteering].sort((a, b) => a.order - b.order).map((v) => (
            <div key={v.id} style={s.entryRow}>
              <div style={s.entryHeader}>
                <span>{v.role} — {v.organization}</span>
                <span>{formatDate(v.startDate)} – {v.current ? "Present" : formatDate(v.endDate)}</span>
              </div>
              {v.description && <p style={{ fontSize: theme.fontSize.body }}>{v.description}</p>}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
