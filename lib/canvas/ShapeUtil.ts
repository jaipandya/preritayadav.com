import type { ReactNode } from "react";
import type { AnyShape, Box, ResizeInfo, ShapeRecord, Vec } from "./types";

// ─── Prop validators ───────────────────────────────────────────

export type Validator<V> = { validate: (value: unknown) => V };

function validator<V>(name: string, check: (value: unknown) => boolean): Validator<V> {
  return {
    validate(value) {
      if (!check(value)) throw new Error(`Expected ${name}, got ${JSON.stringify(value)}`);
      return value as V;
    },
  };
}

/** Prop validators for custom shapes, checked when a shape is created. */
export const T = {
  number: validator<number>("a number", (v) => typeof v === "number" && Number.isFinite(v)),
  string: validator<string>("a string", (v) => typeof v === "string"),
  boolean: validator<boolean>("a boolean", (v) => typeof v === "boolean"),
};

export type RecordProps<S extends ShapeRecord> = { [K in keyof S["props"]]: Validator<S["props"][K]> };

// ─── Geometry ──────────────────────────────────────────────────

export interface Geometry2d {
  readonly bounds: Box;
  /** `point` is in the shape's local space (origin at the shape's top left, unrotated). */
  hitTestPoint(point: Vec, margin: number): boolean;
}

/** A rectangle from the shape's origin. Every custom shape on this site is one. */
export class Rectangle2d implements Geometry2d {
  readonly bounds: Box;
  constructor({ width, height }: { width: number; height: number; isFilled?: boolean }) {
    this.bounds = { x: 0, y: 0, w: width, h: height };
  }
  hitTestPoint(point: Vec, margin: number) {
    const b = this.bounds;
    return point.x >= b.x - margin && point.x <= b.x + b.w + margin && point.y >= b.y - margin && point.y <= b.y + b.h + margin;
  }
}

// ─── Resizing ──────────────────────────────────────────────────

/** Scale a `w`/`h` shape by the resize factors. The engine places the shape; this only returns the new size. */
export function resizeBox<S extends ShapeRecord<string, { w: number; h: number }>>(shape: S, info: ResizeInfo) {
  return {
    props: {
      w: Math.max(1, shape.props.w * info.scaleX),
      h: Math.max(1, shape.props.h * info.scaleY),
    },
  };
}

// ─── Shape utils ───────────────────────────────────────────────

/**
 * Defines a custom HTML shape: its props, default props, hit area and React component.
 * The engine draws Quickdraw's own shapes on its canvas; shapes defined here render as React in a layer under it,
 * and Quickdraw selects, moves, resizes and erases them through `getGeometry` and `onResize`.
 */
export abstract class ShapeUtil<S extends ShapeRecord = AnyShape> {
  static type: string;
  static props: Record<string, Validator<unknown>>;

  abstract getDefaultProps(): S["props"];
  abstract getGeometry(shape: S): Geometry2d;
  abstract component(shape: S): ReactNode;
  /** Outline shown when the pointer is over the shape in the select tool. Drawn in an SVG in shape space. */
  abstract indicator(shape: S): ReactNode;

  canResize(): boolean {
    return true;
  }

  canEdit(): boolean {
    return false;
  }

  onResize(shape: S, info: ResizeInfo): { props?: Partial<S["props"]> } | void {
    void shape;
    void info;
  }

  /** Throw when `props` does not match the static `props` validators. */
  validateProps(props: Record<string, unknown>) {
    const validators = (this.constructor as typeof ShapeUtil).props ?? {};
    for (const [key, v] of Object.entries(validators)) {
      try {
        v.validate(props[key]);
      } catch (e) {
        const type = (this.constructor as typeof ShapeUtil).type;
        throw new Error(`Invalid prop "${key}" on ${type} shape: ${e instanceof Error ? e.message : e}`);
      }
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- a list holds utils for every shape type
export type ShapeUtilConstructor = { new (): ShapeUtil<any>; type: string; props: Record<string, Validator<unknown>> };
