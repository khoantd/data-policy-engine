/**
 * Mask → LLM → unmask helpers for Admin BFF routes. Server-only.
 */

import {
  maskForLlm,
  unmaskFromLlm,
} from "@/lib/ai/privalyse";

export type PreparedPrompt = {
  maskedText: string;
  mappingToken: string;
  entityCount: number;
};

/** Mask non-empty parts joined for a single LLM user prompt. */
export async function prepareLlmPrompt(
  parts: string[],
): Promise<PreparedPrompt | null> {
  const combined = parts
    .map((p) => p.trim())
    .filter(Boolean)
    .join("\n\n");
  if (!combined) return null;

  const result = await maskForLlm(combined);
  if (!result?.masked_text || !result.mapping_token) return null;

  return {
    maskedText: result.masked_text,
    mappingToken: result.mapping_token,
    entityCount: result.entity_count,
  };
}

export async function maskLlmText(text: string): Promise<PreparedPrompt | null> {
  if (!text.trim()) return null;
  const result = await maskForLlm(text);
  if (!result?.masked_text || !result.mapping_token) return null;
  return {
    maskedText: result.masked_text,
    mappingToken: result.mapping_token,
    entityCount: result.entity_count,
  };
}

export async function finalizeLlmText(
  masked: string,
  mappingToken: string,
): Promise<string> {
  const unmasked = await unmaskFromLlm(masked, mappingToken, true);
  return unmasked ?? masked;
}

/** Stream unmasked deltas while LLM emits masked placeholders. */
export async function* streamUnmaskDeltas(
  textStream: AsyncIterable<string>,
  mappingToken: string,
): AsyncGenerator<string> {
  let accumulated = "";
  let lastUnmasked = "";

  for await (const chunk of textStream) {
    accumulated += chunk;
    const unmasked = await unmaskFromLlm(accumulated, mappingToken, false);
    if (unmasked === null) {
      yield chunk;
      continue;
    }
    const delta = unmasked.slice(lastUnmasked.length);
    lastUnmasked = unmasked;
    if (delta) yield delta;
  }

  if (accumulated) {
    await unmaskFromLlm(accumulated, mappingToken, true);
  }
}

export async function finalizeLlmObject<T>(
  obj: T,
  mappingToken: string,
): Promise<T> {
  const json = JSON.stringify(obj);
  const unmasked = await unmaskFromLlm(json, mappingToken, true);
  if (!unmasked) return obj;
  try {
    return JSON.parse(unmasked) as T;
  } catch {
    return obj;
  }
}
