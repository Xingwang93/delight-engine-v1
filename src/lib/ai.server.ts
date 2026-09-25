import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";

/**
 * Server-only Lovable AI Gateway call (Responses API).
 * Streams the call and returns the final text. Throws on failure —
 * callers fall back to the template message.
 */
export async function generateText(system: string, prompt: string): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI gateway key not configured");

  const provider = createOpenAI({
    baseURL: GATEWAY_URL,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });

  const result = streamText({
    model: provider.responses(MODEL),
    system,
    prompt,
    providerOptions: {
      openai: {
        store: false,
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  // Consume the full stream manually so stream errors surface with their real
  // cause instead of a bare "No output generated" crash.
  let text = "";
  let streamError: string | null = null;
  try {
    for await (const part of result.fullStream) {
      if (part.type === "text-delta") text += part.text;
      else if (part.type === "error") {
        streamError =
          part.error instanceof Error ? part.error.message : String(part.error);
      }
    }
  } catch (err) {
    streamError = err instanceof Error ? err.message : String(err);
  }

  if (streamError) throw new Error(`AI stream failed: ${streamError}`);
  const finalText = text.trim();
  if (!finalText) throw new Error("AI returned an empty draft");
  return finalText;
}
