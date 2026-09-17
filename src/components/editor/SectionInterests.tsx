"use client";

import type { CVProfile } from "@/types/cv";

interface Props {
  cv: CVProfile;
  onChange: (interests: string[]) => void;
}

export default function SectionInterests({ cv, onChange }: Props) {
  const interests = cv.interests;

  function add() {
    onChange([...interests, ""]);
  }

  function update(idx: number, value: string) {
    const next = [...interests];
    next[idx] = value;
    onChange(next);
  }

  function remove(idx: number) {
    onChange(interests.filter((_, i) => i !== idx));
  }

  const inputCls =
    "rounded border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 outline-none transition focus:border-accent focus:ring-1 focus:ring-accent dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 flex-1";

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-stone-400">
        Centres d'intérêt pertinents pour votre candidature. Évitez les lieux communs (lecture, musique) — préférez des détails précis.
      </p>
      <div className="flex flex-col gap-2">
        {interests.map((item, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <input
              className={inputCls}
              value={item}
              placeholder="Développement open source, robotique, escalade…"
              onChange={(e) => update(idx, e.target.value)}
            />
            <button
              type="button"
              onClick={() => remove(idx)}
              className="text-stone-400 hover:text-red-500 text-sm px-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="self-start text-xs text-accent hover:underline"
      >
        + Ajouter
      </button>
    </div>
  );
}
