"use client";

import { useState } from "react";
import type { CVProfile, ProjectEntry } from "@/types/cv";

interface Props {
  cv: CVProfile;
  onChange: (entries: ProjectEntry[]) => void;
}

export default function SectionProjects({ cv, onChange }: Props) {
  const entries = [...cv.projects].sort((a, b) => a.order - b.order);
  const [openId, setOpenId] = useState<string | null>(entries[0]?.id ?? null);

  function add() {
    const entry: ProjectEntry = {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      url: "",
      technologies: [],
      startDate: "",
      endDate: null,
      current: false,
      order: entries.length,
    };
    onChange([...entries, entry]);
    setOpenId(entry.id);
  }

  function update(id: string, patch: Partial<ProjectEntry>) {
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
            <span>{entry.name || "Nouveau projet"}</span>
            <span className="text-stone-400">{openId === entry.id ? "▲" : "▼"}</span>
          </button>

          {openId === entry.id && (
            <div className="flex flex-col gap-3 border-t border-stone-200 px-4 pb-4 pt-3 dark:border-stone-700">
              <div className="flex flex-col gap-1">
                <label className={labelCls}>Nom du projet</label>
                <input className={inputCls} value={entry.name} placeholder="Siira CV Builder" onChange={(e) => update(entry.id, { name: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1">
                <label className={labelCls}>Description</label>
                <textarea rows={3} className={`${inputCls} resize-none`} value={entry.description} placeholder="Application web permettant de créer des CV multilingues…" onChange={(e) => update(entry.id, { description: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1">
                <label className={labelCls}>Technologies (séparées par des virgules)</label>
                <input
                  className={inputCls}
                  value={entry.technologies.join(", ")}
                  placeholder="React, Next.js, TypeScript"
                  onChange={(e) =>
                    update(entry.id, {
                      technologies: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className={labelCls}>URL (optionnel)</label>
                <input type="url" className={inputCls} value={entry.url} placeholder="https://github.com/…" onChange={(e) => update(entry.id, { url: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className={labelCls}>Début</label>
                  <input type="month" className={inputCls} value={entry.startDate} onChange={(e) => update(entry.id, { startDate: e.target.value })} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelCls}>Fin</label>
                  {entry.current ? (
                    <div className="py-2 text-sm text-stone-500">En cours</div>
                  ) : (
                    <input type="month" className={inputCls} value={entry.endDate ?? ""} onChange={(e) => update(entry.id, { endDate: e.target.value || null })} />
                  )}
                  <label className="flex items-center gap-2 text-xs text-stone-500 cursor-pointer">
                    <input type="checkbox" checked={entry.current} onChange={(e) => update(entry.id, { current: e.target.checked, endDate: null })} />
                    En cours
                  </label>
                </div>
              </div>
              <button type="button" onClick={() => remove(entry.id)} className="self-end text-xs text-red-400 hover:text-red-600">
                Supprimer
              </button>
            </div>
          )}
        </div>
      ))}
      <button type="button" onClick={add} className="rounded-lg border-2 border-dashed border-stone-300 py-3 text-sm text-stone-500 hover:border-accent hover:text-accent transition dark:border-stone-600">
        + Ajouter un projet
      </button>
    </div>
  );
}
