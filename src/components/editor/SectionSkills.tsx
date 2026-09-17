"use client";

import type { CVProfile, SkillEntry } from "@/types/cv";

interface Props {
  cv: CVProfile;
  onChange: (entries: SkillEntry[]) => void;
}

export default function SectionSkills({ cv, onChange }: Props) {
  const entries = [...cv.skills].sort((a, b) => a.order - b.order);

  function addSkill() {
    onChange([
      ...entries,
      { id: crypto.randomUUID(), name: "", level: "", category: "", order: entries.length },
    ]);
  }

  function update(id: string, patch: Partial<SkillEntry>) {
    onChange(entries.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function remove(id: string) {
    onChange(entries.filter((s) => s.id !== id).map((s, i) => ({ ...s, order: i })));
  }

  const inputCls =
    "rounded border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 outline-none transition focus:border-accent focus:ring-1 focus:ring-accent dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100";

  return (
    <div className="flex flex-col gap-2">
      {entries.map((skill) => (
        <div key={skill.id} className="flex gap-2 items-center">
          <input
            className={`${inputCls} flex-1`}
            value={skill.name}
            placeholder="React, Python, AutoCAD…"
            onChange={(e) => update(skill.id, { name: e.target.value })}
          />
          <input
            className={`${inputCls} w-28`}
            value={skill.level}
            placeholder="Avancé"
            onChange={(e) => update(skill.id, { level: e.target.value })}
          />
          <button
            type="button"
            onClick={() => remove(skill.id)}
            className="text-stone-400 hover:text-red-500 text-sm px-1"
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addSkill}
        className="self-start text-xs text-accent hover:underline mt-1"
      >
        + Ajouter une compétence
      </button>
    </div>
  );
}
