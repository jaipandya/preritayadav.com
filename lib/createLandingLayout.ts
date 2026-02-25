import type { Editor } from "tldraw";

const CANVAS_W = 560;
const LEFT_PAD = 20;

export function createLandingLayout(editor: Editor) {
  let y = 30;

  // --- HERO SECTION ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 400,
      h: 24,
      text: "Hello!",
      fontSize: 16,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "hero-hello" },
  });

  y += 30;

  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 500,
      h: 50,
      text: "I am Prerita",
      fontSize: 38,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "hero-title" },
  });

  y += 75;

  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 350,
      h: 60,
      text: "UX Designer & Creative Thinker\nBuilding experiences that matter\nCurrently open to new opportunities",
      fontSize: 14,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "hero-sub" },
  });

  y += 85;

  editor.createShape({
    type: "hand-drawn-button",
    x: LEFT_PAD,
    y,
    props: { w: 120, h: 34, label: "Contact me" },
    meta: {
      componentType: "button",
      variationId: "hero-cta",
      href: "/contact",
    },
  });

  y += 100;

  // --- MY LATEST WORK ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 300,
      h: 40,
      text: "My latest work",
      fontSize: 22,
      showArrow: true,
      arrowDirection: "down",
    },
    meta: { componentType: "annotation", variationId: "latest-work-heading" },
  });

  y += 80;

  // --- PROJECT CARDS ---
  const projects = [
    {
      number: "01",
      title: "Redesigning the Checkout",
      description: "Redesigning the checkout experience for a leading e-commerce platform",
      mediaType: "image" as const,
      slug: "redesigning-checkout",
    },
    {
      number: "02",
      title: "Design System",
      description: "Building a comprehensive design system from scratch",
      mediaType: "video" as const,
      slug: "design-system",
    },
    {
      number: "03",
      title: "Mobile App",
      description: "A mobile-first approach to food delivery service",
      mediaType: "image" as const,
      slug: "mobile-app",
    },
    {
      number: "04",
      title: "Brand Identity",
      description: "Creating a bold brand identity for a tech startup",
      mediaType: "video" as const,
      slug: "brand-identity",
    },
    {
      number: "05",
      title: "Analytics Dashboard",
      description: "Data visualization and reporting dashboard for enterprise",
      mediaType: "image" as const,
      slug: "dashboard",
    },
    {
      number: "06",
      title: "Marketing Site",
      description: "High-converting landing pages and marketing website",
      mediaType: "video" as const,
      slug: "marketing-site",
    },
  ];

  for (const project of projects) {
    editor.createShape({
      type: "project-card",
      x: LEFT_PAD,
      y,
      props: {
        w: CANVAS_W - LEFT_PAD * 2,
        h: project.mediaType === "image" ? 260 : 180,
        number: project.number,
        title: project.title,
        description: project.description,
        mediaType: project.mediaType,
      },
      meta: {
        componentType: "project-card",
        variationId: `project-${project.slug}`,
        href: `/project/${project.slug}`,
      },
    });

    y += project.mediaType === "image" ? 300 : 220;
  }

  // --- BLOG SECTION ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 300,
      h: 40,
      text: "From the blog",
      fontSize: 22,
      showArrow: true,
      arrowDirection: "down",
    },
    meta: { componentType: "annotation", variationId: "blog-heading" },
  });

  y += 70;

  const blogPosts = [
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
      description: "Designing an event landing page — a case study",
      href: "https://medium.com/design-bootcamp/event-landing-page-a-case-study-2e7a7595309f",
    },
    {
      title: "Fitness App Research",
      description: "Creating a survey and user interview for a fitness app",
      href: "https://medium.com/design-bootcamp/case-study-creating-a-survey-and-user-interview-for-a-fitness-app-a52b3fa7d843",
    },
  ];

  for (const post of blogPosts) {
    editor.createShape({
      type: "annotation",
      x: LEFT_PAD,
      y,
      props: {
        w: CANVAS_W - LEFT_PAD * 2,
        h: 22,
        text: post.title,
        fontSize: 16,
        showArrow: false,
        arrowDirection: "right",
      },
      meta: {
        componentType: "annotation",
        variationId: `blog-${post.title.toLowerCase().replace(/\s+/g, "-")}`,
        href: post.href,
      },
    });

    y += 24;

    editor.createShape({
      type: "annotation",
      x: LEFT_PAD + 10,
      y,
      props: {
        w: CANVAS_W - LEFT_PAD * 2 - 10,
        h: 18,
        text: post.description,
        fontSize: 12,
        showArrow: false,
        arrowDirection: "right",
      },
      meta: {
        componentType: "annotation",
        variationId: `blog-desc-${post.title.toLowerCase().replace(/\s+/g, "-")}`,
      },
    });

    y += 40;
  }

  y += 20;

  // --- DESIGN PHILOSOPHY ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 350,
      h: 50,
      text: "My design philosophy",
      fontSize: 20,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "design-philosophy" },
  });

  y += 50;

  const philosophyLines = [
    "User-first — every decision starts with empathy",
    "Iterative — ship, learn, refine, repeat",
    "Accessible — design that works for everyone",
  ];

  for (const line of philosophyLines) {
    editor.createShape({
      type: "annotation",
      x: LEFT_PAD + 10,
      y,
      props: {
        w: 400,
        h: 24,
        text: line,
        fontSize: 13,
        showArrow: false,
        arrowDirection: "right",
      },
      meta: { componentType: "annotation", variationId: "design-philosophy-line" },
    });
    y += 28;
  }

  y += 30;

  // --- TEAM / PEOPLE SECTION ---
  editor.createShape({
    type: "team-avatars",
    x: LEFT_PAD,
    y,
    props: {
      w: CANVAS_W - LEFT_PAD * 2,
      h: 200,
      title: "Worked with amazing folks",
      subtitle: "Designers, developers & product managers",
      count: 7,
    },
    meta: { componentType: "team-avatars", variationId: "team-section" },
  });

  y += 250;

  // --- SKILLS / SERVICES SECTION ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 400,
      h: 30,
      text: "Crafted with purpose and care",
      fontSize: 16,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "skills-title" },
  });

  y += 40;

  const skills: Array<{
    icon: "analytics" | "design" | "content" | "communication";
    label: string;
  }> = [
    { icon: "analytics", label: "Research" },
    { icon: "design", label: "Design" },
    { icon: "content", label: "Content" },
    { icon: "communication", label: "Strategy" },
  ];

  skills.forEach((skill, i) => {
    editor.createShape({
      type: "skill-icon",
      x: LEFT_PAD + i * 130,
      y,
      props: {
        w: 110,
        h: 120,
        icon: skill.icon,
        label: skill.label,
      },
      meta: {
        componentType: "skill-icon",
        variationId: `skill-${skill.icon}`,
      },
    });
  });

  y += 180;

  // --- TESTIMONIAL / FEATURED ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: CANVAS_W - LEFT_PAD * 2,
      h: 30,
      text: "What people say about my work",
      fontSize: 16,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "testimonial-title" },
  });

  y += 40;

  editor.createShape({
    type: "annotation",
    x: LEFT_PAD + 10,
    y,
    props: {
      w: CANVAS_W - LEFT_PAD * 2 - 20,
      h: 100,
      text: "\"Prerita has a rare ability to translate complex problems into elegant, intuitive designs. Her attention to detail and user empathy made our product a joy to use.\"\n— Arun Mehta, Product Lead at Thinktree",
      fontSize: 14,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: {
      componentType: "annotation",
      variationId: "testimonial-quote",
    },
  });

  y += 150;

  // --- FOOTER ---
  const footerIcons: Array<{
    icon: "analytics" | "design" | "content" | "communication";
    label: string;
    href: string;
  }> = [
    { icon: "design", label: "About", href: "/contact" },
    { icon: "content", label: "Work", href: "/" },
    { icon: "communication", label: "Email", href: "mailto:hello@preritayadav.com" },
  ];

  footerIcons.forEach((item, i) => {
    editor.createShape({
      type: "skill-icon",
      x: LEFT_PAD + i * 110,
      y,
      props: {
        w: 80,
        h: 90,
        icon: item.icon,
        label: item.label,
      },
      meta: {
        componentType: "skill-icon",
        variationId: `footer-${item.label.toLowerCase()}`,
        href: item.href,
      },
    });
  });

  y += 110;

  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 300,
      h: 24,
      text: "Let's work together!",
      fontSize: 14,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "footer-closing" },
  });

  y += 35;

  editor.createShape({
    type: "hand-drawn-button",
    x: LEFT_PAD,
    y,
    props: { w: 140, h: 36, label: "Contact me" },
    meta: {
      componentType: "button",
      variationId: "footer-cta",
      href: "/contact",
    },
  });

  const vb = editor.getViewportScreenBounds();
  editor.setCamera({ x: -(CANVAS_W / 2) + vb.width / 2, y: 0, z: 1 });
}
