"use client";

import type { CVProfile, StyleDefinition } from "@/types/cv";
import { isFieldVisible } from "@/lib/styles/engine";
import PhotoUpload from "./PhotoUpload";

interface Props {
  cv: CVProfile;
  style: StyleDefinition;
  onChange: (patch: Partial<CVProfile["personal"]>) => void;
}

const MOROCCAN_CITIES = [
  "Agadir", "Al Hoceïma", "Béni Mellal", "Casablanca", "Dakhla", "El Jadida",
  "Errachidia", "Essaouira", "Fès", "Guelmim", "Kénitra", "Khénifra",
  "Khouribga", "Laâyoune", "Larache", "Marrakech", "Meknès", "Nador",
  "Oujda", "Rabat", "Safi", "Salé", "Settat", "Tanger", "Taroudant",
  "Tétouan", "Tiznit",
];

export default function SectionPersonal({ cv, style, onChange }: Props) {
  const p = cv.personal;

  function field(
    label: string,
    key: keyof typeof p,
    type: string = "text",
    placeholder: string = "",
  ) {
    const value = (p[key] as string) ?? "";
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-stone-600 dark:text-stone-400">
          {label}
        </label>
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange({ [key]: e.target.value })}
          className="rounded border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 outline-none transition focus:border-accent focus:ring-1 focus:ring-accent dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
        />
      </div>
    );
  }

  const photoRule = style.fieldRules["personal.photo"];
  const showPhotoUpload = photoRule?.status !== "hidden" && photoRule?.status !== "discouraged";
  const showDob = isFieldVisible("personal.dateOfBirth", style);
  const showNationality = isFieldVisible("personal.nationality", style);
  const showMarital = isFieldVisible("personal.maritalStatus", style);
  const showVisaStatus = isFieldVisible("personal.visaStatus", style);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        {field("Prénom / First name", "firstName", "text", "Youssef")}
        {field("Nom / Last name", "lastName", "text", "El Alami")}
      </div>

      {field("Titre professionnel / Headline", "headline", "text", "Ingénieur logiciel")}

      <div className="grid grid-cols-2 gap-3">
        {field("Email", "email", "email", "youssef@example.com")}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-stone-600 dark:text-stone-400">
            Téléphone
          </label>
          <div className="flex gap-2">
            <select
              value={p.phoneCountryCode}
              onChange={(e) => onChange({ phoneCountryCode: e.target.value })}
              className="w-24 rounded border border-stone-200 bg-white px-2 py-2 text-sm text-stone-800 outline-none focus:border-accent dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
            >
              <option value="+212">+212</option>
              <option value="+1">+1</option>
              <option value="+33">+33</option>
              <option value="+34">+34</option>
              <option value="+49">+49</option>
              <option value="+971">+971</option>
              <option value="+966">+966</option>
            </select>
            <input
              type="tel"
              value={p.phone}
              placeholder="06 12 34 56 78"
              onChange={(e) => onChange({ phone: e.target.value })}
              className="flex-1 rounded border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:border-accent focus:ring-1 focus:ring-accent dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-stone-600 dark:text-stone-400">Ville</label>
          <input
            type="text"
            list="moroccan-cities"
            value={p.city}
            placeholder="Casablanca"
            onChange={(e) => onChange({ city: e.target.value })}
            className="rounded border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:border-accent focus:ring-1 focus:ring-accent dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
          />
          <datalist id="moroccan-cities">
            {MOROCCAN_CITIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        {field("Pays / Country", "country", "text", "Maroc")}
      </div>

      {field("LinkedIn", "linkedin", "url", "linkedin.com/in/youssef-elalami")}
      {field("Site web / Portfolio", "website", "url", "youssef.dev")}
      {field("GitHub", "github", "text", "github.com/youssef")}

      {/* Photo upload — only for styles that allow it */}
      {showPhotoUpload && (
        <PhotoUpload
          value={p.photoKey}
          onChange={(dataUrl) => onChange({ photoKey: dataUrl })}
        />
      )}

      {/* Sensitive fields — only shown when the active style permits them */}
      {showDob && (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-stone-600 dark:text-stone-400">
            Date de naissance
          </label>
          <input
            type="date"
            value={p.dateOfBirth ?? ""}
            onChange={(e) => onChange({ dateOfBirth: e.target.value || null })}
            className="rounded border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:border-accent dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
          />
        </div>
      )}

      {showNationality && field("Nationalité", "nationality", "text", "Marocaine")}
      {showVisaStatus && field("Statut visa / disponibilité", "visaStatus", "text", "Disponible immédiatement")}
      {showMarital && (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-stone-600 dark:text-stone-400">
            Situation familiale
          </label>
          <select
            value={p.maritalStatus ?? ""}
            onChange={(e) => onChange({ maritalStatus: e.target.value || null })}
            className="rounded border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:border-accent dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
          >
            <option value="">— Sélectionner —</option>
            <option value="Célibataire">Célibataire</option>
            <option value="Marié(e)">Marié(e)</option>
            <option value="Divorcé(e)">Divorcé(e)</option>
            <option value="Veuf/Veuve">Veuf/Veuve</option>
          </select>
        </div>
      )}
    </div>
  );
}
