# ASclub Service Router — Hackathon Demo MVP

## What we're building

A "One-Tap Quote" demo for the hackathon stage. The story: Ariana, a solo fitness coach, drowns in manual WhatsApp quoting — this tool turns incoming leads into ready-to-send quotes. Demo-first: 6–8 preloaded mock leads, plus a **live intake form with a QR code** you can share during the demo so audience members submit real leads that appear on the dashboard.

## Audience & language

- **Everything in English** — UI and the drafted client message are both English, so the whole demo reads for the audience.
- Ariana remains the persona, framed generically as "a solo fitness coach".

## Screens

### 1. Dashboard — `/` (main demo surface)

```text
┌──────────────────────────────────────────────────────┐
│  ASCLUB OS          SIN EXCUSAS SIN DRAMAS      ● 5  │
├────────────────┬─────────────────────────────────────┤
│ LEADS (list)   │  ACTIVE LEAD WORKSPACE              │
│                │                                     │
│ ┌────────────┐ │  Name, goal, motivation, lane       │
│ │ María G.   │ │  ┌─────────────────────────────┐    │
│ │ Online·New │ │  │ Suggested price: [ 150 ] €  │    │
│ ├────────────┤ │  └─────────────────────────────┘    │
│ │ Jorge P.   │ │                                     │
│ │ Gym·Pending│ │  Drafted WhatsApp message (EN):     │
│ ├────────────┤ │  ┌─────────────────────────────┐    │
│ │ Lucía R.   │ │  │ "Hi María! NO EXCUSES, NO   │    │
│ │ Online·New │ │  │  DRAMA... your plan:        │    │
│ └────────────┘ │  │  €150 — pay here: [Stripe]  │    │
│   ...scroll    │  └─────────────────────────────┘    │
│                │                                     │
│ [Show intake   │  [Copy to WhatsApp] [Mark Contacted]│
│   QR]          │                                     │
└────────────────┴─────────────────────────────────────┘
```

1. **Lead list (left pane)** — mock leads plus live form submissions, mixed in one list. Cards show lane badge (Gym / Online) and status (New / Pending). Click to select; scrollable; refresh button / light polling picks up new submissions.
2. **Lead workspace (right pane)** — summary of the selected lead plus a price input.
3. **Live message engine** — typing a price instantly re-renders the drafted English WhatsApp message: greeting, goal reference, "SIN EXCUSAS SIN DRAMAS" as the brand line, price, and payment instructions.
4. **Two-lane routing** — Online leads get a Stripe payment-link placeholder in the message; Gym leads get pay-in-person-at-the-facility instructions.
5. **Actions** — "Copy to WhatsApp" (clipboard + toast) and "Mark as Contacted" (flips New → Pending).
6. **QR code button** — opens a modal with a QR code linking to the intake form; scan → submit → the lead shows up in the dashboard for the demo.

### 2. Intake form — `/intake` (public route)

Clean branded form (same black/white/gold system): name, goal, motivation, preferred lane (Gym / Online). Submits to the cloud and lands in the dashboard as a New lead. Success state tells the lead Ariana will message them.

## Design

- Black / white / gold palette, dark-first "ASclub OS" bespoke-tool feel — premium, energetic, zero clutter.
- Condensed display font for the brand, clean sans for UI. Gold reserved for accents, prices, and the brand line.

## Technical notes

- **Lovable Cloud** (enable during build) backs the demo: a `leads` table (name, goal, motivation, lane, status, price, source) with RLS — public insert for the intake form, owner-only read for the dashboard. Dashboard reads via a server function with light polling; mock leads are seeded in the migration so the demo never shows an empty board.
- Routes: `src/routes/index.tsx` (dashboard), `src/routes/intake.tsx` (public form). Components under `src/components/`.
- Message template as a pure function `buildWhatsAppMessage(lead, price)`; mock leads as a typed array in `src/lib/mock-leads.ts`.
- QR code generated client-side (a small QR library) pointing at the hosted intake URL; the demo's preview URL is used during the presentation.
- V2 items (AI plans, Airtable, Qclinicas, video) stay out of scope.
- Custom head() metadata on both routes: "ASclub OS — Lead & Quote Router" and "ASclub — Start Your Assessment".
