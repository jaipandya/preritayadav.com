"use client";

import { PageShell } from "@/components/PageShell";
import { createContactLayout } from "@/lib/createContactLayout";
import {
  contactTitle,
  contactSubtitle,
  contactEmail,
  socials,
} from "@/lib/contactContent";

export default function ContactPage() {
  return (
    <PageShell
      navLinks={[{ href: "/", label: "Back to Home" }]}
      pageKey="contact"
      onCreateLayout={createContactLayout}
    >
      <h1>{contactTitle}</h1>
      <p>{contactSubtitle.replace("\n", " ")}</p>

      <section aria-label="Email">
        <h2>Email</h2>
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
      </section>

      <section aria-label="Social links">
        <h2>Find me elsewhere</h2>
        <ul>
          {socials.map((s) => (
            <li key={s.label}>
              <a href={s.url}>{s.label}</a>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
