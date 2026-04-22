import type { Editor } from "tldraw";
import { CANVAS_W, LEFT_PAD, centerCamera, createBackButton } from "./layoutHelpers";
import {
  contactTitle,
  contactSubtitle,
  contactEmail,
} from "./contactContent";

export function createContactLayout(editor: Editor) {
  let y = 40;

  createBackButton(editor, LEFT_PAD, y, "contact-back");

  y += 70;

  // Title
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 400,
      h: 50,
      text: contactTitle,
      fontSize: 34,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "contact-title" },
  });

  y += 60;

  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: CANVAS_W - LEFT_PAD * 2,
      h: 50,
      text: contactSubtitle,
      fontSize: 15,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "contact-subtitle" },
  });

  y += 80;

  // Email
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 300,
      h: 30,
      text: contactEmail,
      fontSize: 16,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: {
      componentType: "annotation",
      variationId: "contact-email",
      href: `mailto:${contactEmail}`,
    },
  });

  y += 60;

  // Social links using the same contact-me shape as the landing page
  editor.createShape({
    type: "contact-me",
    x: LEFT_PAD,
    y,
    props: {
      w: CANVAS_W - LEFT_PAD * 2,
      h: 150,
    },
    meta: { componentType: "contact-me", variationId: "contact-social-icons" },
  });

  y += 200;

  // Decorative browser frame
  editor.createShape({
    type: "browser-frame",
    x: LEFT_PAD,
    y,
    props: {
      w: CANVAS_W - LEFT_PAD * 2,
      h: 200,
      url: "preritayadav.com/contact",
      contentType: "placeholder",
      src: "",
    },
    meta: {
      componentType: "browser-frame",
      variationId: "contact-frame",
    },
  });

  centerCamera(editor);
}
