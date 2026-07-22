/**
 * Tavily web search for Policy Import AI. Server-only — never import from client components.
 */

import { tavily } from "@tavily/core";
import type { PolicySuggestMode, PolicyKind } from "@/lib/ai/policy-suggest-prompt";
import type {
  ClassificationEntityCategory,
  ClassificationJurisdiction,
} from "@/lib/ai/classification-skill-context";
import type {
  RetentionIndustry,
  RetentionJurisdiction,
} from "@/lib/ai/retention-skill-context";
import { buildPolicySearchQuery } from "@/lib/ai/web-search";

export type WebSearchSource = {
  id: number;
  title: string;
  url: string;
  snippet: string;
  domain: string;
};

export type TavilyConfig = {
  apiKey: string;
};

const SEARCH_TIMEOUT_MS = 8_000;

const JURISDICTION_DOMAINS: Partial<Record<RetentionJurisdiction, string[]>> = {
  EU_GDPR: ["ec.europa.eu", "gdpr.eu", "ico.org.uk", "edpb.europa.eu"],
  VN_PDPD: ["thuvienphapluat.vn", "moj.gov.vn"],
  SG_PDPA: ["pdpc.gov.sg", "sso.agc.gov.sg"],
};

export function getTavilyConfig(): TavilyConfig | null {
  const apiKey = process.env.TAVILY_API_KEY?.trim();
  if (!apiKey) return null;
  return { apiKey };
}

export function isTavilyConfigured(): boolean {
  return getTavilyConfig() !== null;
}

function isHttpsUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function normalizeResults(
  results: Array<{ title: string; url: string; content: string }>,
): WebSearchSource[] {
  const sources: WebSearchSource[] = [];
  for (const result of results) {
    if (!isHttpsUrl(result.url)) continue;
    const domain = extractDomain(result.url);
    if (!domain) continue;
    sources.push({
      id: sources.length + 1,
      title: result.title.trim() || domain,
      url: result.url,
      snippet: result.content.trim().slice(0, 400),
      domain,
    });
    if (sources.length >= 5) break;
  }
  return sources;
}

export type PolicySearchInput = {
  policyKind: PolicyKind;
  mode: PolicySuggestMode;
  description: string;
  jurisdiction?: RetentionJurisdiction | ClassificationJurisdiction;
  industry?: RetentionIndustry;
  entityCategory?: ClassificationEntityCategory;
};

/** @deprecated Use searchPolicyReferences */
export type RetentionSearchInput = Omit<PolicySearchInput, "policyKind"> & {
  policyKind?: "retention";
};

export async function searchPolicyReferences(
  input: PolicySearchInput,
): Promise<WebSearchSource[]> {
  const config = getTavilyConfig();
  if (!config) return [];

  const query = buildPolicySearchQuery(input);
  const includeDomains = input.jurisdiction
    ? JURISDICTION_DOMAINS[input.jurisdiction as RetentionJurisdiction]
    : undefined;

  try {
    const client = tavily({ apiKey: config.apiKey });
    const response = await client.search(query, {
      searchDepth: "advanced",
      maxResults: 5,
      timeRange: "year",
      includeDomains,
      timeout: SEARCH_TIMEOUT_MS,
    });
    return normalizeResults(response.results);
  } catch (err) {
    console.error(
      "[tavily] search failed:",
      err instanceof Error ? err.message : "unknown error",
    );
    return [];
  }
}

export async function searchRetentionReferences(
  input: RetentionSearchInput,
): Promise<WebSearchSource[]> {
  return searchPolicyReferences({ ...input, policyKind: "retention" });
}
