export const aboutTitle = "Hi, I'm Prerita.";

export const aboutParagraphs = [
  "If you had met me a few years ago, we probably would have crossed paths in a public sector bank somewhere in India. For an entire decade, my world revolved around finance, business logic, and mitigating risk. It was a rigorous environment that taught me how to untangle complex systems and recognize that data isn't just numbers. It represents real people and real livelihoods.",
  "In 2017, I realized that understanding systems wasn't enough for me; I wanted to build them. But first, I needed a broader lens. My husband and I sold our possessions and hit the road. Over the next few years, we backpacked across 26 different countries. Witnessing how diverse cultures naturally interact with their environments was the ultimate crash course in human psychology.",
  "During those travels, my latent love for design fully ignited. I founded 'Rebari', a minimal travel stationery brand. Designing premium calendars and paper goods from scratch wasn't just a business, it was my first taste of obsessing over physical user experiences and aesthetics.",
  "That obsession led me directly into the digital realm. I realized that my unique blend of deep business strategy from banking, combined with the raw global empathy I gained on the road, gave me a massive advantage in understanding how people use technology.",
  "I dove headfirst into the craft, enrolling in the intensive 10kdesigners masterclass. It was there that I transitioned into a full-time Product Designer. I learned how to translate ambiguous business goals into intuitive, pixel-perfect interfaces that people actually enjoy using.",
];

export const aboutOutro =
  "Today, I'm building experiences that matter, leaning on my unconventional past to solve the product challenges of the future.";

export const aboutFooterText =
  "Thanks for reading my story. If you'd like to collaborate, swap travel stories, or just say hi, my inbox is always open.";

export const aboutCta = { label: "Say hello", href: "/contact" };

export type IllustrationScene = "bank" | "travel" | "design";

export const illustrations: Array<{
  scene: IllustrationScene;
  afterParagraph: number;
}> = [
  { scene: "bank", afterParagraph: 0 },
  { scene: "travel", afterParagraph: 1 },
  { scene: "design", afterParagraph: 3 },
];
