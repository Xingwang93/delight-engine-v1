import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

/**
 * Server publishable client. The leads table is demo-public by design:
 * anon can SELECT (dashboard), INSERT (intake form) and UPDATE (mark as contacted).
 */
function getPublicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    // Opaque sb_ keys aren't JWTs; send only apikey, never a bearer of the key itself.
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const listLeads = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin: supabase } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabase
    .from("leads")
    .select(
      "id, name, goal, service, plan, motivation, objection, commitment, lane, status, price, source, created_at",
    )
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });
  if (error) throw new Error("Could not load leads");
  return data ?? [];
});

const submitLeadInput = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(120),
  phone: z.string().max(40).optional().default(""),
  country: z.string().max(60).optional().default(""),
  instagram: z.string().max(60).optional().default(""),
  goal: z.string().min(2).max(120),
  service: z.string().min(2).max(120),
  motivation: z.string().min(2).max(500),
  objection: z.string().min(2).max(500),
  commitment: z.string().min(2).max(120),
});

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((input) => submitLeadInput.parse(input))
  .handler(async ({ data }) => {
    const { laneFromFormat } = await import("@/lib/leads");
    const supabase = getPublicClient();
    const { error } = await supabase.from("leads").insert({
      name: data.name,
      goal: data.goal,
      service: data.service,
      motivation: data.motivation,
      objection: data.objection,
      commitment: data.commitment,
      email: data.email || null,
      phone: data.phone || null,
      country: data.country || null,
      instagram: data.instagram || null,
      lane: laneFromFormat(data.service),
      source: "intake",
    });
    if (error) throw new Error("Could not submit your request");
    return { ok: true };
  });

const updateLeadStatusInput = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "pending"]),
  plan: z.string().max(120).nullable().optional(),
  price: z.number().min(0).max(100000).nullable().optional(),
  lane: z.enum(["gym", "online"]).optional(),
});

export const updateLeadStatus = createServerFn({ method: "POST" })
  .inputValidator((input) => updateLeadStatusInput.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin: supabase } = await import("@/integrations/supabase/client.server");
    const patch: Record<string, unknown> = { status: data.status };
    if (data.plan !== undefined) patch["plan"] = data.plan;
    if (data.price !== undefined) patch["price"] = data.price;
    if (data.lane) patch["lane"] = data.lane;
    const { error } = await supabase.from("leads").update(patch).eq("id", data.id);
    if (error) throw new Error("Could not update the lead");
    return { ok: true };
});

export const deleteLead = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin: supabase } = await import("@/integrations/supabase/client.server");
    const { error } = await supabase.from("leads").delete().eq("id", data.id);
    if (error) throw new Error("Could not delete the lead");
    return { ok: true };
  });

const draftMessageInput = z.object({
  name: z.string().min(1).max(80),
  goal: z.string().max(120),
  service: z.string().max(120).nullable(),
  motivation: z.string().max(500),
  objection: z.string().max(500).nullable(),
  commitment: z.string().max(120).nullable(),
  plan: z.string().max(120).nullable(),
  price: z.number().min(0).max(100000).nullable(),
  lane: z.enum(["gym", "online"]).nullable(),
});

/** AI-drafted, personalized WhatsApp closing message. Throws on failure — the UI falls back to the template. */
export const draftMessage = createServerFn({ method: "POST" })
  .inputValidator((input) => draftMessageInput.parse(input))
  .handler(async ({ data }) => {
    const { generateText } = await import("@/lib/ai.server");
    const firstName = data.name.split(" ")[0];
    const payment =
      data.lane === "online"
        ? "Tell them you'll send the payment details in your next message."
        : "Tell them the first payment is made in person at the gym, brought to their first session.";

    const text = await generateText(
      "You are the copywriter for PulseCoach, a solo fitness coach's business. " +
        "Write a short, warm, energetic WhatsApp closing message in English. " +
        "Brand voice: direct, motivating, zero fluff. Include the exact line \"NO EXCUSES. NO DRAMAS. 💪\" once. " +
        "Personalize to the lead's stated motivation and gently answer their objection. " +
        "Quote the chosen plan and price exactly as given. End with the signature \"— Your PulseCoach\". " +
        "Keep it under 120 words. Output only the message text, no commentary.",
      [
        `Lead first name: ${firstName}`,
        `Goal: ${data.goal}`,
        `Training preference: ${data.service ?? "undecided"}`,
        `Motivation: ${data.motivation}`,
        `Objection: ${data.objection ?? "none stated"}`,
        `Commitment: ${data.commitment ?? "unknown"}`,
        `Chosen plan: ${data.plan ?? "not chosen"}`,
        `Price: ${data.price != null ? `€${data.price}` : "not set"}`,
        `Payment instruction: ${payment}`,
      ].join("\n"),
    );
    return { text };
  });
