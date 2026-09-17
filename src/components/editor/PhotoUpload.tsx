"use client";

import { useRef, useState } from "react";

interface Props {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
}

const MAX_SIZE_MB = 5;
const MAX_DIMENSION = 600;

async function resizeAndCrop(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const size = Math.min(img.width, img.height, MAX_DIMENSION);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;

      // Center-crop to square
      const sx = (img.width - size) / 2;
      const sy = (img.height - size) / 2;
      ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);

      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = reject;
    img.src = url;
  });
}

export default function PhotoUpload({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Format accepté : JPG, PNG, WebP.");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Taille maximale : ${MAX_SIZE_MB} MB.`);
      return;
    }

    setLoading(true);
    try {
      const dataUrl = await resizeAndCrop(file);
      onChange(dataUrl);
    } catch {
      setError("Impossible de traiter cette image.");
    } finally {
      setLoading(false);
      // Reset input so the same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-stone-600 dark:text-stone-400">Photo (optionnel)</label>

      <div className="flex items-center gap-4">
        {/* Preview */}
        <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800">
          {value ? (
            <img src={value} alt="Photo" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-stone-400">
              Photo
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className="rounded border border-stone-300 px-3 py-1.5 text-xs text-stone-600 transition hover:border-accent hover:text-accent dark:border-stone-600 dark:text-stone-300"
          >
            {loading ? "Traitement…" : value ? "Changer la photo" : "Choisir une photo"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="text-xs text-red-400 hover:text-red-600"
            >
              Supprimer
            </button>
          )}
          <p className="text-xs text-stone-400">JPG, PNG, WebP · Max {MAX_SIZE_MB} MB</p>
        </div>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={handleFile}
      />
    </div>
  );
}
