import type { Editor } from "tldraw";
import { CANVAS_W, LEFT_PAD, centerCamera } from "./layoutHelpers";

export function createAboutLayout(editor: Editor) {
  let y = 60;
  const TEXT_WIDTH = 540;

  // --- HEADER ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: TEXT_WIDTH,
      h: 50,
      text: "Hi, I'm Prerita.",
      fontSize: 38,
      showArrow: false,
    },
    meta: { componentType: "annotation", variationId: "about-title" },
  });

  y += 85;

  // --- PARAGRAPH 1 ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: TEXT_WIDTH,
      h: 100,
      text: "If you had met me a few years ago, we probably would have crossed paths in a public sector bank somewhere in India. For an entire decade, my world revolved around finance, business logic, and mitigating risk. It was a rigorous environment that taught me how to untangle complex systems and recognize that data isn't just numbers. It represents real people and real livelihoods.",
      fontSize: 16,
      showArrow: false,
    },
    meta: { componentType: "annotation", variationId: "about-p1" },
  });

  y += 140;

  // --- ILLUSTRATION: Bank ---
  editor.createShape({
    type: "hand-drawn-illustration",
    x: LEFT_PAD,
    y,
    props: { w: 200, h: 160, scene: "bank" },
    meta: { componentType: "annotation", variationId: "illus-bank" },
  });

  y += 180;

  // --- PARAGRAPH 2 ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: TEXT_WIDTH,
      h: 120,
      text: "In 2017, I realized that understanding systems wasn’t enough for me; I wanted to build them. But first, I needed a broader lens. My husband and I sold our possessions and hit the road. Over the next few years, we backpacked across 26 different countries. Witnessing how diverse cultures naturally interact with their environments was the ultimate crash course in human psychology.",
      fontSize: 16,
      showArrow: false,
    },
    meta: { componentType: "annotation", variationId: "about-p2" },
  });

  y += 140;

  // --- ILLUSTRATION: Travel ---
  editor.createShape({
    type: "hand-drawn-illustration",
    x: LEFT_PAD,
    y,
    props: { w: 200, h: 160, scene: "travel" },
    meta: { componentType: "annotation", variationId: "illus-travel" },
  });

  y += 180;

  // --- PARAGRAPH 3 ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: TEXT_WIDTH,
      h: 100,
      text: "During those travels, my latent love for design fully ignited. I founded 'Rebari', a minimal travel stationery brand. Designing premium calendars and paper goods from scratch wasn't just a business, it was my first taste of obsessing over physical user experiences and aesthetics.",
      fontSize: 16,
      showArrow: false,
    },
    meta: { componentType: "annotation", variationId: "about-p3" },
  });

  y += 120;

  // --- PARAGRAPH 4 ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: TEXT_WIDTH,
      h: 120,
      text: "That obsession led me directly into the digital realm. I realized that my unique blend of deep business strategy from banking, combined with the raw global empathy I gained on the road, gave me a massive advantage in understanding how people use technology.",
      fontSize: 16,
      showArrow: false,
    },
    meta: { componentType: "annotation", variationId: "about-p4" },
  });

  y += 120;

  // --- ILLUSTRATION: Design ---
  editor.createShape({
    type: "hand-drawn-illustration",
    x: LEFT_PAD,
    y,
    props: { w: 200, h: 160, scene: "design" },
    meta: { componentType: "annotation", variationId: "illus-design" },
  });

  y += 180;

  // --- PARAGRAPH 5 ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: TEXT_WIDTH,
      h: 120,
      text: "I dove headfirst into the craft, enrolling in the intensive 10kdesigners masterclass. It was there that I transitioned into a full-time Product Designer. I learned how to translate ambiguous business goals into intuitive, pixel-perfect interfaces that people actually enjoy using.",
      fontSize: 16,
      showArrow: false,
    },
    meta: { componentType: "annotation", variationId: "about-p5" },
  });

  y += 120;

  // --- OUTRO ---
  editor.createShape({
    type: "annotation",
    x: LEFT_PAD,
    y,
    props: {
      w: TEXT_WIDTH,
      h: 80,
      text: "Today, I’m building experiences that matter, leaning on my unconventional past to solve the product challenges of the future.",
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
      text: "Thanks for reading my story. If you'd like to collaborate, swap travel stories, or just say hi, my inbox is always open.",
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
    props: { w: 140, h: 36, label: "Say hello" },
    meta: {
      componentType: "button",
      variationId: "about-cta",
      href: "/contact",
    },
  });

  centerCamera(editor);
}
