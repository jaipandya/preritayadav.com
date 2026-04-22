import type { Editor } from "tldraw";
import { CANVAS_W, LEFT_PAD, centerCamera } from "./layoutHelpers";
import { getFeaturedWork } from "./workData";
import {
  hero,
  blogPosts,
  outsideWork,
  teamsWorkedWith,
  contactMe,
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

  // Hero illustration — girl working on MacBook with nature background
  editor.createShape({
    type: "hand-drawn-illustration",
    x: CANVAS_W - 220,
    y: 30,
    props: { w: 200, h: 160, scene: "girl-laptop" },
    meta: { componentType: "illustration", variationId: "hero-illustration" },
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

  // --- OUTSIDE WORK SECTION ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 300,
      h: 40,
      text: outsideWork.heading,
      fontSize: 22,
      showArrow: true,
      arrowDirection: "down",
    },
    meta: { componentType: "annotation", variationId: "outside-work-heading" },
  });

  y += 70;

  for (const item of outsideWork.items) {
    editor.createShape({
      type: "outside-work-card",
      x: LEFT_PAD,
      y,
      props: {
        w: CANVAS_W - LEFT_PAD * 2,
        h: 160,
        number: item.number,
        title: item.title,
        subtitle: item.subtitle,
        description: item.description,
        illustration: item.illustration,
      },
      meta: {
        componentType: "outside-work-card",
        variationId: `outside-work-${item.number}`,
      },
    });

    y += 190;
  }

  y += 20;

  // --- TEAMS WORKED WITH ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 400,
      h: 40,
      text: teamsWorkedWith.heading,
      fontSize: 22,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "teams-heading" },
  });

  y += 50;

  editor.createShape({
    type: "company-logos",
    x: LEFT_PAD,
    y,
    props: {
      w: CANVAS_W - LEFT_PAD * 2,
      h: 260,
      companies: teamsWorkedWith.companies.join(","),
    },
    meta: { componentType: "company-logos", variationId: "teams-logos" },
  });

  y += 290;

  // --- CONTACT ME SECTION ---
  editor.createShape({
    type: "contact-me",
    x: LEFT_PAD,
    y,
    props: {
      w: CANVAS_W - LEFT_PAD * 2,
      h: 150,
    },
    meta: { componentType: "contact-me", variationId: "contact-me" },
  });

  y += 220;

  // --- FOOTER ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 450,
      h: 36,
      text: footerClosing,
      fontSize: 22,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "footer-closing" },
  });

  y += 45;

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
