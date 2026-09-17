"use client";

import { useState } from "react";
import type { CVProfile, CertificationEntry } from "@/types/cv";

interface Props {
  cv: CVProfile;
  onChange: (entries: CertificationEntry[]) => void;
}

export default function SectionCertifications({ cv, onChange }: Props) {
  const entries = [...cv.certifications].sort((a, b) => a.order - b.order);
  const [openId, setOpenId] = useState<string | null>(entries[0]?.id ?? null);

  function add() {
    const entry: CertificationEntry = {
      id: crypto.randomUUID(),
      name: "",
      issuer: "",
      date: "",
      url: "",
      order: entries.length,
    };
    onChange([...entries, entry]);
    setOpenId(entry.id);
  }

  function update(id: string, patch: Partial<CertificationEntry>) {
    onChange(entries.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function remove(id: string) {
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
            <span>{entry.name || "Nouvelle certification"}</span>
            <span className="text-stone-400">{openId === entry.id ? "▲" : "▼"}</span>
          </button>

          {openId === entry.id && (
            <div className="flex flex-col gap-3 border-t border-stone-200 px-4 pb-4 pt-3 dark:border-stone-700">
              <div className="flex flex-col gap-1">
                <label className={labelCls}>Nom de la certification</label>
                <input className={inputCls} value={entry.name} placeholder="AWS Certified Developer" onChange={(e) => update(entry.id, { name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className={labelCls}>Organisme</label>
                  <input className={inputCls} value={entry.issuer} placeholder="Amazon Web Services" onChange={(e) => update(entry.id, { issuer: e.target.value })} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelCls}>Date</label>
                  <input type="month" className={inputCls} value={entry.date} onChange={(e) => update(entry.id, { date: e.target.value })} />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className={labelCls}>Lien de vérification (optionnel)</label>
                <input type="url" className={inputCls} value={entry.url} placeholder="https://..." onChange={(e) => update(entry.id, { url: e.target.value })} />
              </div>
              <button type="button" onClick={() => remove(entry.id)} className="self-end text-xs text-red-400 hover:text-red-600">
                Supprimer
              </button>
            </div>
          )}
        </div>
      ))}
      <button type="button" onClick={add} className="rounded-lg border-2 border-dashed border-stone-300 py-3 text-sm text-stone-500 hover:border-accent hover:text-accent transition dark:border-stone-600">
        + Ajouter une certification
      </button>
    </div>
  );
}
