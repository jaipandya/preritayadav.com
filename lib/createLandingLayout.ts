import type { Editor } from "@/lib/canvas";
import { CANVAS_W, LEFT_PAD, centerCamera } from "./layoutHelpers";
import { getFeaturedWork } from "./workData";
import {
  hero,
  blogPosts,
  outsideWork,
  teamsWorkedWith,
  footerClosing,
  footerCta,
  featuredWorkHeading,
  viewAllWorkLabel,
  blogHeading,
} from "./landingContent";
import { bind, contentKey, itemIds, withContent, withItem } from "./contentOverrides";

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
    meta: withContent({ componentType: "annotation", variationId: "hero-hello" }, bind("landing.hero.greeting", hero.greeting)),
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
    meta: withContent({ componentType: "annotation", variationId: "hero-title" }, bind("landing.hero.name", hero.name)),
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
    meta: withContent({ componentType: "annotation", variationId: "hero-sub" }, bind("landing.hero.subtitle", hero.subtitle)),
  });

  y += 85;

  editor.createShape({
    type: "hand-drawn-button",
    x: LEFT_PAD,
    y,
    props: { w: 120, h: 34, label: hero.cta.label },
    meta: withContent(
      { componentType: "button", variationId: "hero-cta", href: hero.cta.href },
      bind("landing.hero.cta.label", hero.cta.label, { prop: "label" })
    ),
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
      text: featuredWorkHeading,
      fontSize: 22,
      showArrow: true,
      arrowDirection: "down",
    },
    meta: withContent({ componentType: "annotation", variationId: "selected-work-heading" }, bind("landing.featuredWorkHeading", featuredWorkHeading)),
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
      // Company and tagline are shared with the case study page, so deleting the card hides the row, not those fields.
      meta: withContent(
        withItem(
          { componentType: "project-card", variationId: `work-${item.slug}`, href: `/work/${item.slug}` },
          itemIds.featuredWork(item.slug)
        ),
        bind(contentKey("work", item.slug, "company"), item.company, { prop: "title", noErase: true }),
        bind(contentKey("work", item.slug, "tagline"), item.tagline, { prop: "description", noErase: true })
      ),
    });

    y += 220;
  }

  editor.createShape({
    type: "hand-drawn-button",
    x: LEFT_PAD,
    y,
    props: { w: 150, h: 34, label: viewAllWorkLabel },
    meta: withContent(
      { componentType: "button", variationId: "see-all-work", href: "/work" },
      bind("landing.viewAllWorkLabel", viewAllWorkLabel, { prop: "label" })
    ),
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
      text: blogHeading,
      fontSize: 22,
      showArrow: true,
      arrowDirection: "down",
    },
    meta: withContent({ componentType: "annotation", variationId: "blog-heading" }, bind("landing.blogHeading", blogHeading)),
  });

  y += 70;

  blogPosts.forEach((post, i) => {
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
      meta: withContent(
        withItem(
          {
            componentType: "annotation",
            variationId: `blog-${post.title.toLowerCase().replace(/\s+/g, "-")}`,
            href: post.href,
          },
          itemIds.blogPost(i)
        ),
        bind(`landing.blogPosts.${i}.title`, post.title)
      ),
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
      meta: withContent(
        withItem(
          { componentType: "annotation", variationId: `blog-desc-${post.title.toLowerCase().replace(/\s+/g, "-")}` },
          itemIds.blogPost(i)
        ),
        bind(`landing.blogPosts.${i}.description`, post.description)
      ),
    });

    y += 40;
  });

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
    meta: withContent({ componentType: "annotation", variationId: "outside-work-heading" }, bind("landing.outsideWork.heading", outsideWork.heading)),
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
      meta: withItem(
        { componentType: "outside-work-card", variationId: `outside-work-${item.number}` },
        itemIds.outsideWork(item.number)
      ),
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
    meta: withContent({ componentType: "annotation", variationId: "teams-heading" }, bind("landing.teamsWorkedWith.heading", teamsWorkedWith.heading)),
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
    meta: withItem({ componentType: "company-logos", variationId: "teams-logos" }, itemIds.teamLogos),
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
    meta: withContent({ componentType: "annotation", variationId: "footer-closing" }, bind("landing.footerClosing", footerClosing)),
  });

  y += 45;

  editor.createShape({
    type: "hand-drawn-button",
    x: LEFT_PAD,
    y,
    props: { w: 140, h: 36, label: footerCta.label },
    meta: withContent(
      { componentType: "button", variationId: "footer-cta", href: footerCta.href },
      bind("landing.footerCta.label", footerCta.label, { prop: "label" })
    ),
  });

  centerCamera(editor);
}
