import { generateMarkdownForPath } from "@/lib/markdownGenerators";

// Prerendered at build time like /md/[...path]. Without this a GET handler is a function invocation on every request.
export const dynamic = "force-static";

export async function GET() {
  const markdown = generateMarkdownForPath("");

  return new Response(markdown, {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "X-Robots-Tag": "noindex" },
  });
}
