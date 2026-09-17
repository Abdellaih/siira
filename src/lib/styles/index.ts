import { canadianStyle } from "./canadian";
import { classicStyle } from "./classic";
import { modernStyle } from "./modern";
import { europassStyle } from "./europass";
import { atsStyle } from "./ats";
import { gulfStyle } from "./gulf";
import type { StyleDefinition, StyleId } from "@/types/cv";

export const allStyles: StyleDefinition[] = [
  canadianStyle,
  classicStyle,
  modernStyle,
  europassStyle,
  atsStyle,
  gulfStyle,
];

export const stylesById: Record<string, StyleDefinition> = Object.fromEntries(
  allStyles.map((s) => [s.id, s]),
);

export function getStyle(id: StyleId): StyleDefinition {
  return stylesById[id] ?? canadianStyle;
}

export { canadianStyle, classicStyle, modernStyle, europassStyle, atsStyle, gulfStyle };
