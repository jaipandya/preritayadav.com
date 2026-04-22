import { generateMarkdownForPath } from "@/lib/markdownGenerators";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pagePath = path.join("/");
  const markdown = generateMarkdownForPath(pagePath);

  if (!markdown) {
    return new Response("# Not Found\n\nThis page does not exist.", {
      status: 404,
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
  }

  return new Response(markdown, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
