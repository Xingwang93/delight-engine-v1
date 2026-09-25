# ASclub Service Router — Hackathon MVP

## What we're building

A single-page "One-Tap Quote" dashboard for Ariana (solo fitness coach, Palma de Mallorca) that turns incoming leads into ready-to-send Spanish WhatsApp quotes. Mock data only — no backend, no real Elementor/Stripe integration. Built to demo by 4:00 PM.

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
│                │  [📋 Copy to WhatsApp] [✓ Contacted]│
└────────────────┴─────────────────────────────────────┘
```

## Features

1. **Lead list (left pane)** — 6–8 realistic mock leads (name, goal, motivation, lane). Cards show lane badge (Gym / Online) and status (New / Pending). Click to select; scrollable.
2. **Lead workspace (right pane)** — summary of the selected lead plus a price input.
3. **Live message engine** — typing a price instantly re-renders the drafted Spanish WhatsApp message: greeting, goal reference, slogan "SIN EXCUSAS SIN DRAMAS", price, and payment instructions.
4. **Two-lane routing** — Online leads get a Stripe payment-link placeholder in the message; Gym leads get pay-in-person-at-the-facility instructions.
5. **Actions** — "Copy to WhatsApp" (copies message to clipboard, with toast confirmation) and "Mark as Contacted" (flips the card New → Pending, persisted in component state).
6. **States** — empty state when no lead selected; mobile collapses to list → detail navigation.

## Design

- Black / white / gold palette, dark-first "ASclub OS" bespoke-tool feel — premium, energetic, zero clutter (her stated rejection of off-the-shelf software).
- Sharp typography: a condensed display font for the brand, clean sans for UI. Gold reserved for accents, prices, and the slogan.
- Spanish UI copy throughout.

## Technical notes

- Single route `src/routes/index.tsx` (replaces the placeholder); components under `src/components/`.
- Mock leads as a typed array in `src/lib/mock-leads.ts`; message template as a pure function `buildWhatsAppMessage(lead, price)` — easy to unit-check and to swap for real data later.
- No Lovable Cloud / database needed for the demo; state lives in React. Post-hackathon V2 items (AI plans, Airtable, Qclinicas, video) stay out of scope.
- Custom head() metadata: "ASclub OS — Router de Leads y Presupuestos".
