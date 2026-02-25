import type { Editor } from "tldraw";

const CANVAS_W = 560;
const LEFT_PAD = 20;

export function createUiComponentsLayout(editor: Editor) {
  let y = 30;

  // --- Back button ---
  editor.createShape({
    type: "hand-drawn-button",
    x: LEFT_PAD,
    y,
    props: { w: 130, h: 34, label: "← Back home" },
    meta: {
      componentType: "button",
      variationId: "back-home",
      href: "/",
    },
  });

  y += 60;

  // --- Title ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 400,
      h: 50,
      text: "UI Components",
      fontSize: 34,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "page-title" },
  });

  y += 80;

  // --- Section: Annotation ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 200,
      h: 30,
      text: "Annotation",
      fontSize: 22,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "section-annotation" },
  });

  y += 50;

  // Plain text annotation
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 300,
      h: 24,
      text: "Plain text annotation",
      fontSize: 16,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "annotation-plain" },
  });

  y += 40;

  // Annotation with right arrow
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 300,
      h: 24,
      text: "With right arrow",
      fontSize: 16,
      showArrow: true,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "annotation-right" },
  });

  y += 40;

  // Annotation with down arrow
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 300,
      h: 30,
      text: "With down arrow",
      fontSize: 16,
      showArrow: true,
      arrowDirection: "down",
    },
    meta: { componentType: "annotation", variationId: "annotation-down" },
  });

  y += 70;

  // --- Section: Hand-drawn Button ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 300,
      h: 30,
      text: "Hand-drawn Button",
      fontSize: 22,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "section-button" },
  });

  y += 50;

  const buttons = ["Click me", "Submit", "Learn more"];
  buttons.forEach((label, i) => {
    editor.createShape({
      type: "hand-drawn-button",
      x: LEFT_PAD + i * 150,
      y,
      props: { w: 130, h: 36, label },
      meta: {
        componentType: "button",
        variationId: `button-${label.toLowerCase().replace(/\s+/g, "-")}`,
      },
    });
  });

  y += 70;

  // --- Section: Project Card ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 300,
      h: 30,
      text: "Project Card",
      fontSize: 22,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "section-project-card" },
  });

  y += 50;

  // Image type card
  editor.createShape({
    type: "project-card",
    x: LEFT_PAD,
    y,
    props: {
      w: CANVAS_W - LEFT_PAD * 2,
      h: 260,
      number: "01",
      title: "Image Card Example",
      description: "A project card with an image media placeholder",
      mediaType: "image",
    },
    meta: {
      componentType: "project-card",
      variationId: "card-image-example",
    },
  });

  y += 300;

  // Video type card
  editor.createShape({
    type: "project-card",
    x: LEFT_PAD,
    y,
    props: {
      w: CANVAS_W - LEFT_PAD * 2,
      h: 180,
      number: "02",
      title: "Video Card Example",
      description: "A project card with a video media placeholder",
      mediaType: "video",
    },
    meta: {
      componentType: "project-card",
      variationId: "card-video-example",
    },
  });

  y += 220;

  // --- Section: Skill Icon ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 200,
      h: 30,
      text: "Skill Icon",
      fontSize: 22,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "section-skill-icon" },
  });

  y += 50;

  const icons: Array<{
    icon: "analytics" | "design" | "content" | "communication";
    label: string;
  }> = [
    { icon: "analytics", label: "Analytics" },
    { icon: "design", label: "Design" },
    { icon: "content", label: "Content" },
    { icon: "communication", label: "Communication" },
  ];

  icons.forEach((item, i) => {
    editor.createShape({
      type: "skill-icon",
      x: LEFT_PAD + i * 130,
      y,
      props: {
        w: 110,
        h: 120,
        icon: item.icon,
        label: item.label,
      },
      meta: {
        componentType: "skill-icon",
        variationId: `icon-${item.icon}`,
      },
    });
  });

  y += 160;

  // --- Section: Team Avatars ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 300,
      h: 30,
      text: "Team Avatars",
      fontSize: 22,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "section-team-avatars" },
  });

  y += 50;

  editor.createShape({
    type: "team-avatars",
    x: LEFT_PAD,
    y,
    props: {
      w: CANVAS_W - LEFT_PAD * 2,
      h: 200,
      title: "Meet the team",
      subtitle: "Designers, developers & product managers",
      count: 5,
    },
    meta: { componentType: "team-avatars", variationId: "team-example" },
  });

  y += 240;

  // --- Section: Browser Frame ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 300,
      h: 30,
      text: "Browser Frame",
      fontSize: 22,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: { componentType: "annotation", variationId: "section-browser-frame" },
  });

  y += 50;

  editor.createShape({
    type: "browser-frame",
    x: LEFT_PAD,
    y,
    props: {
      w: CANVAS_W - LEFT_PAD * 2,
      h: 300,
      url: "https://preritayadav.com",
      contentType: "placeholder",
      src: "",
    },
    meta: {
      componentType: "browser-frame",
      variationId: "browser-frame-example",
    },
  });

  y += 340;

  // --- Section: Image Placeholder ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 300,
      h: 30,
      text: "Image Placeholder",
      fontSize: 22,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: {
      componentType: "annotation",
      variationId: "section-image-placeholder",
    },
  });

  y += 50;

  editor.createShape({
    type: "image-placeholder",
    x: LEFT_PAD,
    y,
    props: {
      w: CANVAS_W - LEFT_PAD * 2,
      h: 200,
    },
    meta: {
      componentType: "image-placeholder",
      variationId: "image-placeholder-example",
    },
  });

  y += 250;

  // Position camera
  const vb = editor.getViewportScreenBounds();
  editor.setCamera({ x: -(CANVAS_W / 2) + vb.width / 2, y: 0, z: 1 });
}
