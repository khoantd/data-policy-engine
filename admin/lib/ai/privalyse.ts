/**
 * FastAPI privacy masking client (privalyse-mask). Server-only.
 */

import { drpeFetch } from "@/lib/drpe-client";

export type PrivacyStatus = {
  available: boolean;
  enabled: boolean;
  model_size: string | null;
  languages: string[];
};

export type MaskResponse = {
  masked_text?: string;
  masked_messages?: Array<{ role: string; content: string }>;
  mapping_token: string;
  entity_count: number;
};

export type UnmaskResponse = {
  text: string;
};

/** Default on unless explicitly disabled. */
export function isPrivacyMaskEnabled(): boolean {
  const raw = process.env.PRIVACY_MASK_ENABLED?.trim().toLowerCase();
  if (raw === "false" || raw === "0" || raw === "no") return false;
  return true;
}

export async function getPrivacyStatus(): Promise<PrivacyStatus> {
  if (!isPrivacyMaskEnabled()) {
    return { available: false, enabled: false, model_size: null, languages: [] };
  }
  try {
    return await drpeFetch<PrivacyStatus>("/privacy/status");
  } catch {
    return { available: false, enabled: true, model_size: null, languages: [] };
  }
}

export async function isPrivacyMaskConfigured(): Promise<boolean> {
  const status = await getPrivacyStatus();
  return status.available;
}

export async function maskForLlm(text: string): Promise<MaskResponse | null> {
  if (!isPrivacyMaskEnabled()) return null;
  try {
    return await drpeFetch<MaskResponse>("/privacy/mask", {
      method: "POST",
      body: JSON.stringify({ text }),
    });
  } catch (err) {
    console.error(
      "[privacy] mask failed:",
      err instanceof Error ? err.message : "unknown error",
    );
    return null;
  }
}

export async function unmaskFromLlm(
  text: string,
  mappingToken: string,
  consumeToken = true,
): Promise<string | null> {
  if (!isPrivacyMaskEnabled()) return null;
  try {
    const result = await drpeFetch<UnmaskResponse>("/privacy/unmask", {
      method: "POST",
      body: JSON.stringify({
        text,
        mapping_token: mappingToken,
        consume_token: consumeToken,
      }),
    });
    return result.text;
  } catch (err) {
    console.error(
      "[privacy] unmask failed:",
      err instanceof Error ? err.message : "unknown error",
    );
    return null;
  }
}

export type PrivacyMaskHeader = "on" | "off" | "skipped";

export async function resolvePrivacyHeader(): Promise<PrivacyMaskHeader> {
  if (!isPrivacyMaskEnabled()) return "off";
  const status = await getPrivacyStatus();
  return status.available ? "on" : "skipped";
}
