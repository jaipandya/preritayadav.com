import {
  hero,
  blogPosts,
  designPrinciples,
  team,
  skills,
  testimonial,
  footerClosing,
} from "./landingContent";
import {
  aboutTitle,
  aboutParagraphs,
  aboutOutro,
  aboutFooterText,
} from "./aboutContent";
import {
  contactTitle,
  contactSubtitle,
  contactEmail,
  socials,
} from "./contactContent";
import {
  workTitle,
  workSubtitle,
  archiveTitle,
  archiveSubtitle,
} from "./workListingContent";
import {
  getMainWork,
  getArchivedWork,
  getWorkBySlug,
  type WorkItem,
} from "./workData";

export function generateLandingMarkdown(): string {
  const featured = getMainWork().filter((item) => item.featured);
  const lines: string[] = [];

  lines.push(`# ${hero.name}`);
  lines.push("");
  lines.push(`${hero.greeting}`);
  lines.push("");
  lines.push(hero.subtitle.replace("\n", " — "));
  lines.push("");

  lines.push("## Featured work");
  lines.push("");
  for (const item of featured) {
    lines.push(`### [${item.company}: ${item.title}](/work/${item.slug})`);
    lines.push("");
    lines.push(item.tagline);
    lines.push("");
  }

  lines.push("[View all work →](/work)");
  lines.push("");

  lines.push("## Writing & ideas");
  lines.push("");
  for (const post of blogPosts) {
    lines.push(`- [${post.title}](${post.href}) — ${post.description}`);
  }
  lines.push("");

  lines.push("## My design principles");
  lines.push("");
  for (const p of designPrinciples) {
    lines.push(`- ${p}`);
  }
  lines.push("");

  lines.push(`## ${team.title}`);
  lines.push("");
  lines.push(team.subtitle);
  lines.push("");

  lines.push("## Core capabilities");
  lines.push("");
  for (const s of skills) {
    lines.push(`- ${s.label}`);
  }
  lines.push("");

  lines.push(`## ${testimonial.heading}`);
  lines.push("");
  lines.push(`> ${testimonial.quote}`);
  lines.push("");

  lines.push("---");
  lines.push("");
  lines.push(footerClosing);
  lines.push("");
  lines.push("[Say hello →](/contact)");

  return lines.join("\n");
}

export function generateAboutMarkdown(): string {
  const lines: string[] = [];

  lines.push(`# ${aboutTitle}`);
  lines.push("");

  for (const p of aboutParagraphs) {
    lines.push(p);
    lines.push("");
  }

  lines.push(aboutOutro);
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(aboutFooterText);
  lines.push("");
  lines.push("[Say hello →](/contact)");

  return lines.join("\n");
}

export function generateContactMarkdown(): string {
  const lines: string[] = [];

  lines.push(`# ${contactTitle}`);
  lines.push("");
  lines.push(contactSubtitle.replace("\n", " "));
  lines.push("");

  lines.push("## Email");
  lines.push("");
  lines.push(`[${contactEmail}](mailto:${contactEmail})`);
  lines.push("");

  lines.push("## Find me elsewhere");
  lines.push("");
  for (const s of socials) {
    lines.push(`- [${s.label}](${s.url})`);
  }

  return lines.join("\n");
}

export function generateWorkListingMarkdown(): string {
  const mainWork = getMainWork();
  const archived = getArchivedWork();
  const lines: string[] = [];

  lines.push(`# ${workTitle}`);
  lines.push("");
  lines.push(workSubtitle);
  lines.push("");

  for (const item of mainWork) {
    lines.push(`## [${item.company}: ${item.title}](/work/${item.slug})`);
    lines.push("");
    lines.push(item.tagline);
    lines.push("");
  }

  lines.push(`## ${archiveTitle}`);
  lines.push("");
  lines.push(archiveSubtitle);
  lines.push("");

  for (const item of archived) {
    lines.push(`### [${item.company}: ${item.title}](/work/${item.slug})`);
    lines.push("");
    lines.push(item.tagline);
    lines.push("");
  }

  return lines.join("\n");
}

function workItemToMarkdown(data: WorkItem): string {
  const lines: string[] = [];

  lines.push(`# ${data.title}`);
  lines.push("");
  lines.push(`**${data.company}** — ${data.tagline}`);
  lines.push("");

  lines.push("| | |");
  lines.push("|---|---|");
  lines.push(`| **Role** | ${data.role} |`);
  lines.push(`| **Duration** | ${data.duration} |`);
  lines.push(`| **Tools** | ${data.tools} |`);
  lines.push("");

  lines.push("## Overview");
  lines.push("");
  lines.push(data.overview);
  lines.push("");

  lines.push("## The Challenge");
  lines.push("");
  lines.push(data.challenge);
  lines.push("");

  lines.push("## Process");
  lines.push("");
  data.process.forEach((step, i) => {
    lines.push(`${i + 1}. ${step}`);
  });
  lines.push("");

  lines.push("## Approach");
  lines.push("");
  lines.push(data.approach);
  lines.push("");

  lines.push("## Key Contributions");
  lines.push("");
  for (const item of data.keyContributions) {
    lines.push(`- ${item}`);
  }
  lines.push("");

  lines.push("## Outcome");
  lines.push("");
  lines.push(data.outcome);
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("[Contact me →](/contact) · [Back to work →](/work)");

  return lines.join("\n");
}

export function generateWorkDetailMarkdown(slug: string): string | null {
  const data = getWorkBySlug(slug);
  if (!data) return null;
  return workItemToMarkdown(data);
}

export function generateMarkdownForPath(path: string): string | null {
  const normalized = path.replace(/^\/+|\/+$/g, "");

  if (normalized === "" || normalized === "index") {
    return generateLandingMarkdown();
  }
  if (normalized === "about") {
    return generateAboutMarkdown();
  }
  if (normalized === "contact") {
    return generateContactMarkdown();
  }
  if (normalized === "work") {
    return generateWorkListingMarkdown();
  }
  if (normalized.startsWith("work/")) {
    const slug = normalized.replace("work/", "");
    return generateWorkDetailMarkdown(slug);
  }

  return null;
}
