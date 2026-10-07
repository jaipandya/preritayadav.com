import type { AnyShape } from "@/lib/canvas";

export type ComponentType =
  | "project-card"
  | "browser-frame"
  | "button"
  | "annotation"
  | "team-avatars"
  | "skill-icon"
  | "image-placeholder"
  | "blog-card"
  | "company-logos"
  | "outside-work-card"
  | "contact-me";

export type ShapeMeta = {
  componentType: ComponentType;
  variationId: string;
  href?: string;
  source?: string;
  label?: string;
};

export function getShapeMeta(shape: Pick<AnyShape, "meta">): ShapeMeta | null {
  const meta = shape.meta as Record<string, unknown>;
  if (!meta || typeof meta.componentType !== "string") return null;
  return meta as unknown as ShapeMeta;
}

export function isNavigable(shape: Pick<AnyShape, "meta">): boolean {
  const meta = getShapeMeta(shape);
  return meta !== null && typeof meta.href === "string" && meta.href.length > 0;
}

export function getHref(shape: Pick<AnyShape, "meta">): string | null {
  const meta = getShapeMeta(shape);
  return meta?.href ?? null;
}
