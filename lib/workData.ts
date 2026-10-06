export interface WorkItem {
  slug: string;
  number: string;
  title: string;
  tagline: string;
  summaryTagline?: string;
  company: string;
  role: string;
  duration: string;
  tools: string;
  illustrationType: string;
  overview: string;
  challenge: string;
  challengeTitle?: string;
  process: string[];
  processIntro?: string;
  approach: string;
  keyContributions: string[];
  outcome: string;
  showAtAGlance?: boolean;
  learnings?: string;
  layoutVersion?: number;
  featured: boolean;
  archived: boolean;
  layoutFormat: "standard" | "narrative" | "process-heavy" | "before-after" | "minimal";
}

// --- FEATURED WORK (shown on homepage + work page) ---

const fitpass: WorkItem = {
  slug: "fitpass-partner-app",
  number: "01",
  title: "Partner App Redesign",
  tagline:
    "Turning a fragmented partner experience into a clearer operating system for gym and studio teams",
  summaryTagline:
    "Rebuilding the operations console for India’s largest fitness network",
  company: "Fitpass",
  role: "Product Designer",
  duration: "6 months",
  tools: "Figma, FigJam",
  illustrationType: "fitpass",
  overview:
    "FITPASS connects fitness enthusiasts with gyms and studios across India. The Partner App is used by gym owners and managers to manage bookings, sessions, schedules, and day-to-day operations.\nAs the product evolved, more features and workflows were added over time. The opportunity was to bring these experiences together into a clearer, more structured product built around the way partners actually manage their day.",
  challenge:
    "Running a fitness centre means keeping track of several things at once. Bookings, upcoming sessions, active workouts, schedules, payments, and partner information all need attention throughout the day. The existing experience had grown around individual features, which made it harder to get a quick overview of what was happening and find the right action when needed.\n\nThe challenge was to create a more cohesive experience that helped gym owners and managers understand their day at a glance and get to important tasks quickly.",
  processIntro:
    "The redesign followed a structured, research-driven process from audit to handoff:",
  process: [
    "Interface Audit",
    "Information Architecture",
    "Workflow Mapping",
    "Module Definition",
    "Navigation Redesign",
    "Design System Extension",
    "Dashboard Design",
    "Handoff & QA",
  ],
  approach:
    "Instead of treating each feature as a separate destination, I looked at the product around the tasks partners needed to accomplish every day. This led to a simpler information structure, clearer navigation, and a more visual way to surface the most important information.\n\nThe experience also needed to work for different partner roles, so the product was structured around the needs of both gym owners and managers.",
  keyContributions: [
    "Restructured the information architecture around partner workflows",
    "Defined clearer modules for bookings, sessions, schedules, and other daily operations",
    "Designed task-focused navigation to make important actions easier to find",
    "Introduced a real-time view of people currently working out",
    "Designed a visual Today view to give partners a quick overview of their day",
    "Created role-specific experiences for gym owners and managers",
    "Extended the existing design system with additional components for partner workflows",
    "Worked across both mobile and desktop experiences",
  ],
  outcome:
    "The redesign brought more structure and visibility to the Partner App. Instead of navigating through individual features to understand what was happening, partners could get a clearer picture of their day and move between important operational tasks more easily.\n\nThe result was a more cohesive foundation for the growing set of tools partners use to run their fitness businesses.",
  showAtAGlance: true,
  learnings:
    "Operational products don't always need more features. They need a better way to bring the right information together.\n\nFor the Partner App, the biggest shift was moving from a collection of features to an experience organised around the partner's day.",
  layoutVersion: 2,
  featured: true,
  archived: false,
  layoutFormat: "process-heavy",
};

const abhiloans: WorkItem = {
  slug: "abhiloans-onboarding",
  number: "02",
  title: "Onboarding Redesign",
  tagline:
    "Streamlining the path from sign-up to first loan for 500K+ users",
  company: "Abhiloans",
  role: "Product Designer",
  duration: "3 months",
  tools: "Figma, Maze",
  illustrationType: "abhiloans",
  overview:
    "Abhiloans (by Knab Finance) is a fintech platform trusted by over 500,000 Indians that lets users borrow against mutual funds, shares, and bonds — getting funds disbursed within 4 hours without impacting their credit score. I redesigned the onboarding flow to make the journey from sign-up to loan application fast, intuitive, and friction-free, directly targeting the high drop-off rates in the existing multi-step process.",
  challengeTitle: "The Problem",
  challenge:
    "Getting a loan against your investments involves several financial and compliance-related steps.\nThe existing onboarding required users to navigate through multiple stages before completing their loan application. Progress was not always clear, information had to be entered more than once, and users frequently dropped off at key moments, particularly during KYC verification and securities pledging.\n\nThe challenge was to make a complex financial process feel simple and predictable, without removing the steps required to complete it",
  process: [
    "Existing Flow Audit",
    "Journey Mapping",
    "Friction Audit",
    "Flow Restructuring",
    "Progressive Disclosure",
    "UI Design",
    "Flow Refinement",
  ],
  approach:
    "I looked at the onboarding journey as one continuous experience rather than a collection of individual steps. The goal was to reduce the cognitive load at each stage, make progress easier to understand, and give users the right information at the right moment.\n\nThe redesigned flow introduced clearer stages, reduced redundant information, surfaced the loan summary earlier, and simplified financial terminology. For third-party and regulated screens that could not be redesigned directly, the experience was improved through contextual screens that prepared users for what was coming next.",
  keyContributions: [
    "Restructured the multi-step onboarding journey into clearer stages",
    "Reduced repeated information and unnecessary data entry",
    "Introduced clearer progress indicators across the journey",
    "Surfaced the loan summary early to set expectations",
    "Simplified complex financial terms such as overdraft and term loans",
    "Designed contextual screens to prepare users for third-party and regulated flows",
    "Refined the UI to create a more consistent experience across the onboarding journey",
  ],
  outcome:
    "The redesigned flow brought greater structure and continuity to a complex financial journey. Users could understand where they were in the process, what was required next, and what they were applying for without having to navigate the entire journey at once.\n\nThe experience made a multi-step loan application feel more guided while continuing to accommodate the compliance and third-party requirements behind the scenes.",
  learnings:
    "Financial products often come with complexity that design cannot simply remove.\nThe opportunity is to organise that complexity so users don't have to carry it themselves.",
  layoutVersion: 2,
  featured: true,
  archived: false,
  layoutFormat: "before-after",
};

const ema: WorkItem = {
  slug: "ema-persona-chatbot",
  number: "03",
  title: "Persona & Chatbot Builder",
  tagline:
    "Making enterprise AI agent creation intuitive for non-technical users",
  company: "Ema",
  role: "Product Designer",
  duration: "4 months",
  tools: "Figma, FigJam, Storybook",
  illustrationType: "ema",
  overview:
    "Ema is an enterprise AI platform — backed by $25M in funding — that provides \"Universal AI employees\" to automate complex business workflows. The platform integrates with 200+ enterprise applications using its proprietary EmaFusion technology (combining 100+ LLMs). I designed the persona builder and chatbot setup experience — the core interfaces through which enterprise teams create, configure, and deploy custom AI agents across their organization.",
  challenge:
    "Ema's platform handles deeply technical AI configuration — selecting models, defining agent behaviors, setting data permissions, and connecting to enterprise tools. The challenge was designing interfaces where HR managers, IT admins, and operations teams (not AI engineers) could confidently create and configure AI agents. The system needed to expose powerful configuration options while keeping the experience approachable, and it had to reflect Ema's emphasis on data governance, SOC2/HIPAA compliance, and enterprise-grade security.",
  process: [
    "Stakeholder Alignment",
    "User Persona Mapping",
    "Information Architecture",
    "Persona Builder UX",
    "Chatbot Config Flow",
    "Integration Design",
    "Design Review Cycles",
  ],
  approach:
    "I mapped the different user types — from technical admins to business users — and designed progressive configuration flows that matched each audience's mental model. For the persona builder, I created a guided, step-by-step experience that abstracted LLM selection and prompt engineering into intuitive choices. For the chatbot setup, I designed integration touchpoints that made connecting enterprise tools feel like a natural extension of the configuration flow. Throughout, I embedded security and compliance signals directly into the UI rather than relegating them to settings.",
  keyContributions: [
    "Designed the persona builder — a guided flow for creating custom AI agents with specific behaviors and knowledge domains",
    "Created the chatbot setup and configuration experience with clear steps from creation to deployment",
    "Designed integration touchpoints for connecting AI agents with 200+ enterprise applications",
    "Balanced configuration depth for technical users with simplicity for business users through progressive disclosure",
    "Embedded data governance, security, and compliance indicators directly into configuration flows",
    "Built a consistent component language across persona management, chatbot config, and agent monitoring",
  ],
  outcome:
    "Delivered an intuitive platform that enabled enterprise teams — not just engineers — to create, configure, and deploy custom AI agents. The persona builder became a key differentiator for Ema, making AI agent creation accessible to non-technical users while preserving the configurability that technical teams needed. The design supported Ema's growth as they scaled across enterprises handling 250,000+ employees.",
  featured: true,
  archived: false,
  layoutFormat: "narrative",
};

// --- MAIN WORK (shown on work page, not homepage) ---

const epic: WorkItem = {
  slug: "epic-reading-onboarding",
  number: "04",
  title: "Onboarding Redesign",
  tagline:
    "Unifying the first-time experience across mobile, web, and tablet for 50M kids",
  company: "Epic",
  role: "UX Designer",
  duration: "3 months",
  tools: "Figma, Miro, UserTesting",
  illustrationType: "epic",
  overview:
    "Epic is a digital reading platform for kids under 12 — used by 50 million children and 2 million teachers globally, with a presence in 90% of US elementary schools. Acquired by BYJU'S for $500M, Epic offers 40,000+ books from publishers like HarperCollins, National Geographic, and Encyclopaedia Britannica. I redesigned the homepage and optimized the onboarding flow across mobile, web, and tablet to create a consistent, engaging first experience for young readers and their parents.",
  challenge:
    "Each platform — mobile, web, and tablet — had evolved independently, resulting in inconsistent onboarding flows that confused both parents signing up and kids getting started. The mobile app had different steps than the web experience, tablet had its own variation, and there was no unified approach to guiding new users. For a product serving 50M kids across multiple devices, this fragmentation meant lost signups and a disjointed brand experience.",
  process: [
    "Cross-platform Audit",
    "Competitive Research",
    "User Journey Mapping",
    "Low-fi Wireframes",
    "Stakeholder Review",
    "High-fi Design",
    "Platform QA",
  ],
  approach:
    "I started by auditing the existing onboarding across all three platforms, documenting every divergence. I then researched onboarding patterns in other children's apps and educational platforms to identify best practices. Working from low-fidelity wireframes, I designed a unified onboarding architecture that adapted to each platform's strengths while maintaining a consistent core flow. Multiple rounds of stakeholder feedback refined the designs before I produced high-fidelity screens for both web and mobile.",
  keyContributions: [
    "Conducted a comprehensive audit of onboarding across iOS, Android, web, and tablet",
    "Benchmarked competitor onboarding patterns in children's educational apps",
    "Designed a unified onboarding architecture adaptable across all platforms",
    "Created low-fidelity wireframes to rapidly explore and validate approaches",
    "Delivered high-fidelity designs for web and mobile with platform-appropriate adaptations",
    "Ensured visual and interaction consistency while respecting platform conventions",
  ],
  outcome:
    "Produced a cohesive, cross-platform onboarding flow that gave new users — parents and kids alike — a consistent introduction to Epic regardless of device. The redesigned flow reduced friction during sign-up and helped users reach the reading experience faster, supporting Epic's mission to get more kids reading.",
  featured: false,
  archived: false,
  layoutFormat: "standard",
};

const portfolio: WorkItem = {
  slug: "preritayadav-portfolio",
  number: "05",
  title: "Portfolio Website",
  tagline:
    "A hand-drawn, canvas-based portfolio that is itself a design artifact",
  company: "Personal",
  role: "Designer & Developer",
  duration: "Ongoing",
  tools: "Figma, Next.js, tldraw, Tailwind CSS",
  illustrationType: "portfolio",
  overview:
    "Designed and developed preritayadav.com — a portfolio that rejects template conventions in favor of an interactive canvas experience. Built with Next.js and tldraw, the site uses hand-drawn shapes, wobbly borders, and a sketch-like visual language to turn the portfolio itself into a piece of design work.",
  challenge:
    "Designer portfolios tend to look the same — clean grids, sans-serif type, predictable layouts. The challenge was building something that felt genuinely personal and memorable while remaining functional, accessible, and professional. The site needed to be a portfolio and a demonstration of design thinking simultaneously.",
  process: [
    "Concept Exploration",
    "Visual Language Definition",
    "Component Design",
    "Canvas Architecture",
    "Development",
    "Iteration",
  ],
  approach:
    "I explored the idea of a hand-drawn canvas as the primary interaction model — treating the portfolio like a living sketchbook rather than a collection of pages. Using tldraw as the rendering engine, I designed custom shape components (project cards, annotations, buttons), developed the wobbly visual language, and built a browse-only interaction mode that lets visitors navigate without editing tools.",
  keyContributions: [
    "Conceived the hand-drawn canvas concept as a portfolio medium",
    "Designed custom tldraw shapes for project cards, annotations, buttons, and image frames",
    "Developed the wobbly, sketch-like visual language with deterministic randomness",
    "Built responsive canvas layouts for all pages using a layout creator pattern",
    "Implemented browse-only interaction mode with custom cursor and hover states",
    "Created accessible navigation alongside the visual canvas for screen readers",
  ],
  outcome:
    "A one-of-a-kind portfolio experience that doubles as a demonstration of design and development craft. The hand-drawn aesthetic creates a memorable first impression, the canvas-based navigation invites exploration, and the technical implementation showcases the ability to bridge design vision with engineering execution.",
  featured: false,
  archived: false,
  layoutFormat: "minimal",
};

// --- ARCHIVED WORK (shown in archive section on work page) ---

const superTeacher: WorkItem = {
  slug: "super-teacher-fees",
  number: "06",
  title: "Fee Management System",
  tagline:
    "Helping independent coaching teachers manage fees, payments, and reminders",
  company: "Super Teacher",
  role: "Product Designer",
  duration: "2 months",
  tools: "Figma",
  illustrationType: "superteacher",
  overview:
    "Super Teacher is a tool for independent teachers running coaching centres. I designed a fee management system that lets teachers create fee structures, track payments across students, and send automated reminders — replacing the spreadsheets and manual follow-ups that most coaching teachers rely on.",
  challenge:
    "Independent coaching teachers in India manage fees manually — through notebooks, spreadsheets, or WhatsApp messages. Tracking who has paid, who hasn't, and when to send reminders is time-consuming and error-prone. The challenge was designing a system simple enough for non-tech-savvy teachers to adopt, yet comprehensive enough to replace their existing manual workflows.",
  process: [
    "User Research",
    "Workflow Mapping",
    "Information Architecture",
    "Wireframing",
    "UI Design",
    "Prototype Testing",
  ],
  approach:
    "I mapped the existing manual fee management workflows — from creating fee structures for different courses and batches, to tracking individual student payments, to following up on overdue fees. The design centered on a dashboard that gives teachers an instant overview of their financial status, with simple flows for creating fee plans, recording payments, and triggering reminders.",
  keyContributions: [
    "Mapped manual fee workflows of independent coaching teachers",
    "Designed flexible fee structure creation for different courses and batches",
    "Built a payment tracking dashboard with at-a-glance overdue visibility",
    "Created automated reminder flows via SMS and WhatsApp",
    "Designed batch operations for managing fees across student groups",
  ],
  outcome:
    "Delivered a fee management system that replaced manual tracking with a structured, digital workflow — giving teachers clear visibility into their finances and automating the most tedious part of running a coaching centre.",
  featured: false,
  archived: true,
  layoutFormat: "standard",
};

const zkagi: WorkItem = {
  slug: "zkagi-landing",
  number: "07",
  title: "Platform Interface Design",
  tagline:
    "Communicating privacy-first AI infrastructure to developers and partners",
  company: "ZkAGI",
  role: "UI/UX Designer",
  duration: "2 months",
  tools: "Figma, Framer",
  illustrationType: "zkagi",
  overview:
    "ZkAGI is a decentralized AI infrastructure platform — the world's first privacy AI DePIN — built on zero-knowledge proofs and distributed GPU compute on Solana. The platform offers ZkTerminal (verifiable AI execution), Zynapse API, and an AI Agent Builder. I designed the interface to clearly communicate what ZkAGI is, what it offers, and how developers, partners, and curious learners can engage with the ecosystem.",
  challenge:
    "ZkAGI sits at the intersection of three complex domains: zero-knowledge cryptography, artificial intelligence, and decentralized infrastructure. The interface needed to make this accessible to three very different audiences — developers who want to build, partners who want to integrate, and newcomers who want to understand. The challenge was communicating deep technical concepts without dumbing them down or losing the audiences that actually need to use the platform.",
  process: [
    "Audience Mapping",
    "Content Strategy",
    "Visual Direction",
    "Layout Design",
    "Responsive Implementation",
    "Review & Iteration",
  ],
  approach:
    "I started by mapping the three primary audiences and their entry motivations. The design uses progressive depth — the landing page leads with a clear mission statement, then unfolds into product offerings, technical differentiators, and calls to action for each audience. Visual hierarchy guides visitors from \"what is this\" to \"how do I use it\" without forcing them through content they don't need.",
  keyContributions: [
    "Designed a landing experience that communicates ZkAGI's mission in seconds",
    "Created distinct engagement paths for developers, partners, and learners",
    "Translated zero-knowledge proof and DePIN concepts into clear visual language",
    "Designed product sections for ZkTerminal, Zynapse API, and Compute Cluster",
    "Built responsive layouts optimized for both desktop-first developer audiences and mobile",
  ],
  outcome:
    "Delivered an interface that makes ZkAGI's complex technology stack approachable — helping the platform communicate its value proposition clearly to developers, potential partners, and the broader crypto-AI community.",
  featured: false,
  archived: true,
  layoutFormat: "narrative",
};

const mentorDashboard: WorkItem = {
  slug: "toppr-mentor-dashboard",
  number: "08",
  title: "Mentor Dashboard",
  tagline:
    "Empowering mentors to track student progress and communicate with parents in real time",
  company: "Toppr",
  role: "UX Designer",
  duration: "1 month",
  tools: "Figma, Sketch",
  illustrationType: "toppr",
  overview:
    "Toppr is India's leading adaptive learning platform, using AI to deliver personalized education to over a million students across K12 syllabi. During my first month at Toppr, I collaborated on the Mentor Dashboard — a tool that empowers mentors to monitor student progress in real time, track learning milestones, and communicate directly with parents about their child's performance.",
  challenge:
    "Mentors at Toppr needed to track dozens of students simultaneously, each with unique learning paths generated by the platform's AI. The existing tools gave mentors raw data but no structured way to identify which students needed attention, what milestones had been hit or missed, or how to communicate progress to parents. The dashboard needed to surface actionable insights from complex adaptive learning data.",
  process: [
    "Stakeholder Interviews",
    "Data Analysis",
    "Wireframing",
    "Rapid Prototyping",
    "Design Review",
  ],
  approach:
    "I worked with the product and data teams to understand what signals mattered most to mentors — which students were falling behind, who was making strong progress, and what patterns needed parent communication. The dashboard design prioritized at-a-glance status for each student, drill-down views for detailed progress, and integrated parent communication tools so mentors could act on insights without switching contexts.",
  keyContributions: [
    "Designed real-time student progress monitoring views for mentors",
    "Created at-a-glance status indicators that surfaced students needing attention",
    "Built drill-down views for individual student learning paths and milestones",
    "Integrated parent communication tools directly into the mentor workflow",
    "Collaborated with data team to translate adaptive learning metrics into mentor-friendly insights",
  ],
  outcome:
    "Delivered a mentor dashboard that transformed raw adaptive learning data into actionable student insights, enabling mentors to proactively support students and keep parents informed — all within a single, focused interface.",
  featured: false,
  archived: true,
  layoutFormat: "minimal",
};

const birdTab: WorkItem = {
  slug: "bird-tab",
  number: "09",
  title: "BirdTab",
  tagline:
    "A Chrome extension that turns every new tab into a bird discovery moment",
  company: "Personal Play",
  role: "Designer & Developer",
  duration: "Ongoing",
  tools: "Figma, React, Chrome APIs",
  illustrationType: "birdtab",
  overview:
    "BirdTab is a personal project — a Chrome extension for bird enthusiasts where every new tab reveals a beautiful bird from your region. It's a small, joyful piece of software that turns the mundane act of opening a browser tab into a moment of discovery and connection with the natural world.",
  challenge:
    "New tab extensions are a crowded space, but most focus on productivity or generic nature photography. The challenge was designing something specifically for bird lovers — with regional relevance, species information, and a visual experience that makes you pause and appreciate rather than immediately navigate away.",
  process: [
    "Concept",
    "Bird Data Research",
    "Visual Design",
    "Extension Architecture",
    "Development",
    "Beta Testing",
  ],
  approach:
    "I designed the experience around the moment of delight — the split second when a new tab opens and you see a bird you recognize (or one you've never seen before). The design is deliberately minimal: a full-bleed photograph, the bird's name, and a subtle region indicator. Everything else stays out of the way. Regional data comes from bird observation APIs to show species actually found near the user.",
  keyContributions: [
    "Conceived and designed the product from idea to implementation",
    "Created a minimal, photography-first interface that prioritizes the bird",
    "Integrated regional bird data to show species relevant to the user's location",
    "Designed species information cards that educate without overwhelming",
    "Built the Chrome extension with React and browser APIs",
  ],
  outcome:
    "A small, personal project that brings a moment of calm and curiosity to every new browser tab — turning a utility action into a chance to learn about the birds that share your environment.",
  featured: false,
  archived: true,
  layoutFormat: "minimal",
};

export const workItems: WorkItem[] = [
  fitpass,
  abhiloans,
  ema,
  epic,
  portfolio,
  superTeacher,
  zkagi,
  mentorDashboard,
  birdTab,
];

export function getFeaturedWork(): WorkItem[] {
  return workItems.filter((item) => item.featured);
}

export function getMainWork(): WorkItem[] {
  return workItems.filter((item) => !item.archived);
}

export function getArchivedWork(): WorkItem[] {
  return workItems.filter((item) => item.archived);
}

export function getWorkBySlug(slug: string): WorkItem | undefined {
  return workItems.find((item) => item.slug === slug);
}
