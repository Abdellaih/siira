import type {
  CVProfile,
  StyleDefinition,
  StyleWarning,
  FieldPath,
  Locale,
} from "@/types/cv";

/**
 * Evaluates the field rules for the active style against the user's profile
 * and returns a list of warnings for discouraged fields that have data.
 */
export function getStyleWarnings(
  profile: CVProfile,
  style: StyleDefinition,
  locale: Locale,
): StyleWarning[] {
  const warnings: StyleWarning[] = [];

  const fieldChecks: Record<FieldPath, () => boolean> = {
    "personal.photo": () => profile.personal.photoKey !== null,
    "personal.dateOfBirth": () => profile.personal.dateOfBirth !== null && profile.personal.dateOfBirth !== "",
    "personal.nationality": () => !!profile.personal.nationality,
    "personal.maritalStatus": () => !!profile.personal.maritalStatus,
    "personal.drivingLicense": () => profile.personal.drivingLicense.length > 0,
    "personal.cin": () => !!profile.personal.cin,
    "personal.visaStatus": () => !!profile.personal.visaStatus,
    "personal.linkedin": () => !!profile.personal.linkedin,
    "personal.github": () => !!profile.personal.github,
    "personal.website": () => !!profile.personal.website,
  };

  for (const [fieldPath, rule] of Object.entries(style.fieldRules)) {
    if (rule.status === "discouraged") {
      const check = fieldChecks[fieldPath as FieldPath];
      if (check && check()) {
        warnings.push({
          field: fieldPath as FieldPath,
          reason: rule.reason?.[locale] ?? rule.reason?.["fr"] ?? "",
        });
      }
    }
  }

  return warnings;
}

/**
 * Returns the sections for a style in display order, filtered to visible only.
 */
export function getVisibleSections(style: StyleDefinition) {
  return [...style.sections]
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);
}

/**
 * Returns true if the field should be rendered in the PDF/preview for this style.
 */
export function isFieldVisible(
  field: FieldPath,
  style: StyleDefinition,
): boolean {
  const rule = style.fieldRules[field];
  if (!rule) return true; // unspecified = optional = visible
  return rule.status !== "hidden" && rule.status !== "discouraged";
}

/**
 * Applies the style's page dimensions as CSS custom properties.
 */
export function getPageDimensions(style: StyleDefinition): {
  width: string;
  height: string;
} {
  if (style.pageSize === "LETTER") {
    return { width: "215.9mm", height: "279.4mm" };
  }
  return { width: "210mm", height: "297mm" };
}
