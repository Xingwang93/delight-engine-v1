# PulseCoach — Generalize branding + AI-drafted quotes

## Goal

Rebrand the demo from ASclub/Ariana to a generic **PulseCoach** identity, and add a real AI feature so it lands as an AI-hackathon project: the closing WhatsApp message is drafted by AI from the lead's actual answers.

## 1. Rebrand to PulseCoach

- Replace every user-facing mention of "ASclub", "Ariana Suárez", and "Sin excusas, sin dramas" with neutral PulseCoach wording:
  - Brand line becomes an English tagline, e.g. "No excuses. No dramas." (keeps the demo's energy, drops the Spanish surname-brand).
  - Persona becomes "the coach" / "your coach" — no first name, no surname.
  - Intake success screen: "You're in, {name}. Your coach is reviewing your intake…"
  - Message signature: "— Your PulseCoach".
- Rename copy in: `Dashboard.tsx` (header, QR dialog, toasts), `IntakeForm.tsx` (titles, step subtitles, commitment options like "Yes, it's my moment"), `leads.ts` (TRAINING_FORMATS subtitles — "at the facility in Palma" becomes generic "at our gym"), `buildWhatsAppMessage` signature, route `head()` titles/descriptions in `index.tsx` and `intake.tsx`.
- Keep the cream/gold/black visual system and fonts — only words change.
- Update the 10 seeded demo leads only if their text references the old brand (motivation/objection fields stay as-is otherwise).

## 2. AI-drafted WhatsApp message

- New server function `draftMessage` (in `src/lib/leads.functions.ts`) that calls the Lovable AI Gateway (no API key needed) with the lead's goal, training format, motivation, objection, commitment, chosen plan and price, and returns a personalized English WhatsApp closing message.
- Dashboard workspace gets a **"Draft with AI"** button next to the message box:
  - Clicking it shows a loading state, then replaces the message preview with the AI draft.
  - The draft is **editable** (textarea) so the coach can tweak before copying.
  - The existing template engine stays as the instant fallback: if AI fails or hasn't been run, the template message shows. "Copy to WhatsApp" copies whatever is currently in the box.
- Prompt keeps the brand voice: energetic, direct, "No excuses. No dramas.", quotes plan + price, includes the correct payment line (online → payment details follow; gym → pay in person).
- Demo narrative: template gives an instant baseline; AI personalizes it to the lead's stated motivation and objection — that's the innovation story.

## Technical notes

- AI call via Lovable AI Gateway chat completions from the server function (server-only, keyless); model: default fast Gemini. Zod-validate input; timeout + error handling with template fallback.
- No schema migration needed — the AI draft is ephemeral (not stored); `plan`/`price`/`lane` still persist on "Mark as Contacted".
- No new routes; changes confined to `src/lib/leads.ts`, `src/lib/leads.functions.ts`, `src/components/Dashboard.tsx`, `src/components/IntakeForm.tsx`, `src/routes/index.tsx`, `src/routes/intake.tsx`.
- Verify end-to-end with Playwright: rebrand visible on both screens, AI draft renders for a seeded lead and for a live QR-submitted lead, copy + mark-contacted still work.
