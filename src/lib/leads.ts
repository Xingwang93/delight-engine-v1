export type Lane = "gym" | "online";
export type LeadStatus = "new" | "pending";

export interface Lead {
  id: string;
  name: string;
  goal: string;
  motivation: string;
  lane: Lane;
  status: LeadStatus;
  price: number | null;
  source: string;
  created_at: string;
}

export const GOALS = [
  "Fat loss & body recomp",
  "Muscle gain",
  "Strength & conditioning",
  "General fitness",
  "Athletic performance",
] as const;

export const STRIPE_PLACEHOLDER = "[STRIPE PAYMENT LINK]";

/** Pure message engine: rebuilds the branded WhatsApp draft whenever the price changes. */
export function buildWhatsAppMessage(lead: Pick<Lead, "name" | "goal" | "lane">, price: number | null): string {
  const amount = price && price > 0 ? `€${price}` : "[PRICE €]";
  const firstName = lead.name.split(" ")[0];

  const payment =
    lead.lane === "online"
      ? `→ Pay your first month here: ${STRIPE_PLACEHOLDER}`
      : `→ Your first month is paid in person at the ASclub facility — bring it to your first session.`;

  return [
    `Hi ${firstName}! 👋`,
    ``,
    `NO EXCUSES, NO DRAMAS. 💪`,
    ``,
    `Thanks for reaching out to ASclub — I reviewed your intake and I'm ready to work with you.`,
    ``,
    `Your plan: ${lead.goal}`,
    `Monthly coaching: ${amount}`,
    ``,
    payment,
    ``,
    `Once your payment clears, I'll send you the link to book our kickoff video call.`,
    ``,
    `— Ariana, ASclub`,
  ].join("\n");
}

/** Suggested default price per lane, so the demo has sensible starting numbers. */
export function suggestedPrice(lead: Pick<Lead, "lane">): number {
  return lead.lane === "online" ? 150 : 160;
}
