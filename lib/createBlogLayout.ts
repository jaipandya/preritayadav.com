import type { Editor } from "tldraw";
import { CANVAS_W, LEFT_PAD, centerCamera, createBackButton } from "./layoutHelpers";

interface BlogData {
  title: string;
  date: string;
  body: string[];
}

const blogContent: Record<string, BlogData> = {
  "design-thinking": {
    title: "Design Thinking in Practice",
    date: "January 2026",
    body: [
      "Design thinking is more than a process — it's a mindset. After years of applying it across different industries, I've learned that the real magic happens not in the frameworks, but in the messy spaces between them.",
      "The double diamond is a helpful metaphor, but in practice, the process is never that clean. You diverge, converge, loop back, and sometimes start over entirely. That's not failure — it's how good design works.",
      "What I've found most valuable is the emphasis on empathy. When you truly understand the person you're designing for, the solutions almost design themselves. The hard part is earning that understanding.",
      "My advice: don't treat design thinking as a checklist. Treat it as a lens. Use it to ask better questions, challenge assumptions, and stay curious throughout the entire journey.",
    ],
  },
  "ux-research": {
    title: "UX Research Methods That Actually Work",
    date: "December 2025",
    body: [
      "After conducting hundreds of user interviews and usability tests, I've developed strong opinions about which research methods deliver real insights and which are mostly theatre.",
      "Contextual inquiry is underrated. Watching people use your product in their actual environment reveals things no survey or lab test ever will. The awkwardness is worth it.",
      "Remote unmoderated testing has its place, but it can't replace the richness of a live conversation. I use it for validation, not discovery.",
      "The most important research skill isn't methodology — it's synthesis. Anyone can collect data. The value is in finding patterns, telling stories, and translating insights into decisions that move the needle.",
    ],
  },
};

export function createBlogLayout(editor: Editor, slug: string) {
  const data = blogContent[slug];
  if (!data) {
    editor.createShape({
      type: "annotation",
      x: LEFT_PAD,
      y: 40,
      props: {
        w: 400,
        h: 40,
        text: "Post not found",
        fontSize: 24,
        showArrow: false,
        arrowDirection: "right",
      },
      meta: { componentType: "annotation", variationId: "blog-not-found" },
    });

    createBackButton(editor, LEFT_PAD, 100, "blog-back-404", { w: 140, h: 36 });
    return;
  }

  let y = 40;

  createBackButton(editor, LEFT_PAD, y, `blog-${slug}-back`);

  y += 60;

  // Date
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 200,
      h: 24,
      text: data.date,
      fontSize: 13,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: {
      componentType: "annotation",
      variationId: `blog-${slug}-date`,
    },
  });

  y += 28;

  // Title
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: 500,
      h: 50,
      text: data.title,
      fontSize: 30,
      showArrow: false,
      arrowDirection: "right",
    },
    meta: {
      componentType: "annotation",
      variationId: `blog-${slug}-title`,
    },
  });

  y += 70;

  // Body paragraphs
  data.body.forEach((paragraph, i) => {
    editor.createShape({
      type: "annotation",
      x: LEFT_PAD,
      y,
      props: {
        w: CANVAS_W - LEFT_PAD * 2,
        h: 80,
        text: paragraph,
        fontSize: 14,
        showArrow: false,
        arrowDirection: "right",
      },
      meta: {
        componentType: "annotation",
        variationId: `blog-${slug}-p${i}`,
      },
    });
    y += 100;
  });

  y += 20;

  // Footer CTA
  editor.createShape({
    type: "hand-drawn-button",
    x: CANVAS_W / 2 - 70,
    y,
    props: { w: 140, h: 36, label: "Contact me" },
    meta: {
      componentType: "button",
      variationId: `blog-${slug}-cta`,
      href: "/contact",
    },
  });

  centerCamera(editor);
}
