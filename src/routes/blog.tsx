import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog & News — Robu Cleaning Services" },
      {
        name: "description",
        content: "Updates, cleaning tips and company news from Robu Cleaning Services.",
      },
      { property: "og:title", content: "Blog & News — Robu Cleaning Services" },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogLayout,
});

function BlogLayout() {
  return <Outlet />;
}