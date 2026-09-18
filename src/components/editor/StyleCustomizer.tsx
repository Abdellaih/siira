"use client";

import { useState } from "react";
import type { CVCustomization, StyleId } from "@/types/cv";
import {
  STYLE_PRESETS,
  FONT_PRESETS,
  DENSITY_OPTIONS,
  getPresetForStyle,
} from "@/lib/styles/customization";

interface Props {
  styleId: StyleId;
  value: CVCustomization;
  onChange: (patch: Partial<CVCustomization>) => void;
}

const STYLE_ICONS: Record<string, string> = {
  underline: "─",
  filled:    "█",
  "left-bar": "│",
  plain:     "·",
};

export default function StyleCustomizer({ styleId, value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const presets = STYLE_PRESETS[styleId] ?? [];
  const activePreset = getPresetForStyle(styleId, value.presetId);
  const currentFont = value.fontFamily ?? "sans";
  const currentDensity = value.density ?? "normal";

  const hasCustom = value.presetId || value.fontFamily || value.density;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-600 transition hover:border-accent hover:text-accent dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
      >
        <span
          className="inline-block h-3 w-3 rounded-full border border-stone-300/50"
          style={{ background: activePreset.accentColor }}
        />
        {activePreset.name}
        <span className="text-stone-400">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />

          <div className="absolute right-0 top-full z-20 mt-1 w-72 rounded-lg border border-stone-200 bg-white p-4 shadow-xl dark:border-stone-700 dark:bg-stone-900">

            {/* Presets */}
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
              Thème
            </p>
            <div className="mb-4 grid grid-cols-2 gap-2">
              {presets.map((preset) => {
                const active = activePreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onChange({ presetId: preset.id })}
                    className={`flex items-center gap-2 rounded-md border px-3 py-2 text-left text-sm transition ${
                      active
                        ? "border-accent bg-accent/5 dark:bg-accent/10"
                        : "border-stone-200 hover:border-stone-300 dark:border-stone-700 dark:hover:border-stone-500"
                    }`}
                  >
                    <span
                      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] text-white/90"
                      style={{ background: preset.accentColor }}
                      title={preset.sectionTitleStyle}
                    >
                      {STYLE_ICONS[preset.sectionTitleStyle]}
                    </span>
                    <span
                      className={`font-medium ${active ? "text-accent" : "text-stone-700 dark:text-stone-200"}`}
                    >
                      {preset.name}
                    </span>
                    {active && (
                      <span className="ms-auto text-accent">✓</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Font */}
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
              Police
            </p>
            <div className="mb-4 flex flex-col gap-1">
              {FONT_PRESETS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => onChange({ fontFamily: f.key })}
                  className={`rounded px-3 py-1.5 text-left text-sm transition ${
                    currentFont === f.key
                      ? "bg-accent/10 font-semibold text-accent"
                      : "text-stone-700 hover:bg-stone-50 dark:text-stone-300 dark:hover:bg-stone-800"
                  }`}
                  style={{ fontFamily: f.family }}
                >
                  {f.label}
                  <span className="ms-2 text-stone-400">Aa Bb 123</span>
                </button>
              ))}
            </div>

            {/* Density */}
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
              Espacement
            </p>
            <div className="mb-3 flex overflow-hidden rounded border border-stone-200 dark:border-stone-700">
              {DENSITY_OPTIONS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => onChange({ density: d.value })}
                  className={`flex-1 py-1.5 text-xs transition ${
                    currentDensity === d.value
                      ? "bg-accent font-semibold text-white"
                      : "text-stone-600 hover:bg-stone-50 dark:text-stone-300 dark:hover:bg-stone-800"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Reset */}
            {hasCustom && (
              <button
                type="button"
                onClick={() =>
                  onChange({ presetId: undefined, fontFamily: undefined, density: undefined })
                }
                className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
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
