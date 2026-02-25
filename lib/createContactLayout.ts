import type { Editor } from "tldraw";

const CANVAS_W = 560;
const LEFT_PAD = 20;

export function createContactLayout(editor: Editor) {
  let y = 40;

  // Back button
  editor.createShape({
    type: "hand-drawn-button",
    x: LEFT_PAD,
    y,
    props: { w: 120, h: 32, label: "← Back home" },
    meta: {
      componentType: "button",
      variationId: "contact-back",
      href: "/",
    },
  });

  y += 70;

  // Title
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 400,
      h: 50,
      text: "Get in touch",
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
      text: "I'm always happy to chat about design, projects,\nor just say hi. Drop me a line!",
      fontSize: 15,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "contact-subtitle" },
  });

  y += 80;

  // Email
  editor.createShape({
    type: "skill-icon",
    x: LEFT_PAD,
    y,
    props: {
      w: 80,
      h: 100,
      icon: "communication",
      label: "Email",
    },
    meta: {
      componentType: "skill-icon",
      variationId: "contact-email-icon",
    },
  });

  editor.createShape({
    type: "annotation",
    x: LEFT_PAD + 100,
    y: y + 30,
    props: {
      w: 300,
      h: 30,
      text: "hello@preritayadav.com",
      fontSize: 16,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "contact-email" },
  });

  y += 130;

  // Social links
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 200,
      h: 26,
      text: "Find me elsewhere",
      fontSize: 18,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "contact-social-title" },
  });

  y += 40;

  const socials = [
    { label: "LinkedIn", url: "#" },
    { label: "Dribbble", url: "#" },
    { label: "Twitter", url: "#" },
    { label: "GitHub", url: "#" },
  ];

  socials.forEach((social, i) => {
    editor.createShape({
      type: "hand-drawn-button",
      x: LEFT_PAD + i * 125,
      y,
      props: { w: 110, h: 34, label: social.label },
      meta: {
        componentType: "button",
        variationId: `contact-social-${social.label.toLowerCase()}`,
      },
    });
  });

  y += 80;

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

  editor.setCamera({ x: -(CANVAS_W / 2) + window.innerWidth / 2, y: 0, z: 1 });
}
