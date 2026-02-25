import type { TLShape } from "tldraw";

export type ComponentType =
  | "project-card"
  | "browser-frame"
  | "button"
  | "annotation"
  | "team-avatars"
  | "skill-icon"
  | "image-placeholder"
  | "blog-card";

export type ShapeMeta = {
  componentType: ComponentType;
  variationId: string;
  href?: string;
  source?: string;
  label?: string;
};

export function getShapeMeta(shape: TLShape): ShapeMeta | null {
  const meta = shape.meta as Record<string, unknown>;
  if (!meta || typeof meta.componentType !== "string") return null;
  return meta as unknown as ShapeMeta;
}

export function isNavigable(shape: TLShape): boolean {
  const meta = getShapeMeta(shape);
  return meta !== null && typeof meta.href === "string" && meta.href.length > 0;
}

export function getHref(shape: TLShape): string | null {
  const meta = getShapeMeta(shape);
  return meta?.href ?? null;
}
