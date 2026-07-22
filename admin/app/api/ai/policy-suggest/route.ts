import { createOpenAI } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import { getLiteLLMConfig } from "@/lib/ai/litellm";
import {
  maskLlmText,
  prepareLlmPrompt,
  streamUnmaskDeltas,
} from "@/lib/ai/mask-for-llm";
import {
  buildPolicySuggestSystemPrompt,
  buildPolicySuggestUserPrompt,
} from "@/lib/ai/policy-suggest-prompt";
import { policySuggestBodySchema } from "@/lib/ai/policy-suggest-schema";
import {
  encodePolicySuggestEvent,
  sourceToStreamEvent,
} from "@/lib/ai/policy-suggest-stream";
import { isRateLimited } from "@/lib/ai/rate-limit";
import { resolvePrivacyHeader } from "@/lib/ai/privalyse";
import {
  isTavilyConfigured,
  searchPolicyReferences,
} from "@/lib/ai/tavily";
import {
  buildTraceContext,
  flushTraces,
  getTracedAI,
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
  if (isRateLimited(`policy-suggest:${clientIp}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = policySuggestBodySchema.safeParse(json);
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join("; ");
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { policyKind, mode, description, yaml, jurisdiction, industry, entityCategory, webSearch } =
    parsed.data;

  const useWebSearch = webSearch && isTavilyConfigured();
  const webSearchHeader = useWebSearch
    ? "on"
    : webSearch
      ? "off"
      : "skipped";

  const openai = createOpenAI({
    baseURL: config.baseURL,
    apiKey: config.apiKey,
    name: "litellm",
  });

  const { streamText, client } = getTracedAI();

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const enqueue = (event: Parameters<typeof encodePolicySuggestEvent>[0]) => {
        controller.enqueue(encoder.encode(encodePolicySuggestEvent(event)));
      };

      try {
        let entityCount = 0;
        let mappingToken: string | null = null;

        if (privacyHeader === "on") {
          enqueue({ event: "status", message: "Masking sensitive fields…" });
        }

        const userPrompt = buildPolicySuggestUserPrompt({
          mode,
          description,
          yaml,
        });
        const prepared = await prepareLlmPrompt([userPrompt]);
        const llmPrompt = prepared?.maskedText ?? userPrompt;
        if (prepared) {
          mappingToken = prepared.mappingToken;
          entityCount = prepared.entityCount;
          enqueue({ event: "privacy", entityCount });
        }

        let sources: Awaited<ReturnType<typeof searchPolicyReferences>> = [];

        if (useWebSearch) {
          enqueue({ event: "status", message: "Searching references…" });
          let searchDescription = description;
          if (privacyHeader === "on") {
            const maskedDesc = await maskLlmText(description);
            if (maskedDesc) {
              searchDescription = maskedDesc.maskedText;
            }
          }
          sources = await searchPolicyReferences({
            policyKind,
            mode,
            description: searchDescription,
            jurisdiction,
            industry,
            entityCategory,
          });
          for (const source of sources) {
            enqueue(sourceToStreamEvent(source));
          }
        }

        enqueue({ event: "status", message: "Generating draft…" });

        const result = streamText({
          model: openai.chat(config.model),
          system: buildPolicySuggestSystemPrompt(
            mode,
            { jurisdiction, industry, entityCategory },
            sources,
            policyKind,
          ),
          prompt: llmPrompt,
          maxOutputTokens: 4_096,
          abortSignal: AbortSignal.timeout(55_000),
          ...buildTraceContext({
            route: "policy-suggest",
            mode,
            policyKind,
            jurisdiction,
            industry,
            entityCategory,
            webSearch: webSearchHeader,
            sourceCount: sources.length,
            privacyMask: privacyHeader,
            entityCount: entityCount || undefined,
          }),
        });

        if (mappingToken) {
          for await (const delta of streamUnmaskDeltas(
            result.textStream,
            mappingToken,
          )) {
            enqueue({ event: "text", delta });
          }
        } else {
          for await (const chunk of result.textStream) {
            enqueue({ event: "text", delta: chunk });
          }
        }

        enqueue({ event: "done" });
        controller.close();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "LiteLLM request failed";
        enqueue({ event: "error", message });
        controller.close();
      } finally {
        await flushTraces(client);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-DRPE-AI-Mode": mode,
      "X-DRPE-AI-Policy-Kind": policyKind,
      "X-DRPE-AI-Web-Search": webSearchHeader,
      "X-DRPE-AI-Privacy": privacyHeader,
    },
  });
}
