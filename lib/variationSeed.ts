/**
 * Seeded PRNG based on shape ID for deterministic visual variations.
 * Uses a simple hash to convert string IDs to numeric seeds.
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getVariationIndex(
  shapeId: string,
  variantCount: number
): number {
  return hashString(shapeId) % variantCount;
}

/**
 * Returns a deterministic pseudo-random number in [0, 1) for a given seed string.
 */
export function seededRandom(seed: string): number {
  const h = hashString(seed);
  return (h % 10000) / 10000;
}

/**
 * Generates wobbly offset points for hand-drawn rectangle borders.
 * Returns small x/y offsets that stay stable for the same shapeId.
 */
export function getWobbleOffsets(
  shapeId: string,
  pointCount: number
): Array<{ dx: number; dy: number }> {
  const offsets: Array<{ dx: number; dy: number }> = [];
  for (let i = 0; i < pointCount; i++) {
    const rx = seededRandom(`${shapeId}-x-${i}`);
    const ry = seededRandom(`${shapeId}-y-${i}`);
    offsets.push({
      dx: (rx - 0.5) * 4,
      dy: (ry - 0.5) * 4,
    });
  }
  return offsets;
}

/**
 * Generates a hand-drawn rectangle SVG path with wobbly edges.
 */
export function wobblyRect(
  shapeId: string,
  w: number,
  h: number,
  wobbleAmount = 3
): string {
  const s = (seed: string) => (seededRandom(seed) - 0.5) * wobbleAmount;

  const topLeft = { x: s(`${shapeId}-tl-x`), y: s(`${shapeId}-tl-y`) };
  const topRight = {
    x: w + s(`${shapeId}-tr-x`),
    y: s(`${shapeId}-tr-y`),
  };
  const bottomRight = {
    x: w + s(`${shapeId}-br-x`),
    y: h + s(`${shapeId}-br-y`),
  };
  const bottomLeft = {
    x: s(`${shapeId}-bl-x`),
    y: h + s(`${shapeId}-bl-y`),
  };

  const midTop = {
    x: w / 2 + s(`${shapeId}-mt-x`),
    y: s(`${shapeId}-mt-y`),
  };
  const midRight = {
    x: w + s(`${shapeId}-mr-x`),
    y: h / 2 + s(`${shapeId}-mr-y`),
  };
  const midBottom = {
    x: w / 2 + s(`${shapeId}-mb-x`),
    y: h + s(`${shapeId}-mb-y`),
  };
  const midLeft = {
    x: s(`${shapeId}-ml-x`),
    y: h / 2 + s(`${shapeId}-ml-y`),
  };

  return [
    `M ${topLeft.x} ${topLeft.y}`,
    `Q ${midTop.x} ${midTop.y} ${topRight.x} ${topRight.y}`,
    `Q ${midRight.x} ${midRight.y} ${bottomRight.x} ${bottomRight.y}`,
    `Q ${midBottom.x} ${midBottom.y} ${bottomLeft.x} ${bottomLeft.y}`,
    `Q ${midLeft.x} ${midLeft.y} ${topLeft.x} ${topLeft.y}`,
    `Z`,
  ].join(" ");
}

/**
 * Generates a hand-drawn circle SVG path.
 */
export function wobblyCircle(
  shapeId: string,
  cx: number,
  cy: number,
  r: number,
  wobbleAmount = 2
): string {
  const points = 12;
  const parts: string[] = [];

  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const wobble =
      r + (seededRandom(`${shapeId}-c-${i}`) - 0.5) * wobbleAmount;
    const x = cx + Math.cos(angle) * wobble;
    const y = cy + Math.sin(angle) * wobble;
    if (i === 0) {
      parts.push(`M ${x} ${y}`);
    } else {
      const prevAngle = ((i - 0.5) / points) * Math.PI * 2;
      const cpWobble =
        r + (seededRandom(`${shapeId}-cp-${i}`) - 0.5) * wobbleAmount;
      const cpx = cx + Math.cos(prevAngle) * cpWobble;
      const cpy = cy + Math.sin(prevAngle) * cpWobble;
      parts.push(`Q ${cpx} ${cpy} ${x} ${y}`);
    }
  }

  parts.push("Z");
  return parts.join(" ");
}

/**
 * Generates a hand-drawn line path between two points.
 */
export function wobblyLine(
  shapeId: string,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  wobbleAmount = 3
): string {
  const midX = (x1 + x2) / 2 + (seededRandom(`${shapeId}-lmx`) - 0.5) * wobbleAmount;
  const midY = (y1 + y2) / 2 + (seededRandom(`${shapeId}-lmy`) - 0.5) * wobbleAmount;
  return `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
}
