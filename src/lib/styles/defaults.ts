import type { CVProfile, PersonalInfo, ExperienceEntry, EducationEntry, SkillEntry, LanguageEntry } from "@/types/cv";

export const defaultPersonalInfo: PersonalInfo = {
  firstName: "",
  lastName: "",
  headline: "",
  email: "",
  phone: "",
  phoneCountryCode: "+212",
  website: "",
  linkedin: "",
  github: "",
  city: "",
  country: "Maroc",
  photoKey: null,
  dateOfBirth: null,
  nationality: null,
  maritalStatus: null,
  drivingLicense: [],
  cin: null,
  visaStatus: null,
};

export function createEmptyCV(overrides?: Partial<CVProfile>): CVProfile {
  return {
    id: "",
    userId: null,
    name: "Mon CV",
    cvLanguage: "fr",
    activeStyleId: "canadian",
    customization: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    personal: { ...defaultPersonalInfo },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    languages: [],
    certifications: [],
    projects: [],
    volunteering: [],
    interests: [],
    references: [],
    ...overrides,
  };
}
