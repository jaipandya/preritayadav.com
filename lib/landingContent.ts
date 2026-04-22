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

export type OutsideWorkIllustration = "mentoring" | "travel" | "tinkering";

export const outsideWork = {
  heading: "Outside work",
  items: [
    {
      number: "1",
      title: "Mentoring at 10kdesigners",
      subtitle: "Giving back to the place that shaped me",
      description:
        "I was part of Cohort 4 at 10kdesigners, where I deep-dived into the world of product design. Since graduating from 10K, I\u2019ve been mentoring new designers\u2014sharing what I\u2019ve learned, jamming on projects, and helping them find their footing.",
      illustration: "mentoring" as OutsideWorkIllustration,
    },
    {
      number: "2",
      title: "Travelling to new places and meeting people",
      subtitle: "Design takes a seat, curiosity takes the wheel",
      description:
        "I love exploring new places and meeting folks from different walks of life. Travel helps me stay curious, notice the little things, and bring fresh perspectives.",
      illustration: "travel" as OutsideWorkIllustration,
    },
    {
      number: "3",
      title: "Tinkering with tiny projects",
      subtitle: "I try and I sometimes glue my fingers together",
      description:
        "From a travel calendar that doubles as postcard, to crocheting fingerless gloves (because ten fingers is too many)\u2014I love picking up random skills and turning them into little side projects. Nothing is too small to make or too weird to try.",
      illustration: "tinkering" as OutsideWorkIllustration,
    },
  ],
};

export const teamsWorkedWith = {
  heading: "Teams I have worked with",
  companies: [
    "toppr",
    "byjus",
    "ema",
    "10kdesigners",
    "abhiloans",
    "zkagi",
    "fitpass",
    "epic",
  ],
  companyNames: [
    "Toppr",
    "Byju's",
    "EMA",
    "10kdesigners",
    "AbhiLoans",
    "zkAGI",
    "FitPass",
    "Epic",
  ],
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
