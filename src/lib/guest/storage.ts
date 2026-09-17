"use client";

import type { CVProfile } from "@/types/cv";
import { createEmptyCV } from "@/lib/styles/defaults";

const GUEST_CV_KEY = "siira_guest_cv";
const GUEST_ID = "guest";

export function loadGuestCV(): CVProfile {
  if (typeof window === "undefined") return createEmptyCV({ id: GUEST_ID });
  try {
    const raw = localStorage.getItem(GUEST_CV_KEY);
    if (!raw) return createEmptyCV({ id: GUEST_ID });
    const parsed = JSON.parse(raw) as CVProfile;
    return { ...createEmptyCV({ id: GUEST_ID }), ...parsed };
  } catch {
    return createEmptyCV({ id: GUEST_ID });
  }
}

export function saveGuestCV(cv: CVProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    GUEST_CV_KEY,
    JSON.stringify({ ...cv, updatedAt: new Date().toISOString() }),
  );
}

export function clearGuestCV(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GUEST_CV_KEY);
}

export function hasGuestCV(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(GUEST_CV_KEY) !== null;
}
