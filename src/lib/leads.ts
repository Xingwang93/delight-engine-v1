export type Lane = "gym" | "online";
export type LeadStatus = "new" | "pending";

export interface Lead {
  id: string;
  name: string;
  goal: string;
  /** Client's training preference from intake step 2. */
  service: string | null;
  plan: string | null;
  motivation: string;
  objection: string | null;
  commitment: string | null;
  lane: Lane;
  status: LeadStatus;
  price: number | null;
  source: string;
  created_at: string;
}

export const GOALS = [
  "I want to lose weight and tone up",
  "I want to improve healthy habits and learn to train",
  "I want to gain strength and muscle mass",
  "I want to improve my eating habits",
] as const;

export const FORMAT_ONLINE = "Online Coaching";
export const FORMAT_GYM = "In-Person at ASclub Gym";
export const FORMAT_RECOMMEND = "Let Ariana recommend";

/** Step 2 — training format, no package jargon. */
export const TRAINING_FORMATS = [
  { title: FORMAT_ONLINE, subtitle: "Train anywhere with a digital program, nutrition and weekly check-ins." },
  { title: FORMAT_GYM, subtitle: "1-on-1 sessions with Ariana at the facility in Palma." },
  { title: FORMAT_RECOMMEND, subtitle: "Not sure yet, whatever fits my schedule and goal best." },
] as const;

export const COMMITMENT_OPTIONS = [
  "Yes Ariana, it's my moment",
  "I have doubts… I want more information",
] as const;

export interface Plan {
  name: string;
  price: number;
  lane: Lane;
}

/** Ariana's plans with fixed prices. */
export const PLANS: Plan[] = [
  { name: "One intensive class", price: 40, lane: "gym" },
  { name: "One month INTEGRAL", price: 160, lane: "gym" },
  { name: "One month of nutrition guidelines", price: 90, lane: "online" },
  { name: "Online classes", price: 120, lane: "online" },
  { name: "One month PREMIUM integral", price: 220, lane: "gym" },
];

export function findPlan(name: string | null | undefined): Plan | null {
  return PLANS.find((p) => p.name === name) ?? null;
}

/** Lane from the client's preference; "recommend" has no lane until a plan is picked (stored as gym). */
export function laneFromFormat(format: string): Lane {
  return format === FORMAT_ONLINE ? "online" : "gym";
}

/** "At gym" / "Online" label from preference; null for "let Ariana recommend". */
export function formatLabel(format: string | null): "At gym" | "Online" | null {
  if (format === FORMAT_ONLINE) return "Online";
  if (format === FORMAT_GYM) return "At gym";
  return null;
}

export function suggestedPlan(format: string | null): Plan | null {
  if (format === FORMAT_ONLINE) return findPlan("Online classes");
  if (format === FORMAT_GYM) return findPlan("One month INTEGRAL");
  return null;
}

/** Pure message engine: rebuilds the branded WhatsApp draft whenever plan or price changes. */
export function buildWhatsAppMessage(
  lead: Pick<Lead, "name">,
  plan: Plan | null,
  price: number | null,
): string {
  const amount = price && price > 0 ? `€${price}` : "[PRICE €]";
  const firstName = lead.name.split(" ")[0];
  const planName = plan?.name ?? "[CHOOSE A PLAN]";

  const payment =
    plan?.lane === "online"
      ? `→ I'll send you the payment details in my next message.`
      : `→ Your first payment is made in person at the ASclub facility — bring it to your first session.`;

  return [
    `Hi ${firstName}! 👋`,
    ``,
    `NO EXCUSES, NO DRAMAS. 💪`,
    ``,
    `Thanks for reaching out to ASclub — I reviewed your answers and this is the plan I recommend for you.`,
    ``,
    `Your plan: ${planName}`,
    `Price: ${amount}`,
    ``,
    payment,
    ``,
    `Once your payment clears, I'll send you the link to book our kickoff call.`,
    ``,
    `— Ariana, ASclub`,
  ].join("\n");
}
