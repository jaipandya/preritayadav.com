"use client";

import { PageShell } from "@/components/PageShell";
import { createContactLayout } from "@/lib/createContactLayout";
import {
  contactTitle,
  contactSubtitle,
  contactEmail,
} from "@/lib/contactContent";
import { contactMe } from "@/lib/landingContent";

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
        <h2>{contactMe.heading}</h2>
        <ul>
          {contactMe.links.map((link) => (
            <li key={link.icon}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
