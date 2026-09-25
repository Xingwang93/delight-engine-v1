# PulseCoach

**One-tap quotes for solo fitness coaches.** PulseCoach turns raw client intake answers into a personalized, priced WhatsApp closing message — in seconds.

Built for a hackathon demo: an audience member scans a QR code, fills in the intake form on their phone, and their lead appears live on the coach's dashboard. The coach picks a plan, hits **Draft with AI**, and gets a tailored WhatsApp message that speaks directly to that person's goal, motivation, and objection — ready to copy and send.

## What it does

- **Live intake form** (`/intake`) — a multi-step funnel (goal, training format, motivation, objection, commitment, contact details) shareable via an on-screen QR code.
- **Lead dashboard** (`/`) — every submission appears live in a lead list with a split-pane workspace.
- **Plan & price engine** — five fixed-price plans (one intensive class, one month INTEGRAL, one month of nutrition guidelines, online classes, one month PREMIUM integral). Picking a plan fills the price; the coach can still adjust it for a discount.
- **AI-drafted closing message** — reads the lead's actual answers and writes a personalized WhatsApp message with the chosen plan and price. Fully editable before copying, with an instant template as fallback.
- **One-tap actions** — Copy to WhatsApp, Mark as Contacted (New → Pending), with payment wording that adapts to online vs. in-person leads.

## Tech stack

- **TanStack Start v1** (React 19, Vite 7) — full-stack React with server functions
- **Lovable Cloud** — database (leads table, row-level security) and live data
- **Lovable AI Gateway** — AI message drafting (`openai/gpt-6-astra`)
- **Tailwind CSS v4** + shadcn-style components
- **qrcode.react** — shareable intake QR code

## Project structure

```
src/
├── routes/
│   ├── index.tsx          # Dashboard (lead list + workspace)
│   └── intake.tsx         # Public multi-step intake form
├── components/
│   ├── Dashboard.tsx      # Lead management, plan picker, AI draft
│   └── IntakeForm.tsx     # 6-step intake funnel
└── lib/
    ├── leads.ts           # Plans, prices, WhatsApp template builder
    ├── leads.functions.ts # Server functions (list/create/update leads, draftMessage)
    └── ai.server.ts       # AI drafting via Lovable AI Gateway
```

## Running locally

```sh
npm i
npm run dev
```

The app expects the Lovable Cloud backend environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`) and `LOVABLE_API_KEY` for AI drafting — these are provided automatically in the Lovable environment.

## The demo flow

1. Show the dashboard, open **Show Intake QR**.
2. An audience member scans it and completes the intake on their phone.
3. Their lead appears live in the list.
4. Select the lead, pick a plan, hit **Draft with AI**.
5. Show the personalized message — it references their actual goal and objection.
6. Copy to WhatsApp. Done.

---

*PulseCoach — No excuses. No dramas.*
