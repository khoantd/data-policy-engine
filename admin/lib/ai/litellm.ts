/**
 * LiteLLM proxy config (OpenAI-compatible). Server-only — never import from client components.
 */

export type LiteLLMConfig = {
  baseURL: string;
  apiKey: string;
  model: string;
};

export function getLiteLLMConfig(): LiteLLMConfig | null {
  const baseURL = process.env.LITELLM_BASE_URL?.trim();
  const apiKey = process.env.LITELLM_API_KEY?.trim();
  const model = process.env.LITELLM_MODEL?.trim();
  if (!baseURL || !apiKey || !model) return null;
  return { baseURL: baseURL.replace(/\/$/, ""), apiKey, model };
}

export function isLiteLLMConfigured(): boolean {
  return getLiteLLMConfig() !== null;
}
