"use client";

import type { CVProfile, LanguageEntry, CEFRLevel } from "@/types/cv";

const CEFR_LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2", "Native"];

interface Props {
  cv: CVProfile;
  onChange: (entries: LanguageEntry[]) => void;
}

export default function SectionLanguages({ cv, onChange }: Props) {
  const entries = [...cv.languages].sort((a, b) => a.order - b.order);

  function add() {
    onChange([
      ...entries,
      { id: crypto.randomUUID(), language: "", level: "", cefrLevel: null, order: entries.length },
    ]);
  }

  function update(id: string, patch: Partial<LanguageEntry>) {
    onChange(entries.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function remove(id: string) {
    onChange(entries.filter((e) => e.id !== id).map((e, i) => ({ ...e, order: i })));
  }

  const inputCls =
    "rounded border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 outline-none transition focus:border-accent focus:ring-1 focus:ring-accent dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100";

  return (
    <div className="flex flex-col gap-2">
      {entries.map((entry) => (
        <div key={entry.id} className="flex gap-2 items-center">
          <input
            className={`${inputCls} flex-1`}
            value={entry.language}
            placeholder="Arabe, Français, Anglais…"
            onChange={(e) => update(entry.id, { language: e.target.value })}
          />
          <select
            className={`${inputCls} w-28`}
            value={entry.cefrLevel ?? ""}
            onChange={(e) => {
              const val = e.target.value as CEFRLevel | "";
              update(entry.id, {
                cefrLevel: val === "" ? null : val,
                level: val === "" ? entry.level : val,
              });
            }}
          >
            <option value="">Niveau</option>
            {CEFR_LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => remove(entry.id)}
            className="text-stone-400 hover:text-red-500 text-sm px-1"
          >
            ✕
          </button>
        </div>
      ))}
      <p className="text-xs text-stone-400">Utilisez les niveaux CECR (A1–C2) pour les CV Europass / Europe.</p>
      <button
        type="button"
        onClick={add}
        className="self-start text-xs text-accent hover:underline mt-1"
      >
        + Ajouter une langue
      </button>
    </div>
  );
}
