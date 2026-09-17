"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("siira-theme");
    setDark(
      stored === "dark" ||
        (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches),
    );
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("siira-theme", next ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Passer au mode clair" : "Passer au mode sombre"}
      className="rounded p-1.5 text-sm transition hover:bg-stone-100 dark:hover:bg-stone-800"
      style={{ color: "var(--muted)" }}
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
