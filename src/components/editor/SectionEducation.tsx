"use client";

import { useState } from "react";
import type { CVProfile, EducationEntry } from "@/types/cv";

const MOROCCAN_DEGREES = [
  "Baccalauréat",
  "DUT",
  "BTS",
  "DEUG",
  "DTS",
  "Licence",
  "Licence professionnelle",
  "Master",
  "Master spécialisé",
  "Diplôme d'ingénieur",
  "Doctorat",
  "Technicien (OFPPT)",
  "Technicien spécialisé (OFPPT)",
];

function newEntry(order: number): EducationEntry {
  return {
    id: crypto.randomUUID(),
    institution: "",
    degree: "",
    field: "",
    location: "",
    startDate: "",
    endDate: null,
    current: false,
    grade: "",
    notes: "",
    order,
  };
}

interface Props {
  cv: CVProfile;
  onChange: (entries: EducationEntry[]) => void;
}

export default function SectionEducation({ cv, onChange }: Props) {
  const entries = [...cv.education].sort((a, b) => a.order - b.order);
  const [openId, setOpenId] = useState<string | null>(entries[0]?.id ?? null);

  function update(id: string, patch: Partial<EducationEntry>) {
    onChange(entries.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function addEntry() {
    const entry = newEntry(entries.length);
    onChange([...entries, entry]);
    setOpenId(entry.id);
  }

  function removeEntry(id: string) {
    const next = entries.filter((e) => e.id !== id).map((e, i) => ({ ...e, order: i }));
    onChange(next);
    setOpenId(next[0]?.id ?? null);
  }

  const inputCls =
    "rounded border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 outline-none transition focus:border-accent focus:ring-1 focus:ring-accent dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 w-full";
  const labelCls = "text-xs font-medium text-stone-600 dark:text-stone-400";

  return (
    <div className="flex flex-col gap-3">
      {entries.map((entry) => (
        <div key={entry.id} className="rounded-lg border border-stone-200 dark:border-stone-700">
          <button
            type="button"
            onClick={() => setOpenId(openId === entry.id ? null : entry.id)}
            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-stone-800 dark:text-stone-100"
          >
            <span>{entry.degree || entry.institution || "Nouvelle formation"}</span>
            <span className="text-stone-400">{openId === entry.id ? "▲" : "▼"}</span>
          </button>

          {openId === entry.id && (
            <div className="flex flex-col gap-3 border-t border-stone-200 px-4 pb-4 pt-3 dark:border-stone-700">
              <div className="flex flex-col gap-1">
                <label className={labelCls}>Établissement</label>
                <input
                  className={inputCls}
                  value={entry.institution}
                  placeholder="ENSA Kénitra"
                  onChange={(e) => update(entry.id, { institution: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className={labelCls}>Diplôme</label>
                  <input
                    className={inputCls}
                    list="degree-options"
                    value={entry.degree}
                    placeholder="Diplôme d'ingénieur"
                    onChange={(e) => update(entry.id, { degree: e.target.value })}
                  />
                  <datalist id="degree-options">
                    {MOROCCAN_DEGREES.map((d) => (
                      <option key={d} value={d} />
                    ))}
                  </datalist>
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelCls}>Filière / Spécialité</label>
                  <input
                    className={inputCls}
                    value={entry.field}
                    placeholder="Génie informatique"
                    onChange={(e) => update(entry.id, { field: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelCls}>Lieu</label>
                <input
                  className={inputCls}
                  value={entry.location}
                  placeholder="Kénitra, Maroc"
                  onChange={(e) => update(entry.id, { location: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className={labelCls}>Début</label>
                  <input
                    type="month"
                    className={inputCls}
                    value={entry.startDate}
                    onChange={(e) => update(entry.id, { startDate: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelCls}>Fin</label>
                  {entry.current ? (
                    <div className="py-2 text-sm text-stone-500">En cours</div>
                  ) : (
                    <input
                      type="month"
                      className={inputCls}
                      value={entry.endDate ?? ""}
                      onChange={(e) => update(entry.id, { endDate: e.target.value || null })}
                    />
                  )}
                  <label className="flex items-center gap-2 text-xs text-stone-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={entry.current}
                      onChange={(e) => update(entry.id, { current: e.target.checked, endDate: null })}
                    />
                    En cours
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelCls}>Mention / Note</label>
                <input
                  className={inputCls}
                  value={entry.grade}
                  placeholder="Mention Bien, 16/20"
                  onChange={(e) => update(entry.id, { grade: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelCls}>Notes complémentaires</label>
                <textarea
                  rows={2}
                  className={`${inputCls} resize-none`}
                  value={entry.notes}
                  placeholder="Option, stage intégré, mémoire de fin d'études..."
                  onChange={(e) => update(entry.id, { notes: e.target.value })}
                />
              </div>

              <button
                type="button"
                onClick={() => removeEntry(entry.id)}
                className="self-end text-xs text-red-400 hover:text-red-600"
              >
                Supprimer cette formation
              </button>
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addEntry}
        className="rounded-lg border-2 border-dashed border-stone-300 py-3 text-sm text-stone-500 hover:border-accent hover:text-accent transition dark:border-stone-600"
      >
        + Ajouter une formation
      </button>
    </div>
  );
}
