import React from "react";
import type { CVProfile } from "@/types/cv";
import { classicStyle } from "@/lib/styles/classic";
import { isFieldVisible, getPageDimensions } from "@/lib/styles/engine";
import { resolveTheme } from "@/lib/styles/customization";

interface Props {
  cv: CVProfile;
  forPDF?: boolean;
}

const dims = getPageDimensions(classicStyle);

function fullName(cv: CVProfile) {
  return [cv.personal.firstName, cv.personal.lastName].filter(Boolean).join(" ");
}

function formatDate(date: string | null, current?: boolean): string {
  if (current) return "en cours";
  if (!date) return "";
  const [year, month] = date.split("-");
  if (!month) return year;
  const d = new Date(Number(year), Number(month) - 1);
  return d.toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
}

export default function ClassicPreview({ cv, forPDF = false }: Props) {
  const theme = resolveTheme(classicStyle, cv.customization);
  const { personal } = cv;
  const name = fullName(cv);

  const s: Record<string, React.CSSProperties> = {
    page: {
      width: forPDF ? dims.width : "100%",
      minHeight: forPDF ? dims.height : undefined,
      maxWidth: dims.width,
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
      gap: "14px",
      marginBottom: "12px",
      alignItems: "flex-start",
    },
    photo: {
      width: "28mm",
      height: "34mm",
      objectFit: "cover" as const,
      borderRadius: "2px",
      flexShrink: 0,
      border: `1px solid ${theme.borderColor}`,
    },
    photoPlaceholder: {
      width: "28mm",
      height: "34mm",
      flexShrink: 0,
      border: `1px solid ${theme.borderColor}`,
      borderRadius: "2px",
      background: "#f5f5f5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "9px",
      color: theme.mutedColor,
    },
    headerInfo: { flex: 1 },
    name: {
      fontSize: theme.fontSize.name,
      fontWeight: 700,
      color: theme.headingColor,
      marginBottom: "2px",
    },
    headline: {
      fontSize: "11px",
      color: theme.mutedColor,
      marginBottom: "6px",
    },
    personalDetails: {
      fontSize: theme.fontSize.small,
      color: theme.mutedColor,
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "2px 12px",
    },
    divider: {
      border: "none",
      borderTop: `2px solid ${theme.accentColor}`,
      marginBottom: "10px",
    },
    sectionTitle: {
      fontSize: theme.fontSize.heading,
      fontWeight: 700,
      color: theme.headingColor,
      textTransform: "uppercase" as const,
      letterSpacing: "0.6px",
      borderBottom: `1px solid ${theme.borderColor}`,
      paddingBottom: "3px",
      marginBottom: "8px",
    },
    section: { marginBottom: theme.sectionSpacing },
    entryHeader: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "1px",
    },
    bold: { fontWeight: 600, color: theme.headingColor, fontSize: "10.5px" },
    date: { fontSize: theme.fontSize.small, color: theme.mutedColor, whiteSpace: "nowrap" as const, marginLeft: "8px" },
    italic: { fontSize: "10px", fontStyle: "italic", color: theme.mutedColor, marginBottom: "3px" },
    bullet: { display: "flex", gap: "5px", marginBottom: "2px", fontSize: theme.fontSize.body },
    bulletDot: { flexShrink: 0, color: theme.accentColor },
  };

  const hasExp = cv.experience.length > 0;
  const hasEdu = cv.education.length > 0;
  const hasSkills = cv.skills.length > 0;
  const hasLangs = cv.languages.length > 0;
  const hasCerts = cv.certifications.length > 0;
  const hasProjects = cv.projects.length > 0;
  const hasVolunteering = cv.volunteering.length > 0;
  const hasInterests = cv.interests.length > 0;
  const showPhoto = isFieldVisible("personal.photo", classicStyle);

  return (
    <div style={s.page} data-cv-page>
      {/* Header with photo */}
      <div style={s.header}>
        {showPhoto && (
          personal.photoKey
            ? <img
                src={personal.photoKey.startsWith("data:") ? personal.photoKey : `/api/photo/${personal.photoKey}`}
                alt={name}
                style={s.photo}
              />
            : <div style={s.photoPlaceholder}>Photo</div>
        )}
        <div style={s.headerInfo}>
          {name && <div style={s.name}>{name}</div>}
          {personal.headline && <div style={s.headline}>{personal.headline}</div>}

          <div style={s.personalDetails}>
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>{personal.phoneCountryCode} {personal.phone}</span>}
            {(personal.city || personal.country) && (
              <span>{[personal.city, personal.country].filter(Boolean).join(", ")}</span>
            )}
            {personal.linkedin && <span>{personal.linkedin}</span>}
            {isFieldVisible("personal.dateOfBirth", classicStyle) && personal.dateOfBirth && (
              <span>Né(e) le {new Date(personal.dateOfBirth).toLocaleDateString("fr-FR")}</span>
            )}
            {isFieldVisible("personal.nationality", classicStyle) && personal.nationality && (
              <span>Nationalité : {personal.nationality}</span>
            )}
            {isFieldVisible("personal.maritalStatus", classicStyle) && personal.maritalStatus && (
              <span>Situation : {personal.maritalStatus}</span>
            )}
            {isFieldVisible("personal.drivingLicense", classicStyle) && personal.drivingLicense.length > 0 && (
              <span>Permis : {personal.drivingLicense.join(", ")}</span>
            )}
          </div>
        </div>
      </div>

      <hr style={s.divider} />

      {cv.summary && (
        <div style={s.section}>
          <div style={s.sectionTitle}>Profil</div>
          <div style={{ fontSize: theme.fontSize.body, lineHeight: 1.55 }}>{cv.summary}</div>
        </div>
      )}

      {/* Education first (French/Moroccan convention for young graduates) */}
      {hasEdu && (
        <div style={s.section}>
          <div style={s.sectionTitle}>Formation</div>
          {[...cv.education].sort((a, b) => a.order - b.order).map((edu) => (
            <div key={edu.id} style={{ marginBottom: "7px" }}>
              <div style={s.entryHeader}>
                <span style={s.bold}>{[edu.degree, edu.field].filter(Boolean).join(", ")}</span>
                <span style={s.date}>{formatDate(edu.startDate)} – {edu.current ? "en cours" : formatDate(edu.endDate)}</span>
              </div>
              <div style={s.italic}>{edu.institution}{edu.location ? ` · ${edu.location}` : ""}</div>
              {edu.grade && <div style={{ fontSize: theme.fontSize.small, color: theme.mutedColor }}>{edu.grade}</div>}
            </div>
          ))}
        </div>
      )}

      {hasExp && (
        <div style={s.section}>
          <div style={s.sectionTitle}>Expérience professionnelle</div>
          {[...cv.experience].sort((a, b) => a.order - b.order).map((exp) => (
            <div key={exp.id} style={{ marginBottom: "9px" }}>
              <div style={s.entryHeader}>
                <span style={s.bold}>{exp.position}</span>
                <span style={s.date}>{formatDate(exp.startDate)} – {exp.current ? "en cours" : formatDate(exp.endDate)}</span>
              </div>
              <div style={s.italic}>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</div>
              {exp.bullets.map((b, i) => (
                <div key={i} style={s.bullet}>
                  <span style={s.bulletDot}>•</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {hasSkills && (
        <div style={s.section}>
          <div style={s.sectionTitle}>Compétences</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px" }}>
            {[...cv.skills].sort((a, b) => a.order - b.order).map((sk) => (
              <span key={sk.id} style={{ fontSize: theme.fontSize.body }}>
                {sk.name}{sk.level ? ` : ${sk.level}` : ""}
              </span>
            ))}
          </div>
        </div>
      )}

      {hasLangs && (
        <div style={s.section}>
          <div style={s.sectionTitle}>Langues</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px" }}>
            {[...cv.languages].sort((a, b) => a.order - b.order).map((l) => (
              <span key={l.id} style={{ fontSize: theme.fontSize.body }}>
                {l.language}{l.cefrLevel ? ` (${l.cefrLevel})` : l.level ? ` (${l.level})` : ""}
              </span>
            ))}
          </div>
        </div>
      )}

      {hasCerts && (
        <div style={s.section}>
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
        </div>
      )}

      {hasInterests && (
        <div style={s.section}>
          <div style={s.sectionTitle}>Centres d'intérêt</div>
          <div style={{ fontSize: theme.fontSize.body }}>
            {cv.interests.filter(Boolean).join(" · ")}
          </div>
        </div>
      )}
    </div>
  );
}
