import React from "react";
import type { CVProfile } from "@/types/cv";
import { modernStyle } from "@/lib/styles/modern";
import { isFieldVisible, getPageDimensions } from "@/lib/styles/engine";
import { resolveTheme, getSectionTitleStyle } from "@/lib/styles/customization";

interface Props { cv: CVProfile; forPDF?: boolean; }

const dims = getPageDimensions(modernStyle);
const SIDEBAR_W = "68mm";

function fmt(date: string | null, current?: boolean): string {
  if (current) return "présent";
  if (!date) return "";
  const [year, month] = date.split("-");
  if (!month) return year;
  const d = new Date(Number(year), Number(month) - 1);
  return d.toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
}

export default function ModernPreview({ cv, forPDF = false }: Props) {
  const theme = resolveTheme(modernStyle, cv.customization);
  const { personal } = cv;
  const name = [personal.firstName, personal.lastName].filter(Boolean).join(" ");
  const showPhoto = isFieldVisible("personal.photo", modernStyle) && personal.photoKey;
  const photoSrc = personal.photoKey?.startsWith("data:")
    ? personal.photoKey
    : personal.photoKey ? `/api/photo/${personal.photoKey}` : null;

  const sidebar: React.CSSProperties = {
    width: SIDEBAR_W,
    flexShrink: 0,
    backgroundColor: theme.headingColor,
    color: "#fff",
    padding: "10mm 8mm",
    boxSizing: "border-box" as const,
    minHeight: forPDF ? dims.height : undefined,
  };

  const main: React.CSSProperties = {
    flex: 1,
    padding: "10mm 10mm 10mm 10mm",
    boxSizing: "border-box" as const,
  };

  const sideSection: React.CSSProperties = { marginBottom: "10px" };

  const sideTitle: React.CSSProperties = {
    fontSize: "8px",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "1.2px",
    color: theme.accentColor,
    marginBottom: "6px",
    borderBottom: `1px solid ${theme.accentColor}`,
    paddingBottom: "3px",
  };

  const mainSectionTitle: React.CSSProperties = {
    ...getSectionTitleStyle(theme),
    marginTop: "12px",
  };

  const entryTitle: React.CSSProperties = {
    fontWeight: 700,
    fontSize: "10.5px",
    color: theme.headingColor,
  };

  const entryMeta: React.CSSProperties = {
    fontSize: "9px",
    color: theme.mutedColor,
    marginBottom: "3px",
  };

  const bulletStyle: React.CSSProperties = {
    display: "flex",
    gap: "5px",
    marginBottom: "2px",
    fontSize: "9.5px",
    color: "#333",
  };

  return (
    <div
      style={{
        width: forPDF ? dims.width : "100%",
        maxWidth: dims.width,
        minHeight: forPDF ? dims.height : undefined,
        margin: "0 auto",
        display: "flex",
        backgroundColor: "#fff",
        fontFamily: theme.fontFamily,
        fontSize: theme.fontSize.body,
        lineHeight: theme.lineHeight,
        boxSizing: "border-box" as const,
      }}
      data-cv-page
    >
      {/* ── Sidebar ── */}
      <div style={sidebar}>
        {/* Photo */}
        {showPhoto && photoSrc && (
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <img
              src={photoSrc}
              alt={name}
              style={{ width: "36mm", height: "36mm", borderRadius: "50%", objectFit: "cover", border: `3px solid ${theme.accentColor}` }}
            />
          </div>
        )}

        {/* Name + headline in sidebar */}
        {name && (
          <div style={{ marginBottom: "10px", borderBottom: `1px solid ${theme.accentColor}`, paddingBottom: "8px" }}>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: "3px" }}>
              {name}
            </div>
            {personal.headline && (
              <div style={{ fontSize: "9px", color: theme.accentColor, fontWeight: 600 }}>
                {personal.headline}
              </div>
            )}
          </div>
        )}

        {/* Contact */}
        <div style={sideSection}>
          <div style={sideTitle}>Contact</div>
          {[
            personal.email,
            personal.phone ? `${personal.phoneCountryCode} ${personal.phone}` : "",
            [personal.city, personal.country].filter(Boolean).join(", "),
            personal.linkedin,
            personal.website,
          ].filter(Boolean).map((item, i) => (
            <div key={i} style={{ fontSize: "8.5px", color: "#ccc", marginBottom: "2px", wordBreak: "break-all" as const }}>
              {item}
            </div>
          ))}
        </div>

        {/* Skills */}
        {cv.skills.length > 0 && (
          <div style={sideSection}>
            <div style={sideTitle}>Compétences</div>
            {[...cv.skills].sort((a, b) => a.order - b.order).map((sk) => (
              <div key={sk.id} style={{ marginBottom: "5px" }}>
                <div style={{ fontSize: "9px", color: "#e5e5e5", fontWeight: 600 }}>{sk.name}</div>
                {sk.level && (
                  <div style={{ height: "3px", background: "rgba(255,255,255,0.15)", borderRadius: "2px", marginTop: "2px" }}>
                    <div style={{
                      height: "3px",
                      borderRadius: "2px",
                      background: theme.accentColor,
                      width: sk.level.toLowerCase().includes("expert") || sk.level.toLowerCase().includes("avancé") || sk.level.toLowerCase().includes("advanced") ? "90%"
                        : sk.level.toLowerCase().includes("inter") ? "65%"
                        : sk.level.toLowerCase().includes("déb") || sk.level.toLowerCase().includes("beg") ? "30%"
                        : "75%",
                    }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {cv.languages.length > 0 && (
          <div style={sideSection}>
            <div style={sideTitle}>Langues</div>
            {[...cv.languages].sort((a, b) => a.order - b.order).map((l) => (
              <div key={l.id} style={{ marginBottom: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "9px", color: "#e5e5e5", fontWeight: 600 }}>{l.language}</span>
                  <span style={{ fontSize: "8px", color: theme.accentColor }}>{l.cefrLevel ?? l.level}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {cv.certifications.length > 0 && (
          <div style={sideSection}>
            <div style={sideTitle}>Certifications</div>
            {[...cv.certifications].sort((a, b) => a.order - b.order).map((c) => (
              <div key={c.id} style={{ marginBottom: "4px", fontSize: "8.5px", color: "#ccc" }}>
                <div style={{ fontWeight: 600, color: "#e5e5e5" }}>{c.name}</div>
                {c.issuer && <div>{c.issuer}{c.date ? `, ${c.date}` : ""}</div>}
              </div>
            ))}
          </div>
        )}

        {cv.interests.filter(Boolean).length > 0 && (
          <div style={sideSection}>
            <div style={sideTitle}>Intérêts</div>
            <div style={{ fontSize: "8.5px", color: "#ccc" }}>
              {cv.interests.filter(Boolean).join(" · ")}
            </div>
          </div>
        )}
      </div>

      {/* ── Main ── */}
      <div style={main}>
        {cv.summary && (
          <>
            <div style={{ ...mainSectionTitle, marginTop: 0 }}>Profil</div>
            <p style={{ fontSize: "9.5px", lineHeight: 1.6, color: "#444" }}>{cv.summary}</p>
          </>
        )}

        {cv.experience.length > 0 && (
          <>
            <div style={mainSectionTitle}>Expérience</div>
            {[...cv.experience].sort((a, b) => a.order - b.order).map((exp) => (
              <div key={exp.id} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={entryTitle}>{exp.position}</div>
                  <div style={{ fontSize: "8px", color: theme.mutedColor, whiteSpace: "nowrap" as const, marginLeft: "6px" }}>
                    {fmt(exp.startDate)} – {exp.current ? "présent" : fmt(exp.endDate)}
                  </div>
                </div>
                <div style={entryMeta}>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</div>
                {exp.bullets.filter(Boolean).map((b, i) => (
                  <div key={i} style={bulletStyle}>
                    <span style={{ color: theme.accentColor, flexShrink: 0 }}>▸</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            ))}
          </>
        )}

        {cv.education.length > 0 && (
          <>
            <div style={mainSectionTitle}>Formation</div>
            {[...cv.education].sort((a, b) => a.order - b.order).map((edu) => (
              <div key={edu.id} style={{ marginBottom: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={entryTitle}>{[edu.degree, edu.field].filter(Boolean).join(", ")}</div>
                  <div style={{ fontSize: "8px", color: theme.mutedColor, whiteSpace: "nowrap" as const, marginLeft: "6px" }}>
                    {fmt(edu.startDate)} – {edu.current ? "présent" : fmt(edu.endDate)}
                  </div>
                </div>
                <div style={entryMeta}>{edu.institution}{edu.location ? ` · ${edu.location}` : ""}</div>
                {edu.grade && <div style={{ fontSize: "9px", color: theme.mutedColor }}>{edu.grade}</div>}
              </div>
            ))}
          </>
        )}

        {cv.projects.length > 0 && (
          <>
            <div style={mainSectionTitle}>Projets</div>
            {[...cv.projects].sort((a, b) => a.order - b.order).map((p) => (
              <div key={p.id} style={{ marginBottom: "8px" }}>
                <div style={entryTitle}>{p.name}</div>
                {p.technologies.length > 0 && (
                  <div style={{ fontSize: "8.5px", color: theme.accentColor, marginBottom: "2px" }}>
                    {p.technologies.join(" · ")}
                  </div>
                )}
                {p.description && <div style={{ fontSize: "9.5px", color: "#444" }}>{p.description}</div>}
              </div>
            ))}
          </>
        )}

        {cv.volunteering.length > 0 && (
          <>
            <div style={mainSectionTitle}>Bénévolat</div>
            {[...cv.volunteering].sort((a, b) => a.order - b.order).map((v) => (
              <div key={v.id} style={{ marginBottom: "7px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={entryTitle}>{v.role} — {v.organization}</div>
                  <div style={{ fontSize: "8px", color: theme.mutedColor, marginLeft: "6px" }}>
                    {fmt(v.startDate)} – {v.current ? "présent" : fmt(v.endDate)}
                  </div>
                </div>
                {v.description && <div style={{ fontSize: "9.5px", color: "#444", marginTop: "2px" }}>{v.description}</div>}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
