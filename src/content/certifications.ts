export interface Certification {
  id: string;
  name: string;
  shortName: string;
  issuer: string;
  url: string;
  type: "microsoft" | "google";
}

export const certifications: Certification[] = [
  {
    id: "credly-az900",
    name: "Microsoft Certified: Azure Fundamentals (AZ-900)",
    shortName: "Azure AZ-900",
    issuer: "Microsoft",
    url: "https://www.credly.com/badges/976dd21a-0f47-4552-9afb-29bf515857c1",
    type: "microsoft",
  },
  {
    id: "credly-dp900",
    name: "Microsoft Certified: Azure Data Fundamentals (DP-900)",
    shortName: "Azure DP-900",
    issuer: "Microsoft",
    url: "https://www.credly.com/badges/e78e744f-b633-47b2-b53d-06b6b03f3099",
    type: "microsoft",
  },
  {
    id: "google-genai",
    name: "Introduction to Generative AI, Google Cloud",
    shortName: "Google Cloud Intro to GenAI",
    issuer: "Google Cloud",
    url: "https://www.skills.google/public_profiles/473f841d-c7bd-493d-a580-34e95d39d039/badges/4599767",
    type: "google",
  },
];
