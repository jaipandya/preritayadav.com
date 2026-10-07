/**
 * A template (unlike the layout) mounts a fresh copy of the page on every navigation, so the page entrance in
 * rendered.css plays again when you move between pages, including from one case study to the next.
 */
export default function RenderedTemplate({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
