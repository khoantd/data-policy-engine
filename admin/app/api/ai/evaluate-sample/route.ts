import { createOpenAI } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import {
  buildEvaluateSampleSystemPrompt,
  buildEvaluateSampleUserPrompt,
} from "@/lib/ai/evaluate-sample-prompt";
import {
  evaluateSampleBatchOutputSchema,
  evaluateSampleBodySchema,
  evaluateSampleSingleOutputSchema,
  normalizeEvaluateSampleRecord,
} from "@/lib/ai/evaluate-sample-schema";
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
  if (isRateLimited(`evaluate-sample:${clientIp}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = evaluateSampleBodySchema.safeParse(json);
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join("; ");
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { mode, scenario, policy, system, process } = parsed.data;
  const openai = createOpenAI({
    baseURL: config.baseURL,
    apiKey: config.apiKey,
    name: "litellm",
  });

  const { generateObject, client } = getTracedAI();

  const rawPrompt = buildEvaluateSampleUserPrompt({
    mode,
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
    route: "evaluate-sample",
    mode,
    scenario: mode === "single" ? scenario : undefined,
    privacyMask: privacyHeader,
    entityCount: entityCount || undefined,
  });

  try {
    const systemPrompt = buildEvaluateSampleSystemPrompt();

    if (mode === "batch") {
      const result = await generateObject({
        model: openai.chat(config.model),
        system: systemPrompt,
        prompt: llmPrompt,
        schema: evaluateSampleBatchOutputSchema,
        maxOutputTokens: 4_096,
        abortSignal: AbortSignal.timeout(55_000),
        ...traceContext,
      });
      const output = mappingToken
        ? await finalizeLlmObject(result.object, mappingToken)
        : result.object;
      return NextResponse.json(
        {
          records: output.records
            .map(normalizeEvaluateSampleRecord)
            .map((record) => applyCatalogSourceToRecord(record, system)),
        },
        {
          headers: {
            "Cache-Control": "no-store",
            "X-DRPE-AI-Privacy": privacyHeader,
          },
        },
      );
    }

    const result = await generateObject({
      model: openai.chat(config.model),
      system: systemPrompt,
      prompt: llmPrompt,
      schema: evaluateSampleSingleOutputSchema,
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
          normalizeEvaluateSampleRecord(output.record),
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
