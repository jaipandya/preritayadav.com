import { generateMarkdownForPath } from "@/lib/markdownGenerators";

export async function GET() {
  const markdown = generateMarkdownForPath("");

  return new Response(markdown, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
