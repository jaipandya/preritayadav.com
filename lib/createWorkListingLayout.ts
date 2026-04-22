import type { Editor } from "tldraw";
import { CANVAS_W, LEFT_PAD, centerCamera, createBackButton } from "./layoutHelpers";
import { getMainWork, getArchivedWork } from "./workData";
import {
  workTitle,
  workSubtitle,
  archiveTitle,
  archiveSubtitle,
} from "./workListingContent";

export function createWorkListingLayout(editor: Editor) {
  let y = 40;

  createBackButton(editor, LEFT_PAD, y, "work-back");

  y += 60;

  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 400,
      h: 50,
      text: workTitle,
      fontSize: 36,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "work-heading" },
  });

  y += 55;

  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: CANVAS_W - LEFT_PAD * 2,
      h: 30,
      text: workSubtitle,
      fontSize: 14,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "work-subtitle" },
  });

  y += 60;

  const mainWork = getMainWork();

  for (const item of mainWork) {
    editor.createShape({
      type: "project-card",
      x: LEFT_PAD,
      y,
      props: {
        w: CANVAS_W - LEFT_PAD * 2,
        h: 180,
        number: item.number,
        title: `${item.company}: ${item.title}`,
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

  // --- ARCHIVE SECTION ---
  y += 20;

  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 300,
      h: 40,
      text: archiveTitle,
      fontSize: 22,
      showArrow: true,
      arrowDirection: "down",
    },
    meta: { componentType: "annotation", variationId: "archive-heading" },
  });

  y += 50;

  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: CANVAS_W - LEFT_PAD * 2,
      h: 24,
      text: archiveSubtitle,
      fontSize: 13,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "archive-subtitle" },
  });

  y += 45;

  const archived = getArchivedWork();

  for (const item of archived) {
    editor.createShape({
      type: "project-card",
      x: LEFT_PAD,
      y,
      props: {
        w: CANVAS_W - LEFT_PAD * 2,
        h: 180,
        number: item.number,
        title: `${item.company}: ${item.title}`,
        description: item.tagline,
        mediaType: item.illustrationType,
      },
      meta: {
        componentType: "project-card",
        variationId: `archive-${item.slug}`,
        href: `/work/${item.slug}`,
      },
    });

    y += 220;
  }

  y += 20;

  editor.createShape({
    type: "hand-drawn-button",
    x: CANVAS_W / 2 - 70,
    y,
    props: { w: 140, h: 36, label: "Contact me" },
    meta: {
      componentType: "button",
      variationId: "work-footer-cta",
      href: "/contact",
    },
  });

  centerCamera(editor);
}
