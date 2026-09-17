"use client";

import { useState } from "react";
import type { CVCustomization } from "@/types/cv";
import {
  COLOR_PRESETS,
  FONT_PRESETS,
  DENSITY_OPTIONS,
} from "@/lib/styles/customization";

interface Props {
  value: CVCustomization;
  onChange: (patch: Partial<CVCustomization>) => void;
}

export default function StyleCustomizer({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const currentColor = value.accentColor ?? null;
  const currentFont = value.fontFamily ?? "sans";
  const currentDensity = value.density ?? "normal";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-600 transition hover:border-accent hover:text-accent dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
      >
        {/* Color dot showing current accent */}
        <span
          className="inline-block h-3 w-3 rounded-full border border-stone-300"
          style={{ background: currentColor ?? "#1A3A5C" }}
        />
        Personnaliser
        <span className="text-stone-400">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />

          {/* Panel */}
          <div className="absolute right-0 top-full z-20 mt-1 w-64 rounded-lg border border-stone-200 bg-white p-4 shadow-lg dark:border-stone-700 dark:bg-stone-900">
            {/* Color */}
            <div className="mb-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                Couleur
              </p>
              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    title={c.label}
                    onClick={() => onChange({ accentColor: c.value })}
                    className="relative h-7 w-7 rounded-full transition hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    style={{ background: c.value }}
                  >
                    {currentColor === c.value && (
                      <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Font */}
            <div className="mb-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                Police
              </p>
              <div className="flex flex-col gap-1">
                {FONT_PRESETS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => onChange({ fontFamily: f.key })}
                    className={`rounded px-3 py-2 text-left text-sm transition ${
                      currentFont === f.key
                        ? "bg-accent/10 font-medium text-accent"
                        : "text-stone-700 hover:bg-stone-50 dark:text-stone-300 dark:hover:bg-stone-800"
                    }`}
                    style={{ fontFamily: f.family }}
                  >
                    {f.label} — Aa Bb Cc
                  </button>
                ))}
              </div>
            </div>

            {/* Density */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                Espacement
              </p>
              <div className="flex rounded border border-stone-200 dark:border-stone-700 overflow-hidden">
                {DENSITY_OPTIONS.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => onChange({ density: d.value })}
                    className={`flex-1 py-1.5 text-xs transition ${
                      currentDensity === d.value
                        ? "bg-accent text-white font-medium"
                        : "text-stone-600 hover:bg-stone-50 dark:text-stone-300 dark:hover:bg-stone-800"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset */}
            {(value.accentColor || value.fontFamily || value.density) && (
              <button
                type="button"
                onClick={() => onChange({ accentColor: undefined, fontFamily: undefined, density: undefined })}
                className="mt-3 text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
