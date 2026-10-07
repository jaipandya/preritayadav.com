import Image from "next/image";
import { ContentItem } from "@/components/rendered/Content";

export interface CaseStudyImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  row?: number;
}

type Indexed = CaseStudyImage & { index: number };

/**
 * `itemId` (rendered site only) makes each image removable from the WIP canvas: it maps an image index to the item id
 * `createWorkDetailLayout` gave that image's shape. See docs/content-overrides.md.
 */
export function CaseStudyGallery({ images, itemId }: { images: CaseStudyImage[]; itemId?: (index: number) => string }) {
  if (images.length === 0) return null;

  const rows = new Map<number, Indexed[]>();
  images.forEach((image, index) => {
    const row = image.row ?? index;
    const rowImages = rows.get(row) ?? [];
    rowImages.push({ ...image, index });
    rows.set(row, rowImages);
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
      {[...rows.entries()].map(([row, rowImages]) => (
        <div key={row} style={{ display: "flex", gap: 12, width: "100%" }}>
          {rowImages.map((image) => {
            const totalRatio = rowImages.reduce((sum, item) => sum + item.width / item.height, 0);
            const fraction = (image.width / image.height) / totalRatio;
            const gapWidth = 12 * (rowImages.length - 1);
            const sizes = `(max-width: 540px) calc(${fraction * 100}vw - ${(80 + gapWidth) * fraction}px), ${Math.ceil((460 - gapWidth) * fraction)}px`;
            const link = (
            <a
              key={image.src}
              href={image.src}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${image.alt} at full size in a new tab`}
              style={{
                display: "block",
                flex: `${image.width / image.height} 1 0`,
                minWidth: 0,
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes={sizes}
                style={{ display: "block", width: "100%", height: "auto" }}
              />
            </a>
            );
            return itemId ? (
              <ContentItem key={image.src} id={itemId(image.index)}>
                {link}
              </ContentItem>
            ) : (
              link
            );
          })}
        </div>
      ))}
    </div>
  );
}
