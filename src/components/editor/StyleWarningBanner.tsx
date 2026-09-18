"use client";

import { useTranslations } from "next-intl";
import type { StyleWarning } from "@/types/cv";

interface Props {
  warnings: StyleWarning[];
  styleName: string;
}

export default function StyleWarningBanner({ warnings, styleName }: Props) {
  const t = useTranslations("warnings");

  if (warnings.length === 0) return null;

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/40">
      <p className="mb-2 text-sm font-medium text-amber-800 dark:text-amber-200">
        {t("title", { style: styleName })}
      </p>
      <ul className="flex flex-col gap-1">
        {warnings.map((w) => (
          <li key={w.field} className="text-xs text-amber-700 dark:text-amber-300">
            <span className="font-medium">
              {t(`fields.${w.field.replace(".", "_")}`)}
            </span>
            {w.reason && ` — ${w.reason}`}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
        {t("preserved")}
      </p>
    </div>
  );
}
