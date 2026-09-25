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
  const supabase = getPublicClient();
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
    const supabase = getPublicClient();
    const patch: Record<string, unknown> = { status: data.status };
    if (data.plan !== undefined) patch["plan"] = data.plan;
    if (data.price !== undefined) patch["price"] = data.price;
    if (data.lane) patch["lane"] = data.lane;
    const { error } = await supabase.from("leads").update(patch).eq("id", data.id);
    if (error) throw new Error("Could not update the lead");
    return { ok: true };
  });
