import { generateMarkdownForPath } from "@/lib/markdownGenerators";
import { getMainWork, getArchivedWork } from "@/lib/workData";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  const workSlugs = [...getMainWork(), ...getArchivedWork()].map((w) => w.slug);
  return [
    { path: ["index"] },
    { path: ["about"] },
    { path: ["contact"] },
    { path: ["work"] },
    ...workSlugs.map((slug) => ({ path: ["work", slug] })),
  ];
}

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
