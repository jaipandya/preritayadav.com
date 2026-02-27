export interface WorkItem {
  slug: string;
  number: string;
  title: string;
  tagline: string;
  company: string;
  role: string;
  duration: string;
  tools: string;
  illustrationType: string;
  overview: string;
  challenge: string;
  process: string[];
  approach: string;
  keyContributions: string[];
  outcome: string;
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
    "Rebuilding the operations console for India's largest fitness network",
  company: "Fitpass",
  role: "Product Designer",
  duration: "6 months",
  tools: "Figma, FigJam, Google Analytics",
  illustrationType: "fitpass",
  overview:
    "Fitpass is India's largest fitness network, connecting 6 million+ users with thousands of gyms and studios across 75+ cities. The Partner App is the operations backbone used by gym owners and managers to manage bookings, track sessions, and run their daily business. I redesigned this app from the ground up — transforming a fragmented, engineer-built tool into a structured operations console with clear workflows, task-first navigation, and real-time operational visibility.",
  challenge:
    "The existing Partner App had been built incrementally by engineering teams without a unified design vision. Gym owners struggled with disjointed navigation, buried features, and no clear view of their daily operations. Key pain points included: no information hierarchy across screens, features organized by technical modules rather than user tasks, no way to see today's schedule or live workout sessions at a glance, and low adoption of newer features because they were hard to discover.",
  process: [
    "Interface Audit",
    "Partner Interviews",
    "Information Architecture",
    "Module Definition",
    "Navigation Redesign",
    "Design System Extension",
    "Dashboard Design",
    "Handoff & QA",
  ],
  approach:
    "I worked independently on this redesign, starting with a thorough audit of every screen in the existing app. Through conversations with gym owners and analysis of usage data, I mapped out their core daily tasks — checking today's bookings, monitoring active workouts, managing schedules, and tracking earnings. This led me to re-architect the entire information structure around these workflows rather than technical modules. I introduced task-first navigation that surfaced daily priorities, and extended the existing design system with partner-specific components.",
  keyContributions: [
    "Re-architected the full information structure around partner workflows and daily tasks",
    "Defined core modules based on primary user tasks — bookings, sessions, earnings, schedule",
    "Designed task-first navigation that surfaces what gym owners need each day",
    "Built a real-time workout monitoring feature for tracking live sessions across the facility",
    "Created a visual \"Today\" dashboard — the first screen partners see — showing bookings, active sessions, and daily metrics",
    "Extended the design system with reusable components tailored to partner operations",
    "Improved feature discoverability, making newer capabilities visible within natural workflows",
  ],
  outcome:
    "The redesign transformed a feature-heavy, engineer-led interface into a cohesive operations console built for clarity and scale. Gym owners could now start their day with a clear view of what's happening, monitor sessions in real time, and navigate the app around tasks rather than hunting through menus. The new structure significantly improved feature discoverability and set the foundation for scaling the partner platform across Fitpass's growing network of 75+ cities.",
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
  role: "UX Designer",
  duration: "3 months",
  tools: "Figma, Maze, Hotjar",
  illustrationType: "abhiloans",
  overview:
    "Abhiloans (by Knab Finance) is a fintech platform trusted by over 500,000 Indians that lets users borrow against mutual funds, shares, and bonds — getting funds disbursed within 4 hours without impacting their credit score. I redesigned the onboarding flow to make the journey from sign-up to loan application fast, intuitive, and friction-free, directly targeting the high drop-off rates in the existing multi-step process.",
  challenge:
    "The existing onboarding required users to navigate too many steps before they could even begin a loan application. The interface was cluttered, progress was unclear, and users frequently dropped off at key moments — particularly during KYC verification and securities pledging. For a product that promises loans in 4 hours, the onboarding felt anything but quick. The challenge was to make a process that involves financial compliance feel effortless.",
  process: [
    "Drop-off Analysis",
    "User Interviews",
    "Flow Mapping",
    "Friction Audit",
    "Progressive Disclosure",
    "UI Design",
    "Usability Testing",
  ],
  approach:
    "I started with Hotjar recordings and funnel analytics to pinpoint exactly where users were dropping off and why. User interviews revealed that the biggest frustrations were around unclear progress, redundant data entry, and anxiety about financial steps. I redesigned the flow using progressive disclosure — showing only what's needed at each step — with clear progress indicators, inline validation, and contextual guidance that reassured users about security and compliance at every stage.",
  keyContributions: [
    "Analyzed drop-off data and heatmaps to identify the highest-friction steps in the funnel",
    "Conducted user interviews focused on trust, anxiety, and cognitive load during financial onboarding",
    "Redesigned the multi-step flow into a streamlined progressive disclosure pattern",
    "Added clear progress indicators so users always knew where they stood",
    "Designed inline validation and contextual help to reduce errors and support anxiety",
    "Created a security-first visual language that reinforced trust at every financial step",
    "Validated the new flow through moderated usability testing with target users",
  ],
  outcome:
    "The redesigned onboarding significantly reduced time-to-first-loan and improved conversion rates through the application funnel. Users reported feeling more confident during the process, and the new progressive disclosure pattern became a template for other flows across the Abhiloans platform. The work helped the platform better deliver on its core promise: quick, hassle-free loans against securities.",
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
