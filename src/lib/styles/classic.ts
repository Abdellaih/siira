import type { StyleDefinition } from "@/types/cv";

export const classicStyle: StyleDefinition = {
  id: "classic",
  name: { ar: "النمط الكلاسيكي", fr: "Style classique", en: "Classic" },
  description: {
    ar: "مع صورة شخصية، تفاصيل شخصية، A4. مناسب للسوق المغربية والفرنسية.",
    fr: "Avec photo, informations personnelles, A4. Adapté au marché marocain et français.",
    en: "With photo, personal details, A4. Suited for the Moroccan and French markets.",
  },
  pageSize: "A4",
  direction: "ltr",
  recommendedPages: [1, 2],
  sections: [
    { id: "personal", order: 0, visible: true },
    { id: "summary", order: 1, visible: true },
    { id: "education", order: 2, visible: true },   // education before experience for young graduates
    { id: "experience", order: 3, visible: true },
    { id: "skills", order: 4, visible: true },
    { id: "languages", order: 5, visible: true },
    { id: "certifications", order: 6, visible: true },
    { id: "projects", order: 7, visible: true },
    { id: "volunteering", order: 8, visible: true },
    { id: "interests", order: 9, visible: true },
    { id: "references", order: 10, visible: false },
  ],
  fieldRules: {
    "personal.photo": { status: "optional" },
    "personal.dateOfBirth": { status: "optional" },
    "personal.nationality": { status: "optional" },
    "personal.maritalStatus": { status: "optional" },
    "personal.drivingLicense": { status: "optional" },
    "personal.cin": {
      status: "discouraged",
      reason: {
        ar: "لا توصي بتضمين رقم البطاقة الوطنية في السيرة الذاتية لأسباب أمنية.",
        fr: "Nous déconseillons d'inclure votre numéro CIN dans le CV pour des raisons de sécurité.",
        en: "We advise against including your national ID number in a CV for security reasons.",
      },
    },
  },
  theme: {
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    arabicFontFamily: "'Noto Naskh Arabic', serif",
    accentColor: "#1F3C6E",
    headingColor: "#1F3C6E",
    bodyColor: "#222222",
    mutedColor: "#555555",
    borderColor: "#CCCCCC",
    fontSize: {
      name: "20px",
      heading: "11px",
      subheading: "10.5px",
      body: "10px",
      small: "9px",
    },
  },
};
