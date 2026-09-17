import type { StyleDefinition } from "@/types/cv";

export const canadianStyle: StyleDefinition = {
  id: "canadian",
  name: { ar: "النمط الكندي", fr: "Style canadien", en: "Canadian" },
  description: {
    ar: "بدون صورة، موجه نحو الإنجازات، ATS متوافق. مثالي لكندا والولايات المتحدة.",
    fr: "Sans photo, orienté résultats, compatible ATS. Idéal pour le Canada et les États-Unis.",
    en: "No photo, achievement-oriented, ATS-friendly. Ideal for Canada and the US.",
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
    { id: "volunteering", order: 7, visible: true },
    { id: "languages", order: 8, visible: true },
    { id: "interests", order: 9, visible: false },
    { id: "references", order: 10, visible: false },
  ],
  fieldRules: {
    "personal.photo": {
      status: "discouraged",
      reason: {
        ar: "لا تُوصى بالصورة في السيرة الذاتية الكندية لتجنب التحيز وضمان توافق أنظمة ATS.",
        fr: "La photo est déconseillée au Canada pour éviter les biais et assurer la compatibilité ATS.",
        en: "Photos are discouraged in Canada to avoid bias and ensure ATS compatibility.",
      },
    },
    "personal.dateOfBirth": {
      status: "discouraged",
      reason: {
        ar: "تاريخ الميلاد غير مطلوب ومحمي بموجب قوانين حقوق الإنسان الكندية.",
        fr: "La date de naissance est non requise et protégée par les lois canadiennes sur les droits de la personne.",
        en: "Date of birth is not required and is protected by Canadian human rights laws.",
      },
    },
    "personal.nationality": {
      status: "discouraged",
      reason: {
        ar: "الجنسية غير مطلوبة في السيرة الذاتية الكندية.",
        fr: "La nationalité n'est pas requise dans un CV canadien.",
        en: "Nationality is not required on a Canadian CV.",
      },
    },
    "personal.maritalStatus": {
      status: "discouraged",
      reason: {
        ar: "الحالة الاجتماعية غير ملائمة وقد تعرضك للتمييز.",
        fr: "La situation matrimoniale est inappropriée et peut entraîner de la discrimination.",
        en: "Marital status is inappropriate and may lead to discrimination.",
      },
    },
    "personal.cin": {
      status: "discouraged",
      reason: {
        ar: "لا تشارك رقم البطاقة الوطنية في السيرة الذاتية.",
        fr: "Ne partagez pas votre numéro de CIN dans un CV.",
        en: "Do not share your national ID number on a CV.",
      },
    },
    "personal.visaStatus": {
      status: "optional",
    },
    "personal.drivingLicense": {
      status: "hidden",
    },
  },
  theme: {
    fontFamily: "'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif",
    arabicFontFamily: "'Noto Naskh Arabic', serif",
    accentColor: "#1A3A5C",
    headingColor: "#0F2340",
    bodyColor: "#1C1C1C",
    mutedColor: "#5A5A5A",
    borderColor: "#CCCCCC",
    fontSize: {
      name: "22px",
      heading: "11px",
      subheading: "10.5px",
      body: "10px",
      small: "9px",
    },
  },
  variants: [
    {
      id: "canadian-qc",
      name: { ar: "النمط الكندي — كيبيك", fr: "Style canadien — Québec", en: "Canadian — Québec" },
      overrides: {},
    },
  ],
};
