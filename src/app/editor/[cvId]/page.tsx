"use client";

import { useGuestCV } from "@/lib/guest/useGuestCV";
import EditorShell from "@/components/editor/EditorShell";

export default function EditorPage() {
  const { cv, updateCV, saving } = useGuestCV();

  if (!cv) {
    return (
      <div className="flex h-screen items-center justify-center bg-stone-50 dark:bg-stone-950">
        <div className="text-sm text-stone-400">Chargement…</div>
      </div>
    );
  }

  return <EditorShell cv={cv} saving={saving} onUpdate={updateCV} />;
}
