import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Our Services, Robu Cleaning Services Ltd" },
      {
        name: "description",
        content:
          "Cleaning, pest control & fumigation, sanitary services, ground maintenance, garbage collection, messengerial and tea making services across Kenya.",
      },
      { property: "og:title", content: "Our Services, Robu Cleaning Services Ltd" },
      {
        property: "og:description",
        content:
          "The full range of services Robu Cleaning Services Ltd delivers to banks, hospitals, institutions and homes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesLayout,
});

function ServicesLayout() {
  return <Outlet />;
}