export type Locale = "ar" | "fr" | "en";

export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Native";

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  headline: string;
  email: string;
  phone: string;
  phoneCountryCode: string;
  website: string;
  linkedin: string;
  github: string;
  city: string;
  country: string;
  // Sensitive — rendered only in styles that allow them
  photoKey: string | null;
  dateOfBirth: string | null;
  nationality: string | null;
  maritalStatus: string | null;
  drivingLicense: string[];
  cin: string | null;
  visaStatus: string | null;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  bullets: string[];
  order: number;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  grade: string;
  notes: string;
  order: number;
}

export interface SkillEntry {
  id: string;
  name: string;
  level: string;
  category: string;
  order: number;
}

export interface LanguageEntry {
  id: string;
  language: string;
  level: string;
  cefrLevel: CEFRLevel | null;
  order: number;
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
  order: number;
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  url: string;
  technologies: string[];
  startDate: string;
  endDate: string | null;
  current: boolean;
  order: number;
}

export interface VolunteeringEntry {
  id: string;
  organization: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  order: number;
}

export interface ReferenceEntry {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  order: number;
}

export type DensityOption = "compact" | "normal" | "spacious";

export interface CVCustomization {
  accentColor?: string;   // must be one of the preset values
  fontFamily?: string;    // must be one of the preset font keys
  density?: DensityOption;
}

export interface CVProfile {
  id: string;
  userId: string | null;
  name: string;
  cvLanguage: Locale;
  activeStyleId: StyleId;
  customization: CVCustomization;
  createdAt: string;
  updatedAt: string;
  personal: PersonalInfo;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillEntry[];
  languages: LanguageEntry[];
  certifications: CertificationEntry[];
  projects: ProjectEntry[];
  volunteering: VolunteeringEntry[];
  interests: string[];
  references: ReferenceEntry[];
}

export type StyleId =
  | "canadian"
  | "classic"
  | "modern"
  | "europass"
  | "ats"
  | "gulf";

export type SectionId =
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "languages"
  | "certifications"
  | "projects"
  | "volunteering"
  | "interests"
  | "references";

export type FieldPath =
  | "personal.photo"
  | "personal.dateOfBirth"
  | "personal.nationality"
  | "personal.maritalStatus"
  | "personal.drivingLicense"
  | "personal.cin"
  | "personal.visaStatus"
  | "personal.linkedin"
  | "personal.github"
  | "personal.website";

export type FieldStatus = "required" | "optional" | "hidden" | "discouraged";

export interface FieldRule {
  status: FieldStatus;
  reason?: Record<Locale, string>;
}

export interface StyleSection {
  id: SectionId;
  order: number;
  visible: boolean;
  labelOverride?: Record<Locale, string>;
}

export interface StyleTheme {
  fontFamily: string;
  arabicFontFamily: string;
  accentColor: string;
  headingColor: string;
  bodyColor: string;
  mutedColor: string;
  borderColor: string;
  fontSize: {
    name: string;
    heading: string;
    subheading: string;
    body: string;
    small: string;
  };
}

export interface StyleVariant {
  id: string;
  name: Record<Locale, string>;
  overrides: Partial<StyleDefinition>;
}

export interface StyleDefinition {
  id: StyleId;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  pageSize: "A4" | "LETTER";
  direction: "ltr" | "rtl" | "auto";
  recommendedPages: [number, number];
  sections: StyleSection[];
  fieldRules: Partial<Record<FieldPath, FieldRule>>;
  theme: StyleTheme;
  variants?: StyleVariant[];
}

export interface StyleWarning {
  field: FieldPath;
  reason: string;
}
