"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { CVProfile } from "@/types/cv";
import { loadGuestCV, saveGuestCV } from "./storage";

const AUTOSAVE_DELAY = 1200; // ms

export function useGuestCV() {
  const [cv, setCV] = useState<CVProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCV(loadGuestCV());
  }, []);

  const updateCV = useCallback((updater: (prev: CVProfile) => CVProfile) => {
    setCV((prev) => {
      if (!prev) return prev;
      const next = updater(prev);

      // Debounced autosave
      if (timerRef.current) clearTimeout(timerRef.current);
      setSaving(true);
      timerRef.current = setTimeout(() => {
        saveGuestCV(next);
        setSaving(false);
      }, AUTOSAVE_DELAY);

      return next;
    });
  }, []);

  return { cv, updateCV, saving };
}
