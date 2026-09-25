import { createFileRoute } from "@tanstack/react-router";
import IntakeForm from "@/components/IntakeForm";

export const Route = createFileRoute("/intake")({
  head: () => ({
    meta: [
      { title: "ASclub — Start Your Assessment" },
      {
        name: "description",
        content: "Tell Ariana your goal and motivation. She'll send you a personal quote by WhatsApp.",
      },
      { property: "og:title", content: "ASclub — Start Your Assessment" },
      {
        property: "og:description",
        content: "Tell Ariana your goal and motivation. She'll send you a personal quote by WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IntakeForm,
});
