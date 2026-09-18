import type {
  StyleDefinition,
  StyleTheme,
  CVCustomization,
  DensityOption,
  StyleId,
  SectionTitleStyle,
} from "@/types/cv";

// ── Per-style presets ─────────────────────────────────────────────────────────
// Each preset bundles accent color + heading color + section title decoration.
// Font and density are separate orthogonal controls.

export interface StylePreset {
  id: string;
  name: string;
  accentColor: string;
  headingColor: string;
  sectionTitleStyle: SectionTitleStyle;
}

export const STYLE_PRESETS: Record<StyleId, StylePreset[]> = {
  canadian: [
    { id: "marine",    name: "Marine",   accentColor: "#1A3A5C", headingColor: "#0F2340", sectionTitleStyle: "underline" },
    { id: "executive", name: "Exécutif", accentColor: "#1C1C2E", headingColor: "#111111", sectionTitleStyle: "plain"     },
    { id: "foret",     name: "Forêt",    accentColor: "#2D6A4F", headingColor: "#1A3D29", sectionTitleStyle: "left-bar"  },
    { id: "brique",    name: "Brique",   accentColor: "#8B2500", headingColor: "#5C1800", sectionTitleStyle: "underline" },
  ],
  classic: [
    { id: "bordeaux",  name: "Bordeaux", accentColor: "#7B2D3E", headingColor: "#3D1520", sectionTitleStyle: "underline" },
    { id: "marine",    name: "Marine",   accentColor: "#1A3A5C", headingColor: "#1A3A5C", sectionTitleStyle: "underline" },
    { id: "graphite",  name: "Graphite", accentColor: "#2D2D2D", headingColor: "#111111", sectionTitleStyle: "filled"    },
    { id: "foret",     name: "Forêt",    accentColor: "#2D6A4F", headingColor: "#1A3D29", sectionTitleStyle: "left-bar"  },
  ],
  modern: [
    // headingColor = sidebar background; accentColor = sidebar decorations + main section titles
    { id: "nuit",     name: "Nuit",     accentColor: "#2D6A4F", headingColor: "#1B1B2F", sectionTitleStyle: "underline" },
    { id: "ardoise",  name: "Ardoise",  accentColor: "#5B8DB8", headingColor: "#1E293B", sectionTitleStyle: "underline" },
    { id: "foret",    name: "Forêt",    accentColor: "#4A9E6D", headingColor: "#14432A", sectionTitleStyle: "underline" },
    { id: "graphite", name: "Graphite", accentColor: "#888888", headingColor: "#1A1A1A", sectionTitleStyle: "underline" },
  ],
  europass: [
    { id: "eu",       name: "EU Blue",  accentColor: "#003399", headingColor: "#003399", sectionTitleStyle: "plain" },
    { id: "marine",   name: "Marine",   accentColor: "#1A3A5C", headingColor: "#1A3A5C", sectionTitleStyle: "plain" },
    { id: "graphite", name: "Graphite", accentColor: "#2C3E50", headingColor: "#2C3E50", sectionTitleStyle: "plain" },
    { id: "brique",   name: "Brique",   accentColor: "#8B2500", headingColor: "#8B2500", sectionTitleStyle: "plain" },
  ],
  ats: [
    { id: "neutre",   name: "Neutre",   accentColor: "#000000", headingColor: "#000000", sectionTitleStyle: "plain" },
    { id: "marine",   name: "Marine",   accentColor: "#1A3A5C", headingColor: "#1A3A5C", sectionTitleStyle: "plain" },
    { id: "graphite", name: "Graphite", accentColor: "#333333", headingColor: "#222222", sectionTitleStyle: "plain" },
  ],
  gulf: [
    // headingColor = section title bar background; accentColor = headline + bullets
    { id: "nuit",    name: "Nuit",    accentColor: "#8B5E3C", headingColor: "#1A2E44", sectionTitleStyle: "filled" },
    { id: "acajou",  name: "Acajou",  accentColor: "#C4956A", headingColor: "#4A1520", sectionTitleStyle: "filled" },
    { id: "foret",   name: "Forêt",   accentColor: "#7DBD8A", headingColor: "#1A3D29", sectionTitleStyle: "filled" },
    { id: "or",      name: "Or",      accentColor: "#C9A85C", headingColor: "#1C1A10", sectionTitleStyle: "filled" },
  ],
};

export function getPresetForStyle(styleId: StyleId, presetId?: string): StylePreset {
  const presets = STYLE_PRESETS[styleId];
  return presets.find((p) => p.id === presetId) ?? presets[0];
}

// ── Font presets ──────────────────────────────────────────────────────────────
export const FONT_PRESETS: { key: string; label: string; family: string; arabicFamily: string }[] = [
  { key: "sans",  label: "Sans-serif", family: "'Helvetica Neue', Arial, sans-serif",  arabicFamily: "'Noto Naskh Arabic', serif" },
  { key: "inter", label: "Inter",      family: "'Inter', 'Helvetica Neue', sans-serif", arabicFamily: "'Noto Naskh Arabic', serif" },
  { key: "serif", label: "Lora",       family: "'Lora', Georgia, serif",                arabicFamily: "'Noto Naskh Arabic', serif" },
];

export function getFontPreset(key: string | undefined) {
  return FONT_PRESETS.find((f) => f.key === key) ?? FONT_PRESETS[0];
}

// ── Density ───────────────────────────────────────────────────────────────────
export const DENSITY_OPTIONS: { value: DensityOption; label: string }[] = [
  { value: "compact",  label: "Compact" },
  { value: "normal",   label: "Normal"  },
  { value: "spacious", label: "Aéré"    },
];

// ── Resolved theme ────────────────────────────────────────────────────────────
export interface ResolvedTheme extends StyleTheme {
  pagePadding: string;
  sectionSpacing: string;
  lineHeight: number;
}

export function resolveTheme(
  style: StyleDefinition,
  customization: CVCustomization = {},
): ResolvedTheme {
  const preset = getPresetForStyle(style.id as StyleId, customization.presetId);
  const font = getFontPreset(customization.fontFamily);
  const density = customization.density ?? "normal";

  const densityMap: Record<DensityOption, { padding: string; spacing: string; lineHeight: number }> = {
    compact:  { padding: "12mm 14mm 10mm", spacing: "10px", lineHeight: 1.35 },
    normal:   { padding: "16mm 18mm 14mm", spacing: "14px", lineHeight: 1.45 },
    spacious: { padding: "20mm 20mm 18mm", spacing: "18px", lineHeight: 1.6  },
  };

  const d = densityMap[density];

  return {
    ...style.theme,
    accentColor:      preset.accentColor,
    headingColor:     preset.headingColor,
    sectionTitleStyle: preset.sectionTitleStyle,
    fontFamily:       font.family,
    arabicFontFamily: font.arabicFamily,
    pagePadding:      d.padding,
    sectionSpacing:   d.spacing,
    lineHeight:       d.lineHeight,
  };
}

// ── Section title style helper ─────────────────────────────────────────────────
// Returns inline CSS for section headings based on the active preset's style.
// Renderers spread this object into their sectionTitle style object.
type CSSObject = Record<string, string | number>;

export function getSectionTitleStyle(theme: ResolvedTheme): CSSObject {
  const base: CSSObject = {
    fontSize: theme.fontSize.heading,
    fontWeight: 700,
    letterSpacing: "0.7px",
    marginBottom: "8px",
    textTransform: "uppercase",
  };
  switch (theme.sectionTitleStyle) {
    case "underline":
      return {
        ...base,
        color: theme.accentColor,
        borderBottom: `1.5px solid ${theme.accentColor}`,
        paddingBottom: "3px",
      };
    case "filled":
      return {
        ...base,
        color: "#ffffff",
        backgroundColor: theme.headingColor,
        padding: "3px 8px",
        letterSpacing: "0.5px",
      };
    case "left-bar":
      return {
        ...base,
        color: theme.headingColor,
        borderLeft: `3px solid ${theme.accentColor}`,
        paddingLeft: "8px",
      };
    case "plain":
    default:
      return {
        ...base,
        color: theme.headingColor,
      };
  }
}
