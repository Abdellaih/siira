"use client";

import type { StyleWarning } from "@/types/cv";

const fieldLabels: Record<string, string> = {
  "personal.photo": "Photo",
  "personal.dateOfBirth": "Date de naissance",
  "personal.nationality": "Nationalité",
  "personal.maritalStatus": "Situation familiale",
  "personal.cin": "CIN",
  "personal.visaStatus": "Statut visa",
  "personal.drivingLicense": "Permis de conduire",
};

interface Props {
  warnings: StyleWarning[];
  styleName: string;
}

export default function StyleWarningBanner({ warnings, styleName }: Props) {
  if (warnings.length === 0) return null;

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/40">
      <p className="mb-2 text-sm font-medium text-amber-800 dark:text-amber-200">
        Le style <strong>{styleName}</strong> masquera les champs suivants dans le PDF :
      </p>
      <ul className="flex flex-col gap-1">
        {warnings.map((w) => (
          <li key={w.field} className="text-xs text-amber-700 dark:text-amber-300">
            <span className="font-medium">{fieldLabels[w.field] ?? w.field}</span>
            {w.reason && ` — ${w.reason}`}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
        Ces données restent sauvegardées et réapparaîtront si vous changez de style.
      </p>
    </div>
  );
}
