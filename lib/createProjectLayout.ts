import type { Editor } from "tldraw";

const CANVAS_W = 560;
const LEFT_PAD = 20;

interface ProjectData {
  title: string;
  description: string;
  brief: string;
  role: string;
  duration: string;
  tools: string;
}

const projectContent: Record<string, ProjectData> = {
  "redesigning-checkout": {
    title: "Redesigning the Checkout",
    description:
      "A complete overhaul of the checkout experience for a leading e-commerce platform, reducing cart abandonment by 23% and improving conversion rates.",
    brief:
      "The existing checkout flow had 6 steps and users were dropping off at the address entry stage. We needed to simplify.",
    role: "Lead UX Designer",
    duration: "3 months",
    tools: "Figma, Maze, Hotjar",
  },
  "design-system": {
    title: "Design System",
    description:
      "Built a comprehensive, scalable design system from the ground up. 120+ components, full documentation, and adoption across 4 product teams.",
    brief:
      "Inconsistent UI patterns across products were slowing development and confusing users. A unified system was overdue.",
    role: "Design Systems Lead",
    duration: "6 months",
    tools: "Figma, Storybook, Tokens Studio",
  },
  "mobile-app": {
    title: "Mobile App",
    description:
      "A mobile-first food delivery app designed for speed and simplicity. From research to launch in 4 months.",
    brief:
      "Users needed a fast, intuitive way to order meals. The focus was on reducing time-to-order to under 60 seconds.",
    role: "Product Designer",
    duration: "4 months",
    tools: "Figma, Principle, UserTesting",
  },
  "brand-identity": {
    title: "Brand Identity",
    description:
      "Created a bold, modern brand identity for a tech startup entering the fintech space. Logo, guidelines, and full collateral.",
    brief:
      "The startup needed a brand that communicated trust, innovation, and accessibility to a millennial audience.",
    role: "Brand Designer",
    duration: "2 months",
    tools: "Illustrator, Figma",
  },
  "dashboard": {
    title: "Analytics Dashboard",
    description:
      "Data visualization and reporting dashboard for enterprise clients. Making complex data accessible and actionable.",
    brief:
      "Executives needed real-time insights without drowning in data. The goal was clarity over comprehensiveness.",
    role: "UX Designer",
    duration: "5 months",
    tools: "Figma, D3.js, Amplitude",
  },
  "marketing-site": {
    title: "Marketing Site",
    description:
      "High-converting landing pages and marketing website. A/B tested, optimized, and beautiful.",
    brief:
      "The old site had a 1.2% conversion rate. The target was 3%+. We shipped iteratively and hit 4.1%.",
    role: "Product Designer",
    duration: "2 months",
    tools: "Figma, Webflow, Hotjar",
  },
};

export function createProjectLayout(editor: Editor, slug: string) {
  const data = projectContent[slug];
  if (!data) {
    editor.createShape({
      type: "annotation",
      x: LEFT_PAD,
      y: 40,
      props: {
        w: 400,
        h: 40,
        text: "Project not found",
        fontSize: 24,
        showArrow: false,
        arrowDirection: "right",
      },
      meta: { componentType: "annotation", variationId: "not-found" },
    });

    editor.createShape({
      type: "hand-drawn-button",
      x: LEFT_PAD,
      y: 100,
      props: { w: 140, h: 36, label: "← Back home" },
      meta: {
        componentType: "button",
        variationId: "back-home-404",
        href: "/",
      },
    });
    return;
  }

  let y = 40;

  // Back button
  editor.createShape({
    type: "hand-drawn-button",
    x: LEFT_PAD,
    y,
    props: { w: 120, h: 32, label: "← Back home" },
    meta: {
      componentType: "button",
      variationId: `${slug}-back`,
      href: "/",
    },
  });

  y += 60;

  // Title
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 500,
      h: 50,
      text: data.title,
      fontSize: 32,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: `${slug}-title` },
  });

  y += 60;

  // Description
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: CANVAS_W - LEFT_PAD * 2,
      h: 60,
      text: data.description,
      fontSize: 15,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: `${slug}-desc` },
  });

  y += 80;

  // Browser frame with project preview
  editor.createShape({
    type: "browser-frame",
    x: LEFT_PAD,
    y,
    props: {
      w: CANVAS_W - LEFT_PAD * 2,
      h: 300,
      url: `${slug}.preritayadav.com`,
      contentType: "placeholder",
      src: "",
    },
    meta: {
      componentType: "browser-frame",
      variationId: `${slug}-preview`,
    },
  });

  y += 320;

  // Brief
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 120,
      h: 24,
      text: "The Brief",
      fontSize: 18,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: `${slug}-brief-label` },
  });

  y += 30;

  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: CANVAS_W - LEFT_PAD * 2,
      h: 50,
      text: data.brief,
      fontSize: 14,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: `${slug}-brief` },
  });

  y += 70;

  // Details row
  const details = [
    { label: "Role", value: data.role },
    { label: "Duration", value: data.duration },
    { label: "Tools", value: data.tools },
  ];

  details.forEach((detail, i) => {
    editor.createShape({
      type: "annotation",
      x: LEFT_PAD + i * 180,
      y,
      props: {
        w: 160,
        h: 50,
        text: `${detail.label}\n${detail.value}`,
        fontSize: 13,
        showArrow: false,
        arrowDirection: "right",
      },
      meta: {
        componentType: "annotation",
        variationId: `${slug}-detail-${i}`,
      },
    });
  });

  y += 80;

  // Image placeholders
  editor.createShape({
    type: "image-placeholder",
    x: LEFT_PAD,
    y,
    props: { w: CANVAS_W - LEFT_PAD * 2, h: 250 },
    meta: {
      componentType: "image-placeholder",
      variationId: `${slug}-img-1`,
    },
  });

  y += 270;

  editor.createShape({
    type: "image-placeholder",
    x: LEFT_PAD,
    y,
    props: { w: 240, h: 180 },
    meta: {
      componentType: "image-placeholder",
      variationId: `${slug}-img-2`,
    },
  });

  editor.createShape({
    type: "image-placeholder",
    x: LEFT_PAD + 260,
    y,
    props: { w: 240, h: 180 },
    meta: {
      componentType: "image-placeholder",
      variationId: `${slug}-img-3`,
    },
  });

  y += 210;

  // Footer CTA
  editor.createShape({
    type: "hand-drawn-button",
    x: CANVAS_W / 2 - 70,
    y,
    props: { w: 140, h: 36, label: "Contact me" },
    meta: {
      componentType: "button",
      variationId: `${slug}-footer-cta`,
      href: "/contact",
    },
  });

  editor.setCamera({ x: -(CANVAS_W / 2) + window.innerWidth / 2, y: 0, z: 1 });
}
