import type { Editor } from "tldraw";
import { LEFT_PAD, centerCamera } from "./layoutHelpers";
import {
  aboutTitle,
  aboutParagraphs,
  aboutOutro,
  aboutFooterText,
  aboutCta,
  illustrations,
} from "./aboutContent";

export function createAboutLayout(editor: Editor) {
  let y = 60;
  const TEXT_WIDTH = 540;

  const paragraphHeights = [100, 120, 100, 120, 120];
  const paragraphSpacing = [140, 140, 120, 120, 120];

  // --- HEADER ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: TEXT_WIDTH,
      h: 50,
      text: aboutTitle,
      fontSize: 38,
      showArrow: false,
    },
    meta: { componentType: "annotation", variationId: "about-title" },
  });

  y += 85;

  // --- PARAGRAPHS with interleaved illustrations ---
  for (let i = 0; i < aboutParagraphs.length; i++) {
    editor.createShape({
      type: "annotation",
      x: LEFT_PAD,
      y,
      props: {
        w: TEXT_WIDTH,
        h: paragraphHeights[i],
        text: aboutParagraphs[i],
        fontSize: 16,
        showArrow: false,
      },
      meta: { componentType: "annotation", variationId: `about-p${i + 1}` },
    });

    y += paragraphSpacing[i];

    const illus = illustrations.find((il) => il.afterParagraph === i);
    if (illus) {
      editor.createShape({
        type: "hand-drawn-illustration",
        x: LEFT_PAD,
        y,
        props: { w: 200, h: 160, scene: illus.scene },
        meta: { componentType: "annotation", variationId: `illus-${illus.scene}` },
      });

      y += 180;
    }
  }

  // --- OUTRO ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: TEXT_WIDTH,
      h: 80,
      text: aboutOutro,
      fontSize: 16,
      showArrow: false,
    },
    meta: { componentType: "annotation", variationId: "about-outro" },
  });

  y += 100;

  // --- FOOTER CTA ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: TEXT_WIDTH,
      h: 60,
      text: aboutFooterText,
      fontSize: 16,
      showArrow: false,
    },
    meta: { componentType: "annotation", variationId: "about-footer-text" },
  });

  y += 70;

  editor.createShape({
    type: "hand-drawn-button",
    x: LEFT_PAD,
    y,
    props: { w: 140, h: 36, label: aboutCta.label },
    meta: {
      componentType: "button",
      variationId: "about-cta",
      href: aboutCta.href,
    },
  });

  centerCamera(editor);
}
