/** Small up-right arrow for links that leave the site. Decorative: the link text says where it goes. */
export function ExtArrow({ size = 9 }: { size?: number }) {
  return (
    <svg
      className="r-ext-icon"
      width={size}
      height={size}
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 7.5l5-5M3.5 2.5h4v4" />
    </svg>
  );
}
