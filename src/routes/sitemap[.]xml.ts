import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://robucleaningservices.netlify.app";

type Entry = { path: string; changefreq: string; priority: string };

const STATIC_ENTRIES: Entry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/services", changefreq: "weekly", priority: "0.9" },
  { path: "/corporate-contracts", changefreq: "monthly", priority: "0.8" },
  { path: "/quality-compliance", changefreq: "monthly", priority: "0.7" },
  { path: "/service-compliance", changefreq: "monthly", priority: "0.5" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/gallery", changefreq: "monthly", priority: "0.6" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
];

async function productSlugs(): Promise<string[]> {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return [];
  try {
    const res = await fetch(
      `${url}/rest/v1/products?select=slug&status=neq.hidden&order=name.asc`,
      { headers: { apikey: key } },
    );
    if (!res.ok) return [];
    const rows = (await res.json()) as { slug: string | null }[];
    return rows.map((r) => r.slug).filter((s): s is string => !!s);
  } catch {
    return [];
  }
}

function urlBlock(e: Entry) {
  return [
    "  <url>",
    `    <loc>${BASE_URL}${e.path}</loc>`,
    `    <changefreq>${e.changefreq}</changefreq>`,
    `    <priority>${e.priority}</priority>`,
    "  </url>",
  ].join("\n");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const slugs = await productSlugs();
        const entries: Entry[] = [
          ...STATIC_ENTRIES,
          ...slugs.map((slug) => ({
            path: `/products/${encodeURIComponent(slug)}`,
            changefreq: "weekly",
            priority: "0.7",
          })),
        ];

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...entries.map(urlBlock),
          "</urlset>",
        ].join("\n");

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
