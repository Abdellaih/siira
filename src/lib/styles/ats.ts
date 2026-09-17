import type { StyleDefinition } from "@/types/cv";

export const atsStyle: StyleDefinition = {
  id: "ats",
  name: { ar: "ATS مبسّط", fr: "ATS Minimal", en: "ATS Minimal" },
  description: {
    ar: "عمود واحد، بدون صور أو جداول، قابل للقراءة آلياً. مثالي للتقديم الإلكتروني.",
    fr: "Colonne unique, sans images ni tableaux, lisible par les logiciels ATS. Idéal pour les candidatures en ligne.",
    en: "Single column, no images or tables, machine-readable. Ideal for online applications.",
  },
  pageSize: "LETTER",
  direction: "ltr",
  recommendedPages: [1, 2],
  sections: [
    { id: "personal", order: 0, visible: true },
    { id: "summary", order: 1, visible: true },
    { id: "experience", order: 2, visible: true },
    { id: "education", order: 3, visible: true },
    { id: "skills", order: 4, visible: true },
    { id: "certifications", order: 5, visible: true },
    { id: "projects", order: 6, visible: true },
    { id: "languages", order: 7, visible: true },
    { id: "volunteering", order: 8, visible: true },
    { id: "interests", order: 9, visible: false },
    { id: "references", order: 10, visible: false },
  ],
  fieldRules: {
    "personal.photo": {
      status: "discouraged",
      reason: {
        ar: "الصور تُعطّل أنظمة ATS وتُسبب أخطاء في قراءة السيرة الذاتية آلياً.",
        fr: "Les photos perturbent les logiciels ATS et causent des erreurs de lecture automatique.",
        en: "Photos disrupt ATS software and cause parsing errors.",
      },
    },
    "personal.dateOfBirth": { status: "hidden" },
    "personal.maritalStatus": { status: "hidden" },
    "personal.cin": { status: "hidden" },
    "personal.drivingLicense": { status: "hidden" },
    "personal.nationality": { status: "hidden" },
  },
  theme: {
    fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
    arabicFontFamily: "'Noto Naskh Arabic', serif",
    accentColor: "#000000",
    headingColor: "#000000",
    bodyColor: "#000000",
    mutedColor: "#333333",
    borderColor: "#000000",
    fontSize: {
      name: "18px",
      heading: "11px",
      subheading: "10.5px",
      body: "10.5px",
      small: "10px",
    },
  },
};
