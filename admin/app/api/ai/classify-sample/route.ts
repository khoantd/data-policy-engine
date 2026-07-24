import { createOpenAI } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import {
  buildClassifySampleSystemPrompt,
  buildClassifySampleUserPrompt,
} from "@/lib/ai/classify-sample-prompt";
import {
  classifySampleBodySchema,
  classifySampleOutputSchema,
  normalizeClassifySampleRecord,
} from "@/lib/ai/classify-sample-schema";
import { applyCatalogSourceToRecord } from "@/lib/ai/catalog-sample-context";
import { getLiteLLMConfig } from "@/lib/ai/litellm";
import {
  finalizeLlmObject,
  prepareLlmPrompt,
} from "@/lib/ai/mask-for-llm";
import { isRateLimited } from "@/lib/ai/rate-limit";
import { resolvePrivacyHeader } from "@/lib/ai/privalyse";
import {
  buildTraceContext,
  getTracedAI,
  scheduleTraceFlush,
} from "@/lib/ai/traced-ai";
import { getApiKey } from "@/lib/session";

export const maxDuration = 60;

const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

export async function POST(request: Request) {
  const apiKey = await getApiKey();
  if (apiKey === null) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = getLiteLLMConfig();
  if (!config) {
    return NextResponse.json(
      {
        error:
          "AI assist is not configured. Set LITELLM_BASE_URL, LITELLM_API_KEY, and LITELLM_MODEL.",
      },
      { status: 503 },
    );
  }

  const privacyHeader = await resolvePrivacyHeader();

  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";
  if (isRateLimited(`classify-sample:${clientIp}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = classifySampleBodySchema.safeParse(json);
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join("; ");
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { scenario, policy, system, process } = parsed.data;
  const openai = createOpenAI({
    baseURL: config.baseURL,
    apiKey: config.apiKey,
    name: "litellm",
  });

  const { generateObject, client } = getTracedAI();

  const rawPrompt = buildClassifySampleUserPrompt({
    scenario,
    policy,
    system,
    process,
  });
  const prepared = await prepareLlmPrompt([rawPrompt]);
  const llmPrompt = prepared?.maskedText ?? rawPrompt;
  const mappingToken = prepared?.mappingToken ?? null;
  const entityCount = prepared?.entityCount ?? 0;

  const traceContext = buildTraceContext({
    route: "classify-sample",
    mode: "single",
    scenario,
    privacyMask: privacyHeader,
    entityCount: entityCount || undefined,
  });

  try {
    const result = await generateObject({
      model: openai.chat(config.model),
      system: buildClassifySampleSystemPrompt(),
      prompt: llmPrompt,
      schema: classifySampleOutputSchema,
      maxOutputTokens: 2_048,
      abortSignal: AbortSignal.timeout(55_000),
      ...traceContext,
    });
    const output = mappingToken
      ? await finalizeLlmObject(result.object, mappingToken)
      : result.object;
    return NextResponse.json(
      {
        record: applyCatalogSourceToRecord(
          normalizeClassifySampleRecord(output.record),
          system,
        ),
      },
      {
        headers: {
          "Cache-Control": "no-store",
          "X-DRPE-AI-Privacy": privacyHeader,
        },
      },
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "LiteLLM request failed";
    return NextResponse.json({ error: message }, { status: 502 });
  } finally {
    scheduleTraceFlush(client);
  }
}
