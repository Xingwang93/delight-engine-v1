import { createFileRoute } from "@tanstack/react-router";
import IntakeForm from "@/components/IntakeForm";

export const Route = createFileRoute("/intake")({
  head: () => ({
    meta: [
      { title: "PulseCoach" },
      {
        name: "description",
        content: "Tell your coach your goal and motivation. You'll get a personal quote by WhatsApp.",
      },
      { property: "og:title", content: "PulseCoach — Start Your Assessment" },
      {
        property: "og:description",
        content: "Tell your coach your goal and motivation. You'll get a personal quote by WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IntakeForm,
});
