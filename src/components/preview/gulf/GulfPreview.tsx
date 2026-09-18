import React from "react";
import type { CVProfile } from "@/types/cv";
import { gulfStyle } from "@/lib/styles/gulf";
import { isFieldVisible, getPageDimensions } from "@/lib/styles/engine";
import { resolveTheme, getSectionTitleStyle } from "@/lib/styles/customization";

interface Props { cv: CVProfile; forPDF?: boolean; }

const dims = getPageDimensions(gulfStyle);

function fmt(date: string | null, current?: boolean): string {
  if (current) return "Present";
  if (!date) return "";
  const [year, month] = date.split("-");
  if (!month) return year;
  const d = new Date(Number(year), Number(month) - 1);
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export default function GulfPreview({ cv, forPDF = false }: Props) {
  const theme = resolveTheme(gulfStyle, cv.customization);
  const { personal } = cv;
  const name = [personal.firstName, personal.lastName].filter(Boolean).join(" ");
  const showPhoto = isFieldVisible("personal.photo", gulfStyle) && personal.photoKey;
  const photoSrc = personal.photoKey?.startsWith("data:")
    ? personal.photoKey
    : personal.photoKey ? `/api/photo/${personal.photoKey}` : null;

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
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "10px",
      paddingBottom: "10px",
      borderBottom: `2px solid ${theme.accentColor}`,
    },
    headerLeft: { flex: 1 },
    name: { fontSize: theme.fontSize.name, fontWeight: 700, color: theme.headingColor, marginBottom: "3px" },
    headline: { fontSize: "11px", color: theme.accentColor, marginBottom: "6px", fontWeight: 600 },
    detailsGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "3px 20px",
      fontSize: theme.fontSize.small,
      color: theme.mutedColor,
    },
    photo: {
      width: "28mm",
      height: "34mm",
      objectFit: "cover" as const,
      border: `2px solid ${theme.borderColor}`,
      flexShrink: 0,
      marginLeft: "12px",
    },
    photoPH: {
      width: "28mm",
      height: "34mm",
      flexShrink: 0,
      marginLeft: "12px",
      border: `2px solid ${theme.borderColor}`,
      background: "#f9f5f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "9px",
      color: theme.mutedColor,
    },
    sectionTitle: {
      ...getSectionTitleStyle(theme),
      marginTop: "10px",
    } as React.CSSProperties,
    entryHeader: { display: "flex", justifyContent: "space-between", marginBottom: "1px" },
    bold: { fontWeight: 700, fontSize: "10.5px", color: theme.headingColor },
    date: { fontSize: theme.fontSize.small, color: theme.mutedColor, whiteSpace: "nowrap" as const, marginLeft: "8px" },
    italic: { fontStyle: "italic", color: theme.mutedColor, fontSize: "10px", marginBottom: "3px" },
    bullet: { display: "flex", gap: "5px", marginBottom: "2px" },
    bulletDot: { color: theme.accentColor, flexShrink: 0 },
  };

  const photoEl = showPhoto && photoSrc
    ? <img src={photoSrc} alt={name} style={s.photo} />
    : showPhoto ? <div style={s.photoPH}>Photo</div> : null;

  return (
    <div style={s.page} data-cv-page>
      <div style={s.header}>
        <div style={s.headerLeft}>
          {name && <div style={s.name}>{name}</div>}
          {personal.headline && <div style={s.headline}>{personal.headline}</div>}
          <div style={s.detailsGrid}>
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>{personal.phoneCountryCode} {personal.phone}</span>}
            {(personal.city || personal.country) && <span>{[personal.city, personal.country].filter(Boolean).join(", ")}</span>}
            {personal.linkedin && <span>{personal.linkedin}</span>}
            {isFieldVisible("personal.nationality", gulfStyle) && personal.nationality && (
              <span>Nationality: {personal.nationality}</span>
            )}
            {isFieldVisible("personal.visaStatus", gulfStyle) && personal.visaStatus && (
              <span>Visa: {personal.visaStatus}</span>
            )}
            {isFieldVisible("personal.dateOfBirth", gulfStyle) && personal.dateOfBirth && (
              <span>DOB: {new Date(personal.dateOfBirth).toLocaleDateString("en-GB")}</span>
            )}
            {isFieldVisible("personal.maritalStatus", gulfStyle) && personal.maritalStatus && (
              <span>Status: {personal.maritalStatus}</span>
            )}
            {isFieldVisible("personal.drivingLicense", gulfStyle) && personal.drivingLicense.length > 0 && (
              <span>Driving: {personal.drivingLicense.join(", ")}</span>
            )}
          </div>
        </div>
        {photoEl}
      </div>

      {cv.summary && (
        <>
          <div style={s.sectionTitle}>Objective</div>
          <p style={{ fontSize: theme.fontSize.body, lineHeight: 1.55 }}>{cv.summary}</p>
        </>
      )}

      {cv.experience.length > 0 && (
        <>
          <div style={s.sectionTitle}>Professional Experience</div>
          {[...cv.experience].sort((a, b) => a.order - b.order).map((exp) => (
            <div key={exp.id} style={{ marginBottom: "9px" }}>
              <div style={s.entryHeader}>
                <span style={s.bold}>{exp.position}</span>
                <span style={s.date}>{fmt(exp.startDate)} – {exp.current ? "Present" : fmt(exp.endDate)}</span>
              </div>
              <div style={s.italic}>{exp.company}{exp.location ? ` | ${exp.location}` : ""}</div>
              {exp.bullets.filter(Boolean).map((b, i) => (
                <div key={i} style={s.bullet}>
                  <span style={s.bulletDot}>▸</span><span>{b}</span>
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {cv.education.length > 0 && (
        <>
          <div style={s.sectionTitle}>Education</div>
          {[...cv.education].sort((a, b) => a.order - b.order).map((edu) => (
            <div key={edu.id} style={{ marginBottom: "7px" }}>
              <div style={s.entryHeader}>
                <span style={s.bold}>{[edu.degree, edu.field].filter(Boolean).join(", ")}</span>
                <span style={s.date}>{fmt(edu.startDate)} – {edu.current ? "Present" : fmt(edu.endDate)}</span>
              </div>
              <div style={s.italic}>{edu.institution}{edu.location ? ` | ${edu.location}` : ""}</div>
              {edu.grade && <div style={{ fontSize: theme.fontSize.small, color: theme.mutedColor }}>{edu.grade}</div>}
            </div>
          ))}
        </>
      )}

      {cv.skills.length > 0 && (
        <>
          <div style={s.sectionTitle}>Skills</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px" }}>
            {[...cv.skills].sort((a, b) => a.order - b.order).map((sk) => (
              <span key={sk.id} style={{ fontSize: theme.fontSize.body }}>
                {sk.name}{sk.level ? ` (${sk.level})` : ""}
              </span>
            ))}
          </div>
        </>
      )}

      {cv.languages.length > 0 && (
        <>
          <div style={s.sectionTitle}>Languages</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 20px" }}>
            {[...cv.languages].sort((a, b) => a.order - b.order).map((l) => (
              <span key={l.id} style={{ fontSize: theme.fontSize.body }}>
                {l.language}{l.cefrLevel ? ` — ${l.cefrLevel}` : l.level ? ` — ${l.level}` : ""}
              </span>
            ))}
          </div>
        </>
      )}

      {cv.certifications.length > 0 && (
        <>
          <div style={s.sectionTitle}>Certifications</div>
          {[...cv.certifications].sort((a, b) => a.order - b.order).map((c) => (
            <div key={c.id} style={{ marginBottom: "4px" }}>
              <div style={s.entryHeader}>
                <span style={{ fontWeight: 600, fontSize: "10.5px" }}>{c.name}</span>
                {c.date && <span style={s.date}>{c.date}</span>}
              </div>
              {c.issuer && <div style={s.italic}>{c.issuer}</div>}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
