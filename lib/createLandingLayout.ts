import type { Editor } from "tldraw";

const CANVAS_W = 560;
const LEFT_PAD = 20;

export function createLandingLayout(editor: Editor) {
  let y = 30;

  // --- NAV BAR ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 200,
      h: 30,
      text: "preritayadav.com",
      fontSize: 16,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "nav-brand" },
  });

  editor.createShape({
    type: "hand-drawn-button",
    x: CANVAS_W - 80,
    y: y + 2,
    props: { w: 70, h: 28, label: "Login" },
    meta: { componentType: "button", variationId: "nav-login" },
  });

  y += 60;

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

  y += 55;

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

  y += 68;

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

  y += 70;

  // --- MY LATEST WORK ---
  editor.createShape({
    type: "annotation",
    x: CANVAS_W / 2 - 120,
    y,
    props: {
      w: 300,
      h: 40,
      text: "My latest work",
      fontSize: 18,
      showArrow: true,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "latest-work-heading" },
  });

  y += 60;

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

    y += project.mediaType === "image" ? 280 : 200;
  }

  // --- DESIGN BRIEF INTERSTITIAL ---
  editor.createShape({
    type: "annotation",
    x: CANVAS_W / 2 - 100,
    y,
    props: {
      w: 280,
      h: 50,
      text: "Design brief",
      fontSize: 20,
      showArrow: true,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "design-brief" },
  });

  y += 70;

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

  y += 220;

  // --- SKILLS / SERVICES SECTION ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 400,
      h: 30,
      text: "Crafted with purpose and care",
      fontSize: 14,
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

  y += 150;

  // --- TESTIMONIAL / FEATURED ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: CANVAS_W - LEFT_PAD * 2,
      h: 30,
      text: "What people say about my work",
      fontSize: 14,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "testimonial-title" },
  });

  y += 40;

  editor.createShape({
    type: "browser-frame",
    x: LEFT_PAD,
    y,
    props: {
      w: CANVAS_W - LEFT_PAD * 2,
      h: 160,
      url: "testimonials.preritayadav.com",
      contentType: "placeholder",
      src: "",
    },
    meta: {
      componentType: "browser-frame",
      variationId: "testimonial-frame",
    },
  });

  y += 180;

  // --- OUTSIDE WORK ---
  editor.createShape({
    type: "annotation",
    x: CANVAS_W / 2 - 80,
    y,
    props: {
      w: 200,
      h: 30,
      text: "Outside work",
      fontSize: 20,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "outside-work-title" },
  });

  y += 40;

  editor.createShape({
    type: "annotation",
    x: LEFT_PAD + 120,
    y,
    props: {
      w: 300,
      h: 100,
      text: "Painting & illustration\nOpen source contributions\nTravel photography\nCommunity workshops\nReading & writing",
      fontSize: 14,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "outside-interests" },
  });

  y += 120;

  // --- FOOTER ---
  const footerIcons: Array<{
    icon: "analytics" | "design" | "content" | "communication";
    label: string;
  }> = [
    { icon: "design", label: "About" },
    { icon: "content", label: "Work" },
    { icon: "communication", label: "Email" },
  ];

  footerIcons.forEach((item, i) => {
    editor.createShape({
      type: "skill-icon",
      x: CANVAS_W / 2 - 150 + i * 110,
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
      },
    });
  });

  y += 110;

  editor.createShape({
    type: "hand-drawn-button",
    x: CANVAS_W / 2 - 70,
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
