import Image from "next/image";

export interface CaseStudyImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  row?: number;
}

export function CaseStudyGallery({ images }: { images: CaseStudyImage[] }) {
  if (images.length === 0) return null;

  const rows = new Map<number, CaseStudyImage[]>();
  images.forEach((image, index) => {
    const row = image.row ?? index;
    const rowImages = rows.get(row) ?? [];
    rowImages.push(image);
    rows.set(row, rowImages);
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
      {[...rows.entries()].map(([row, rowImages]) => (
        <div key={row} style={{ display: "flex", gap: 12, width: "100%" }}>
          {rowImages.map((image) => {
            const totalRatio = rowImages.reduce((sum, item) => sum + item.width / item.height, 0);
            const fraction = (image.width / image.height) / totalRatio;
            const gapWidth = 12 * (rowImages.length - 1);
            const sizes = `(max-width: 640px) calc(${fraction * 100}vw - ${(40 + gapWidth) * fraction}px), (max-width: 840px) calc(${fraction * 100}vw - ${(64 + gapWidth) * fraction}px), ${Math.ceil((776 - gapWidth) * fraction)}px`;
            return (
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
          })}
        </div>
      ))}
    </div>
  );
}
