# ASclub Service Router — Hackathon Demo MVP

## What we're building

A single-page "One-Tap Quote" dashboard demo. The story: Ariana, a solo fitness coach in Palma de Mallorca, drowns in manual WhatsApp quoting — this tool turns incoming leads into ready-to-send quotes. Mock data only — no backend, no real Elementor/Stripe integration. Built to demo on stage.

## Audience & language

- **UI in English** — the hackathon audience is English-speaking, so all labels, buttons, and headings are English.
- **The drafted client message stays in Spanish** — that's the authentic detail: Ariana's clients are Spanish-speaking, and the live-generated Spanish WhatsApp message (with "SIN EXCUSAS SIN DRAMAS") is the demo's wow moment.
- Ariana remains the persona, framed generically as "a solo fitness coach" so the audience can map it to any solo professional.

## Screen layout (one route: /)

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
│ │ Gym·Pending│ │  Drafted WhatsApp message (ES):     │
│ ├────────────┤ │  ┌─────────────────────────────┐    │
│ │ Lucía R.   │ │  │ "¡Hola María! SIN EXCUSAS   │    │
│ │ Online·New │ │  │  SIN DRAMAS... tu plan:     │    │
│ └────────────┘ │  │  150€ — paga aquí: [Stripe] │    │
│   ...scroll    │  └─────────────────────────────┘    │
│                │                                     │
│                │  [Copy to WhatsApp] [Mark Contacted]│
└────────────────┴─────────────────────────────────────┘
```

## Features

1. **Lead list (left pane)** — 6–8 realistic mock leads (name, goal, motivation, lane). Cards show lane badge (Gym / Online) and status (New / Pending). Click to select; scrollable.
2. **Lead workspace (right pane)** — summary of the selected lead plus a price input.
3. **Live message engine** — typing a price instantly re-renders the drafted Spanish WhatsApp message: greeting, goal reference, slogan "SIN EXCUSAS SIN DRAMAS", price, and payment instructions.
4. **Two-lane routing** — Online leads get a Stripe payment-link placeholder in the message; Gym leads get pay-in-person-at-the-facility instructions.
5. **Actions** — "Copy to WhatsApp" (copies message to clipboard, with toast confirmation) and "Mark as Contacted" (flips the card New → Pending, in component state).
6. **States** — empty state when no lead selected; mobile collapses to list → detail navigation.

## Design

- Black / white / gold palette, dark-first "ASclub OS" bespoke-tool feel — premium, energetic, zero clutter (her stated rejection of off-the-shelf software).
- Sharp typography: a condensed display font for the brand, clean sans for UI. Gold reserved for accents, prices, and the slogan.

## Technical notes

- Single route `src/routes/index.tsx` (replaces the placeholder); components under `src/components/`.
- Mock leads as a typed array in `src/lib/mock-leads.ts`; message template as a pure function `buildWhatsAppMessage(lead, price)` — easy to check and to swap for real data later.
- No backend/database needed for the demo; state lives in React. Post-hackathon V2 items (AI plans, Airtable, Qclinicas, video) stay out of scope.
- Custom head() metadata: "ASclub OS — Lead & Quote Router".
