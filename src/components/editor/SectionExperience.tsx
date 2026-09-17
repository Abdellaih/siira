"use client";

import { useState } from "react";
import type { CVProfile, ExperienceEntry } from "@/types/cv";

function newEntry(order: number): ExperienceEntry {
  return {
    id: crypto.randomUUID(),
    company: "",
    position: "",
    location: "",
    startDate: "",
    endDate: null,
    current: false,
    bullets: [""],
    order,
  };
}

interface Props {
  cv: CVProfile;
  onChange: (entries: ExperienceEntry[]) => void;
}

export default function SectionExperience({ cv, onChange }: Props) {
  const entries = [...cv.experience].sort((a, b) => a.order - b.order);
  const [openId, setOpenId] = useState<string | null>(entries[0]?.id ?? null);

  function update(id: string, patch: Partial<ExperienceEntry>) {
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

  function updateBullet(id: string, idx: number, value: string) {
    const entry = entries.find((e) => e.id === id);
    if (!entry) return;
    const bullets = [...entry.bullets];
    bullets[idx] = value;
    update(id, { bullets });
  }

  function addBullet(id: string) {
    const entry = entries.find((e) => e.id === id);
    if (!entry) return;
    update(id, { bullets: [...entry.bullets, ""] });
  }

  function removeBullet(id: string, idx: number) {
    const entry = entries.find((e) => e.id === id);
    if (!entry) return;
    update(id, { bullets: entry.bullets.filter((_, i) => i !== idx) });
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
            <span>
              {entry.position || entry.company || "Nouvelle expérience"}
              {entry.company && entry.position ? ` · ${entry.company}` : ""}
            </span>
            <span className="text-stone-400">{openId === entry.id ? "▲" : "▼"}</span>
          </button>

          {openId === entry.id && (
            <div className="flex flex-col gap-3 border-t border-stone-200 px-4 pb-4 pt-3 dark:border-stone-700">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className={labelCls}>Entreprise</label>
                  <input
                    className={inputCls}
                    value={entry.company}
                    placeholder="Accenture Maroc"
                    onChange={(e) => update(entry.id, { company: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelCls}>Poste</label>
                  <input
                    className={inputCls}
                    value={entry.position}
                    placeholder="Développeur Full Stack"
                    onChange={(e) => update(entry.id, { position: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelCls}>Lieu</label>
                <input
                  className={inputCls}
                  value={entry.location}
                  placeholder="Casablanca, Maroc"
                  onChange={(e) => update(entry.id, { location: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className={labelCls}>Début (MM/AAAA)</label>
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
                    <div className="flex items-center gap-2 py-2 text-sm text-stone-500">En cours</div>
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
                    Poste actuel
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelCls}>Réalisations (une par ligne, avec chiffres si possible)</label>
                {entry.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <span className="mt-2 text-accent text-xs">▸</span>
                    <textarea
                      rows={2}
                      className={`${inputCls} resize-none`}
                      value={bullet}
                      placeholder="Réduit le temps de déploiement de 40% en automatisant le pipeline CI/CD"
                      onChange={(e) => updateBullet(entry.id, idx, e.target.value)}
                    />
                    {entry.bullets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBullet(entry.id, idx)}
                        className="mt-2 text-stone-400 hover:text-red-500 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addBullet(entry.id)}
                  className="self-start text-xs text-accent hover:underline"
                >
                  + Ajouter une réalisation
                </button>
              </div>

              <button
                type="button"
                onClick={() => removeEntry(entry.id)}
                className="self-end text-xs text-red-400 hover:text-red-600"
              >
                Supprimer cette expérience
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
        + Ajouter une expérience
      </button>
    </div>
  );
}
