import type { Editor } from "tldraw";
import { CANVAS_W, LEFT_PAD, centerCamera } from "./layoutHelpers";
import { getFeaturedWork } from "./workData";
import {
  hero,
  blogPosts,
  designPrinciples,
  team,
  skills,
  testimonial,
  footerIcons,
  footerClosing,
  footerCta,
} from "./landingContent";

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
      text: hero.greeting,
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
      text: hero.name,
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
      text: hero.subtitle,
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
    props: { w: 120, h: 34, label: hero.cta.label },
    meta: {
      componentType: "button",
      variationId: "hero-cta",
      href: hero.cta.href,
    },
  });

  y += 100;

  // --- SELECTED WORK ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 300,
      h: 40,
      text: "Featured work",
      fontSize: 22,
      showArrow: true,
      arrowDirection: "down",
    },
    meta: { componentType: "annotation", variationId: "selected-work-heading" },
  });

  y += 80;

  const featured = getFeaturedWork();

  for (const item of featured) {
    editor.createShape({
      type: "project-card",
      x: LEFT_PAD,
      y,
      props: {
        w: CANVAS_W - LEFT_PAD * 2,
        h: 180,
        number: item.number,
        title: item.company,
        description: item.tagline,
        mediaType: item.illustrationType,
      },
      meta: {
        componentType: "project-card",
        variationId: `work-${item.slug}`,
        href: `/work/${item.slug}`,
      },
    });

    y += 220;
  }

  editor.createShape({
    type: "hand-drawn-button",
    x: LEFT_PAD,
    y,
    props: { w: 150, h: 34, label: "View all work →" },
    meta: {
      componentType: "button",
      variationId: "see-all-work",
      href: "/work",
    },
  });

  y += 70;

  // --- BLOG SECTION ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 300,
      h: 40,
      text: "Writing & ideas",
      fontSize: 22,
      showArrow: true,
      arrowDirection: "down",
    },
    meta: { componentType: "annotation", variationId: "blog-heading" },
  });

  y += 70;

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
      x: LEFT_PAD,
      y,
      props: {
        w: CANVAS_W - LEFT_PAD * 2,
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
      text: "My design principles",
      fontSize: 20,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "design-philosophy" },
  });

  y += 50;

  for (const line of designPrinciples) {
    editor.createShape({
      type: "annotation",
      x: LEFT_PAD,
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
      title: team.title,
      subtitle: team.subtitle,
      count: team.count,
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
      text: "Core capabilities",
      fontSize: 16,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "skills-title" },
  });

  y += 40;

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
      text: testimonial.heading,
      fontSize: 16,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "testimonial-title" },
  });

  y += 40;

  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: CANVAS_W - LEFT_PAD * 2,
      h: 100,
      text: testimonial.quote,
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
      text: footerClosing,
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
    props: { w: 140, h: 36, label: footerCta.label },
    meta: {
      componentType: "button",
      variationId: "footer-cta",
      href: footerCta.href,
    },
  });

  centerCamera(editor);
}
