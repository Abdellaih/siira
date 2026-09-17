import type { StyleDefinition, StyleTheme, CVCustomization, DensityOption } from "@/types/cv";

// ── Color presets ─────────────────────────────────────────────────────────────
// 8 curated colors. No free-form input — every choice looks professional.
export const COLOR_PRESETS: { label: string; value: string }[] = [
  { label: "Marine",      value: "#1A3A5C" },
  { label: "Ardoise",     value: "#2C3E50" },
  { label: "Forêt",       value: "#2D6A4F" },
  { label: "Bordeaux",    value: "#7B2D3E" },
  { label: "Encre",       value: "#1A1A2E" },
  { label: "Terracotta",  value: "#B83D10" },
  { label: "Saphir",      value: "#1A3A8F" },
  { label: "Brun",        value: "#6B4226" },
];

// ── Font presets ──────────────────────────────────────────────────────────────
// 3 options — each pair (Latin + Arabic) is loaded or system-available.
export const FONT_PRESETS: { key: string; label: string; family: string; arabicFamily: string }[] = [
  {
    key: "sans",
    label: "Sans-serif",
    family: "'Helvetica Neue', Arial, sans-serif",
    arabicFamily: "'Noto Naskh Arabic', serif",
  },
  {
    key: "inter",
    label: "Inter",
    family: "'Inter', 'Helvetica Neue', sans-serif",
    arabicFamily: "'Noto Naskh Arabic', serif",
  },
  {
    key: "serif",
    label: "Lora",
    family: "'Lora', Georgia, serif",
    arabicFamily: "'Noto Naskh Arabic', serif",
  },
];

export function getFontPreset(key: string | undefined) {
  return FONT_PRESETS.find((f) => f.key === key) ?? FONT_PRESETS[0];
}

// ── Density ───────────────────────────────────────────────────────────────────
export const DENSITY_OPTIONS: { value: DensityOption; label: string }[] = [
  { value: "compact",  label: "Compact" },
  { value: "normal",   label: "Normal" },
  { value: "spacious", label: "Aéré" },
];

export interface ResolvedTheme extends StyleTheme {
  pagePadding: string;
  sectionSpacing: string;
  lineHeight: number;
}

export function resolveTheme(
  style: StyleDefinition,
  customization: CVCustomization = {},
): ResolvedTheme {
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
    accentColor: customization.accentColor ?? style.theme.accentColor,
    headingColor: customization.accentColor ?? style.theme.headingColor,
    fontFamily: font.family,
    arabicFontFamily: font.arabicFamily,
    pagePadding: d.padding,
    sectionSpacing: d.spacing,
    lineHeight: d.lineHeight,
  };
}
