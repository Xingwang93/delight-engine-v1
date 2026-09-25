export type Lane = "gym" | "online";
export type LeadStatus = "new" | "pending";

export interface Lead {
  id: string;
  name: string;
  goal: string;
  service: string | null;
  motivation: string;
  objection: string | null;
  commitment: string | null;
  lane: Lane;
  status: LeadStatus;
  price: number | null;
  source: string;
  created_at: string;
}

/** Step 1 of the real intake funnel — "What is your goal?" */
export const GOALS = [
  "I want to lose weight and tone up",
  "I want to improve healthy habits and learn to train",
  "I want to gain strength and muscle mass",
  "I want to improve my eating habits",
] as const;

/** Step 2 of the real intake funnel — "Which service are you interested in?" */
export const SERVICES = [
  "One month PREMIUM integral",
  "One month INTEGRAL",
  "One month of nutrition guidelines",
  "One intensive class",
  "Online service",
] as const;

/** Step 5 of the real intake funnel — the commitment filter. */
export const COMMITMENT_OPTIONS = [
  "Yes Ariana, it's my moment",
  "I have doubts… I want more information",
] as const;

export const ONLINE_SERVICE = "Online service";
export const STRIPE_PLACEHOLDER = "[STRIPE PAYMENT LINK]";

/** The service decides the lane: the online service pays by link, everything else happens in person. */
export function laneFromService(service: string): Lane {
  return service === ONLINE_SERVICE ? "online" : "gym";
}

/** Pure message engine: rebuilds the branded WhatsApp draft whenever the price changes. */
export function buildWhatsAppMessage(
  lead: Pick<Lead, "name" | "goal" | "service" | "lane">,
  price: number | null,
): string {
  const amount = price && price > 0 ? `€${price}` : "[PRICE €]";
  const firstName = lead.name.split(" ")[0];
  const plan = lead.service ?? lead.goal;

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
    `Your plan: ${plan}`,
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
