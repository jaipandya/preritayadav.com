# SEO

## Which version is indexed

The canvas site (`/`, `/work`, `/work/<slug>`, `/about`, `/contact`) is the primary version and the only one search engines index. The rendered site (`/rendered/*`) is `noindex, follow` so the two never compete as duplicates. `/md/*` (plain text copies) send `X-Robots-Tag: noindex`. `/blog/*` (placeholders) and `/meta/*` (internal reference pages) are `noindex`.

## What each page has

- `lib/seo.ts` `pageMetadata({ title, description, path })` gives a page its canonical URL, Open Graph and Twitter text. Use it in every new page layout. A page that sets `openGraph` replaces the root layout's object (Next merges one level deep), which is why the helper repeats `url`, `siteName`, `type` and `locale`.
- A share image from an `opengraph-image.tsx` next to the page, drawn with `OgTemplate` in `lib/ogTemplate.tsx` (1200x630). Next adds it to Open Graph and Twitter. Do not set `runtime = "edge"`: without it these are rendered once at build time and served as static files.
- `app/sitemap.ts` lists the public pages (archived case studies are left out but stay reachable). `app/robots.ts` allows everything and points to the sitemap.
- JSON-LD (render with `components/JsonLd.tsx`): `Person` with a portrait on every page (root layout), `ProfilePage` on `/about`, `ItemList` on `/work` (`app/work/(listing)/layout.tsx`, so it stays off case studies), `CreativeWork` and `BreadcrumbList` on case studies (`app/work/[slug]/layout.tsx`).
- Case study screenshots are tldraw shapes, not `<img>` tags. They reach search engines through `images` in `app/sitemap.ts` and the `image` array of the `CreativeWork`, both from `workImageUrls` in `lib/seo.ts` (the `atAGlanceImages` of the case study).
- The home page is a client component, so its canonical lives in `app/(home)/layout.tsx`. It is not in the root layout, or every page without its own metadata (rendered, blog) would inherit `/`.
- `app/work/[slug]/layout.tsx` sets `dynamicParams = false`: an unknown slug is a real 404, not a 200 page.

When adding a page: layout with `pageMetadata`, an `opengraph-image.tsx`, a sitemap entry, and check long titles in the image (the template shrinks the title above 22 and 40 characters, and the dashed rail sits under the URL).

## Google Search Console

1. Add a **Domain property** for `preritayadav.com` at search.google.com/search-console and add the TXT record it shows in the DNS settings of the domain. That covers `www` and every protocol. (Alternative: a URL-prefix property verified with the HTML tag. Set `GOOGLE_SITE_VERIFICATION` to the token in the hosting environment and the root layout adds the meta tag.)
2. Sitemaps, then submit `https://preritayadav.com/sitemap.xml`.
3. URL Inspection: inspect the home page, `/work`, `/about` and a few case studies, then **Request indexing**.
4. Check Pages and Enhancements in a few days for indexing and structured data problems.
5. Optional: add the site to Bing Webmaster Tools (it can import from Search Console).

## Checks before going live

- `curl -s https://preritayadav.com | grep -i robots` shows `index, follow`.
- `https://preritayadav.com/robots.txt` and `/sitemap.xml` load.
- Paste a page URL into the Rich Results Test and a social share debugger (LinkedIn Post Inspector, Facebook Sharing Debugger) to see the preview card. They cache, so use their re-scrape button after changing an image.
