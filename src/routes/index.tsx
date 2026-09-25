import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/components/Dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ASclub OS — Lead & Quote Router" },
      {
        name: "description",
        content:
          "One-tap quotes for a solo fitness coach: capture leads, price them, and dispatch branded WhatsApp messages.",
      },
      { property: "og:title", content: "ASclub OS — Lead & Quote Router" },
      {
        property: "og:description",
        content: "One-tap quotes for a solo fitness coach: capture leads, price them, and dispatch branded WhatsApp messages.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});
