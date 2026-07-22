/**
 * LangSmith-wrapped Vercel AI SDK helpers. Server-only.
 */

import * as ai from "ai";
import { after } from "next/server";
import { Client } from "langsmith";
import {
  createLangSmithProviderOptions,
  wrapAISDK,
} from "langsmith/experimental/vercel";
import type {
  ClassificationEntityCategory,
  ClassificationJurisdiction,
} from "@/lib/ai/classification-skill-context";
import type { PolicyKind } from "@/lib/ai/policy-suggest-prompt";
import type { RetentionIndustry, RetentionJurisdiction } from "@/lib/ai/retention-skill-context";
import type { ClassifySampleScenario } from "@/lib/ai/classify-sample-schema";
import type { EvaluateSampleScenario } from "@/lib/ai/evaluate-sample-schema";
import {
  createLangSmithClient,
  DRPE_METADATA_KEYS,
  DRPE_TRACE_TAG,
  getLangSmithConfig,
  type DrpeTraceRoute,
} from "@/lib/ai/langsmith";
import type { PrivacyMaskHeader } from "@/lib/ai/privalyse";

type TracedAiModule = {
  streamText: typeof ai.streamText;
  generateObject: typeof ai.generateObject;
  client: Client | null;
};

let cached: TracedAiModule | null = null;

export function getTracedAI(): TracedAiModule {
  if (cached) return cached;

  const config = getLangSmithConfig();
  if (!config) {
    cached = {
      streamText: ai.streamText,
      generateObject: ai.generateObject,
      client: null,
    };
    return cached;
  }

  const client = createLangSmithClient(config);
  if (!client) {
    cached = {
      streamText: ai.streamText,
      generateObject: ai.generateObject,
      client: null,
    };
    return cached;
  }

  const wrapped = wrapAISDK(ai, {
    client,
    project_name: config.project,
    tags: [DRPE_TRACE_TAG],
  });

  cached = {
    streamText: wrapped.streamText,
    generateObject: wrapped.generateObject,
    client,
  };
  return cached;
}

export type TraceContextInput = {
  route: DrpeTraceRoute;
  mode: string;
  policyKind?: PolicyKind;
  jurisdiction?: RetentionJurisdiction | ClassificationJurisdiction;
  industry?: RetentionIndustry;
  entityCategory?: ClassificationEntityCategory;
  scenario?: EvaluateSampleScenario | ClassifySampleScenario;
  webSearch?: "on" | "off" | "skipped";
  sourceCount?: number;
  privacyMask?: PrivacyMaskHeader;
  entityCount?: number;
};

export function buildTraceContext(input: TraceContextInput): {
  providerOptions: { langsmith: ReturnType<typeof createLangSmithProviderOptions> };
} {
  const config = getLangSmithConfig();
  if (!config) {
    return { providerOptions: { langsmith: {} } };
  }

  const metadata: Record<string, string | number> = {
    [DRPE_METADATA_KEYS.route]: input.route,
    [DRPE_METADATA_KEYS.mode]: input.mode,
  };

  if (input.policyKind) {
    metadata["drpe_policy_kind"] = input.policyKind;
  }
  if (input.jurisdiction) {
    metadata[DRPE_METADATA_KEYS.jurisdiction] = input.jurisdiction;
  }
  if (input.industry) {
    metadata[DRPE_METADATA_KEYS.industry] = input.industry;
  }
  if (input.entityCategory) {
    metadata["drpe_entity_category"] = input.entityCategory;
  }
  if (input.scenario) {
    metadata[DRPE_METADATA_KEYS.scenario] = input.scenario;
  }
  if (input.webSearch) {
    metadata[DRPE_METADATA_KEYS.webSearch] = input.webSearch;
  }
  if (input.sourceCount !== undefined) {
    metadata[DRPE_METADATA_KEYS.sourceCount] = input.sourceCount;
  }
  if (input.privacyMask) {
    metadata[DRPE_METADATA_KEYS.privacyMask] = input.privacyMask;
  }
  if (input.entityCount !== undefined) {
    metadata[DRPE_METADATA_KEYS.entityCount] = input.entityCount;
  }

  const runName = `${input.route}:${input.mode}`;

  return {
    providerOptions: {
      langsmith: createLangSmithProviderOptions({
        name: runName,
        tags: [DRPE_TRACE_TAG, input.route],
        metadata: {
          ...metadata,
          ls_run_name: runName,
        },
        processInputs: () => ({ redacted: true }),
        processOutputs: () => ({ redacted: true }),
        processChildLLMRunInputs: () => ({ redacted: true }),
        processChildLLMRunOutputs: () => ({ redacted: true }),
      }),
    },
  };
}

export async function flushTraces(client: Client | null): Promise<void> {
  if (!client) return;
  try {
    await client.awaitPendingTraceBatches();
  } catch (err) {
    console.error(
      "[langsmith] flush failed:",
      err instanceof Error ? err.message : "unknown error",
    );
  }
}

/** For non-streaming routes — flush after the response is sent. */
export function scheduleTraceFlush(client: Client | null): void {
  if (!client) return;
  after(async () => {
    await flushTraces(client);
  });
}
