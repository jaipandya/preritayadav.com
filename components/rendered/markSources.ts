/**
 * Logo tile image per case study (public/logos). Items without an entry show the company initial.
 * `fit: "cover"` is for full-bleed app icons. `contain` is for marks that need air around them, `pad` is that air in px at the small size.
 */
export const markSources: Record<string, { src: string; fit: "cover" | "contain"; pad?: number }> = {
  "fitpass-partner-app": { src: "/logos/mark/fitpass-emblem.svg", fit: "contain", pad: 7 },
  "abhiloans-onboarding": { src: "/logos/square/abhiloans.png", fit: "contain", pad: 1 },
  "ema-persona-chatbot": { src: "/logos/square/ema.png", fit: "cover" },
  "epic-reading-onboarding": { src: "/logos/epic.svg", fit: "contain", pad: 3 },
  "preritayadav-portfolio": { src: "/icon.svg", fit: "cover" },
  "zkagi-landing": { src: "/logos/square/zkagi.png", fit: "contain", pad: 7 },
  "toppr-mentor-dashboard": { src: "/logos/mark/toppr-emblem.svg", fit: "contain", pad: 7 },
  "super-teacher-fees": { src: "/logos/mark/toppr-emblem.svg", fit: "contain", pad: 7 },
};
