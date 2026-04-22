export const hero = {
  greeting: "Hello!",
  name: "I'm Prerita.",
  subtitle:
    "Product Designer & Creative Thinker\nCrafting intuitive, human-centered experiences",
  cta: { label: "Let's talk", href: "/contact" },
};

export const blogPosts = [
  {
    title: "Hatch Conference 2023",
    description: "A few notes from the Design Conference in Berlin",
    href: "https://medium.com/@preritayadav/hatch-conference-2023-a-few-notes-from-the-design-conference-in-berlin-2c2d1cf5d7de",
  },
  {
    title: "10kdesigners Masterclass",
    description: "My experience at the UX/UI design cohort",
    href: "https://medium.com/@preritayadav/10kdesigners-ux-ui-masterclass-my-experience-at-the-design-cohort-3fcee5ce74a0",
  },
  {
    title: "UX Research Case Study",
    description: "Research on India's most popular programming community",
    href: "https://medium.com/design-bootcamp/case-study-ux-research-on-indias-most-popular-programming-community-4fed6a1fc476",
  },
  {
    title: "Event Landing Page",
    description: "Designing an event landing page: a case study",
    href: "https://medium.com/design-bootcamp/event-landing-page-a-case-study-2e7a7595309f",
  },
  {
    title: "Fitness App Research",
    description: "Creating a survey and user interview for a fitness app",
    href: "https://medium.com/design-bootcamp/case-study-creating-a-survey-and-user-interview-for-a-fitness-app-a52b3fa7d843",
  },
];

export const designPrinciples = [
  "User-first: starting with deep empathy",
  "Iterative: building, testing, and refining",
  "Inclusive: designing for all, without compromise",
];

export const team = {
  title: "Who I collaborate with",
  subtitle: "Founders, engineers & product teams",
  count: 7,
};

export type SkillIcon = "analytics" | "design" | "content" | "communication";

export const skills: Array<{ icon: SkillIcon; label: string }> = [
  { icon: "analytics", label: "Research" },
  { icon: "design", label: "Design" },
  { icon: "content", label: "Content" },
  { icon: "communication", label: "Strategy" },
];

export const testimonial = {
  heading: "Kind words",
  quote:
    '"Prerita seamlessly bridges the gap between deep UX research and high-fidelity product prototyping. Her strategic approach to product design makes complex, ambiguous problems feel effortless to solve."',
};

export const footerIcons: Array<{
  icon: SkillIcon;
  label: string;
  href: string;
}> = [
  { icon: "design", label: "About", href: "/about" },
  { icon: "content", label: "Work", href: "/work" },
  { icon: "communication", label: "Email", href: "mailto:hello@preritayadav.com" },
];

export const footerClosing = "Let's build something great.";
export const footerCta = { label: "Say hello", href: "/contact" };
