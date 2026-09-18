import React from "react";
import type { CVProfile } from "@/types/cv";
import { isFieldVisible, getPageDimensions } from "@/lib/styles/engine";
import { canadianStyle } from "@/lib/styles/canadian";
import { resolveTheme, getSectionTitleStyle } from "@/lib/styles/customization";

interface Props {
  cv: CVProfile;
  forPDF?: boolean;
}

const dims = getPageDimensions(canadianStyle);

function fullName(cv: CVProfile) {
  return [cv.personal.firstName, cv.personal.lastName].filter(Boolean).join(" ");
}

function formatDate(date: string | null, current?: boolean): string {
  if (current) return "Present";
  if (!date) return "";
  const [year, month] = date.split("-");
  if (!month) return year;
  const d = new Date(Number(year), Number(month) - 1);
  return d.toLocaleDateString("en-CA", { month: "short", year: "numeric" });
}

export default function CanadianPreview({ cv, forPDF = false }: Props) {
  const theme = resolveTheme(canadianStyle, cv.customization);
  const { personal } = cv;
  const name = fullName(cv);

  const contactParts = [
    personal.city && personal.country
      ? `${personal.city}, ${personal.country}`
      : personal.city || personal.country,
    personal.phone ? `${personal.phoneCountryCode} ${personal.phone}` : "",
    personal.email,
    isFieldVisible("personal.linkedin", canadianStyle) && personal.linkedin
      ? personal.linkedin
      : "",
    isFieldVisible("personal.website", canadianStyle) && personal.website
      ? personal.website
      : "",
  ].filter(Boolean);

  const styles: Record<string, React.CSSProperties> = {
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
    name: {
      fontSize: theme.fontSize.name,
      fontWeight: 700,
      color: theme.headingColor,
      letterSpacing: "-0.3px",
      marginBottom: "3px",
    },
    headline: {
      fontSize: "11px",
      color: theme.mutedColor,
      marginBottom: "6px",
    },
    contactLine: {
      fontSize: theme.fontSize.small,
      color: theme.mutedColor,
      display: "flex",
      flexWrap: "wrap" as const,
      gap: "6px",
      marginBottom: "14px",
    },
    divider: {
      border: "none",
      borderTop: `1.5px solid ${theme.accentColor}`,
      marginBottom: "10px",
    },
    sectionTitle: getSectionTitleStyle(theme) as React.CSSProperties,
    section: {
      marginBottom: theme.sectionSpacing,
    },
    entryHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "1px",
    },
    companyName: {
      fontWeight: 600,
      color: theme.headingColor,
      fontSize: "10.5px",
    },
    dateRange: {
      fontSize: theme.fontSize.small,
      color: theme.mutedColor,
      whiteSpace: "nowrap" as const,
      marginLeft: "8px",
    },
    position: {
      fontSize: theme.fontSize.body,
      fontStyle: "italic",
      color: theme.mutedColor,
      marginBottom: "4px",
    },
    bullet: {
      display: "flex",
      gap: "5px",
      marginBottom: "2px",
      fontSize: theme.fontSize.body,
    },
    bulletDot: {
      flexShrink: 0,
      marginTop: "1px",
      color: theme.accentColor,
    },
    skillsGrid: {
      display: "flex",
      flexWrap: "wrap" as const,
      gap: "4px 16px",
    },
    skillItem: {
      fontSize: theme.fontSize.body,
    },
    summaryText: {
      fontSize: theme.fontSize.body,
      lineHeight: 1.55,
    },
  };

  const hasExperience = cv.experience.length > 0;
  const hasEducation = cv.education.length > 0;
  const hasSkills = cv.skills.length > 0;
  const hasLanguages = cv.languages.length > 0;
  const hasCerts = cv.certifications.length > 0;
  const hasProjects = cv.projects.length > 0;
  const hasVolunteering = cv.volunteering.length > 0;

  return (
    <div style={styles.page} data-cv-page>
      {/* Header */}
      <div>
        {name && <div style={styles.name}>{name}</div>}
        {personal.headline && <div style={styles.headline}>{personal.headline}</div>}
        {contactParts.length > 0 && (
          <div style={styles.contactLine}>
            {contactParts.map((part, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span style={{ color: theme.borderColor }}>·</span>}
                <span>{part}</span>
              </React.Fragment>
            ))}
          </div>
        )}
        <hr style={styles.divider} />
      </div>

      {/* Summary */}
      {cv.summary && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Summary</div>
          <div style={styles.summaryText}>{cv.summary}</div>
        </div>
      )}

      {/* Experience */}
      {hasExperience && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Experience</div>
          {[...cv.experience]
            .sort((a, b) => a.order - b.order)
            .map((exp) => (
              <div key={exp.id} style={{ marginBottom: "10px" }}>
                <div style={styles.entryHeader}>
                  <span style={styles.companyName}>{exp.company}</span>
                  <span style={styles.dateRange}>
                    {formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}
                  </span>
                </div>
                <div style={styles.position}>
                  {exp.position}
                  {exp.location ? ` · ${exp.location}` : ""}
                </div>
                {exp.bullets.map((bullet, i) => (
                  <div key={i} style={styles.bullet}>
                    <span style={styles.bulletDot}>▸</span>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            ))}
        </div>
      )}

      {/* Education */}
      {hasEducation && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Education</div>
          {[...cv.education]
            .sort((a, b) => a.order - b.order)
            .map((edu) => (
              <div key={edu.id} style={{ marginBottom: "8px" }}>
                <div style={styles.entryHeader}>
                  <span style={styles.companyName}>{edu.institution}</span>
                  <span style={styles.dateRange}>
                    {formatDate(edu.startDate)} – {edu.current ? "Present" : formatDate(edu.endDate)}
                  </span>
                </div>
                <div style={styles.position}>
                  {[edu.degree, edu.field].filter(Boolean).join(", ")}
                  {edu.location ? ` · ${edu.location}` : ""}
                </div>
                {edu.grade && (
                  <div style={{ fontSize: theme.fontSize.small, color: theme.mutedColor }}>
                    {edu.grade}
                  </div>
                )}
                {edu.notes && (
                  <div style={{ fontSize: theme.fontSize.small, color: theme.mutedColor }}>
                    {edu.notes}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Skills */}
      {hasSkills && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Skills</div>
          <div style={styles.skillsGrid}>
            {[...cv.skills]
              .sort((a, b) => a.order - b.order)
              .map((skill) => (
                <span key={skill.id} style={styles.skillItem}>
                  {skill.name}
                  {skill.level ? ` (${skill.level})` : ""}
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {hasCerts && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Certifications</div>
          {[...cv.certifications]
            .sort((a, b) => a.order - b.order)
            .map((cert) => (
              <div key={cert.id} style={{ marginBottom: "4px" }}>
                <div style={styles.entryHeader}>
                  <span style={{ fontWeight: 600, fontSize: "10.5px" }}>{cert.name}</span>
                  {cert.date && <span style={styles.dateRange}>{cert.date}</span>}
                </div>
                {cert.issuer && (
                  <div style={{ fontSize: theme.fontSize.small, color: theme.mutedColor }}>
                    {cert.issuer}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Projects */}
      {hasProjects && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Projects</div>
          {[...cv.projects]
            .sort((a, b) => a.order - b.order)
            .map((proj) => (
              <div key={proj.id} style={{ marginBottom: "6px" }}>
                <div style={styles.entryHeader}>
                  <span style={{ fontWeight: 600, fontSize: "10.5px" }}>{proj.name}</span>
                  {(proj.startDate || proj.current) && (
                    <span style={styles.dateRange}>
                      {formatDate(proj.startDate)} – {proj.current ? "Present" : formatDate(proj.endDate)}
                    </span>
                  )}
                </div>
                {proj.technologies.length > 0 && (
                  <div style={{ fontSize: theme.fontSize.small, color: theme.mutedColor, marginBottom: "2px" }}>
                    {proj.technologies.join(", ")}
                  </div>
                )}
                {proj.description && <div style={{ fontSize: theme.fontSize.body }}>{proj.description}</div>}
              </div>
            ))}
        </div>
      )}

      {/* Volunteering */}
      {hasVolunteering && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Volunteering</div>
          {[...cv.volunteering]
            .sort((a, b) => a.order - b.order)
            .map((vol) => (
              <div key={vol.id} style={{ marginBottom: "6px" }}>
                <div style={styles.entryHeader}>
                  <span style={styles.companyName}>{vol.organization}</span>
                  <span style={styles.dateRange}>
                    {formatDate(vol.startDate)} – {vol.current ? "Present" : formatDate(vol.endDate)}
                  </span>
                </div>
                <div style={styles.position}>{vol.role}</div>
                {vol.description && <div style={{ fontSize: theme.fontSize.body }}>{vol.description}</div>}
              </div>
            ))}
        </div>
      )}

      {/* Languages */}
      {hasLanguages && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Languages</div>
          <div style={styles.skillsGrid}>
            {[...cv.languages]
              .sort((a, b) => a.order - b.order)
              .map((lang) => (
                <span key={lang.id} style={styles.skillItem}>
                  {lang.language}
                  {lang.cefrLevel ? ` (${lang.cefrLevel})` : lang.level ? ` (${lang.level})` : ""}
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
