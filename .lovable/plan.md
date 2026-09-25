# Step 2 = Training Format, Ariana picks the plan

## Intake form (Step 2)
Question: "Where and how do you prefer to train?" — the answer shows on the dashboard as an "At gym" or "Online" label ("Let Ariana recommend" shows no label until she picks a plan).
- **Online Coaching** — Train anywhere with a digital program, nutrition and weekly check-ins.
- **In-Person at ASclub Gym** — 1-on-1 sessions with Ariana at the facility in Palma.
- **Let Ariana recommend** — Not sure yet, whatever fits my schedule and goal best.

Everything else in the 6-step funnel stays the same.

## Dashboard workspace
- Lead summary shows the client's training preference (instead of a package name).
- New **Plan selector** above the price, with 5 plans and fixed prices:

| Plan | Price (placeholder) | Lane |
|---|---|---|
| One intensive class | €40 | Gym |
| One month INTEGRAL | €160 | Gym |
| One month of nutrition guidelines | €90 | Online |
| Online classes | €120 | Online |
| One month PREMIUM integral | €220 | Gym |

- Picking a plan fills the price automatically (still editable for a one-off discount) and sets the lane: online plans say payment details will follow (no Stripe link built for now), gym plans get the "pay in person" line.
- A plan is pre-suggested from the client's answer (Online → Online classes, In-Person → One month INTEGRAL, Recommend → nothing chosen yet).
- The drafted WhatsApp message quotes the chosen plan and price, updating instantly.
- The chosen plan and price are saved on the lead when Ariana marks it as contacted.

Prices above are final for the demo.

## Technical details
- Migration: add nullable `plan` text column to `leads`; `service` keeps the client's training preference. Backfill demo leads with a preference value.
- `src/lib/leads.ts`: replace SERVICES with TRAINING_FORMATS; add PLANS `{ name, price, lane }[]`; `suggestedPlan(format)`; message uses selected plan + lane.
- `leads.functions.ts`: submitLead lane from format (Online → online, else gym); updateLeadStatus also accepts `plan`, `price`, `lane`.
- `Dashboard.tsx`: plan selector (button group), per-lead local plan/price state, lane badge reflects selected plan.
- `IntakeForm.tsx`: step 2 options with subtitles.
