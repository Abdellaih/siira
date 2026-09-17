import { describe, it, expect } from "vitest";
import { getStyleWarnings, isFieldVisible } from "./engine";
import { canadianStyle } from "./canadian";
import { createEmptyCV } from "./defaults";
import type { CVProfile } from "@/types/cv";

function cvWith(patch: Partial<CVProfile["personal"]>): CVProfile {
  return {
    ...createEmptyCV({ id: "test" }),
    personal: { ...createEmptyCV({ id: "test" }).personal, ...patch },
  };
}

describe("Canadian style field rules", () => {
  it("warns when photo is set", () => {
    const cv = cvWith({ photoKey: "uploads/photo.jpg" });
    const warnings = getStyleWarnings(cv, canadianStyle, "fr");
    expect(warnings.some((w) => w.field === "personal.photo")).toBe(true);
  });

  it("warns when date of birth is set", () => {
    const cv = cvWith({ dateOfBirth: "1996-04-15" });
    const warnings = getStyleWarnings(cv, canadianStyle, "fr");
    expect(warnings.some((w) => w.field === "personal.dateOfBirth")).toBe(true);
  });

  it("warns when nationality is set", () => {
    const cv = cvWith({ nationality: "Marocaine" });
    const warnings = getStyleWarnings(cv, canadianStyle, "fr");
    expect(warnings.some((w) => w.field === "personal.nationality")).toBe(true);
  });

  it("warns when marital status is set", () => {
    const cv = cvWith({ maritalStatus: "Célibataire" });
    const warnings = getStyleWarnings(cv, canadianStyle, "fr");
    expect(warnings.some((w) => w.field === "personal.maritalStatus")).toBe(true);
  });

  it("does not warn when sensitive fields are empty", () => {
    const cv = cvWith({});
    const warnings = getStyleWarnings(cv, canadianStyle, "fr");
    expect(warnings).toHaveLength(0);
  });

  it("hides photo field in Canadian style", () => {
    expect(isFieldVisible("personal.photo", canadianStyle)).toBe(false);
  });

  it("hides driving license in Canadian style", () => {
    expect(isFieldVisible("personal.drivingLicense", canadianStyle)).toBe(false);
  });

  it("includes warnings with the correct locale reason", () => {
    const cv = cvWith({ photoKey: "photo.jpg" });
    const warningsEn = getStyleWarnings(cv, canadianStyle, "en");
    const warningsFr = getStyleWarnings(cv, canadianStyle, "fr");
    const photoWarnEn = warningsEn.find((w) => w.field === "personal.photo");
    const photoWarnFr = warningsFr.find((w) => w.field === "personal.photo");
    expect(photoWarnEn?.reason).toContain("ATS");
    expect(photoWarnFr?.reason).toContain("biais");
  });
});
