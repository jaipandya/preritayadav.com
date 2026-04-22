import type { MetadataRoute } from "next";
import { workItems } from "@/lib/workData";

const BASE = "https://preritayadav.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "monthly", priority: 1.0 },
    { url: `${BASE}/work`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/contact`, changeFrequency: "yearly", priority: 0.5 },
  ];

  const workRoutes: MetadataRoute.Sitemap = workItems
    .filter((item) => !item.archived)
    .map((item) => ({
      url: `${BASE}/work/${item.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  return [...staticRoutes, ...workRoutes];
}
