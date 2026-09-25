import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/components/Dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PulseCoach" },
      {
        name: "description",
        content:
          "One-tap quotes for a solo fitness coach: capture leads, pick a plan, and dispatch AI-drafted WhatsApp messages.",
      },
      { property: "og:title", content: "PulseCoach — Lead & Quote Router" },
      {
        property: "og:description",
        content: "One-tap quotes for a solo fitness coach: capture leads, pick a plan, and dispatch AI-drafted WhatsApp messages.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});
