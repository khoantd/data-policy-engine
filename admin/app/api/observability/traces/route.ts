import { NextResponse } from "next/server";
import { isLangSmithConfigured } from "@/lib/ai/langsmith";
import {
  listRecentTraces,
  type TraceStatusFilter,
  type TraceWindow,
} from "@/lib/ai/langsmith-runs";
import { isRateLimited } from "@/lib/ai/rate-limit";
import { getApiKey } from "@/lib/session";

const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60_000;

function parseRoute(value: string | null) {
  if (!value || value === "all") return "all" as const;
  if (
    value === "policy-suggest" ||
    value === "evaluate-sample" ||
    value === "classify-sample"
  ) {
    return value;
  }
  return null;
}

function parseStatus(value: string | null): TraceStatusFilter {
  if (value === "success" || value === "error") return value;
  return "all";
}

function parseWindow(value: string | null): TraceWindow {
  if (value === "24h" || value === "7d" || value === "30d") return value;
  return "7d";
}

function parseWebSearch(value: string | null) {
  if (!value || value === "all") return "all" as const;
  if (value === "on" || value === "off" || value === "skipped") return value;
  return null;
}

export async function GET(request: Request) {
  const apiKey = await getApiKey();
  if (apiKey === null) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isLangSmithConfigured()) {
    return NextResponse.json(
      {
        configured: false,
        error:
          "LangSmith is not configured. Set LANGSMITH_TRACING=true and LANGSMITH_API_KEY.",
      },
      { status: 503 },
    );
  }

  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";
  if (isRateLimited(`observability:${clientIp}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const route = parseRoute(searchParams.get("route"));
  if (searchParams.get("route") && route === null) {
    return NextResponse.json({ error: "Invalid route filter" }, { status: 400 });
  }

  const webSearch = parseWebSearch(searchParams.get("webSearch"));
  if (searchParams.get("webSearch") && webSearch === null) {
    return NextResponse.json(
      { error: "Invalid webSearch filter" },
      { status: 400 },
    );
  }

  const status = parseStatus(searchParams.get("status"));
  const window = parseWindow(searchParams.get("window"));

  try {
    const { project, traces } = await listRecentTraces({
      route: route ?? "all",
      status,
      webSearch: webSearch ?? "all",
      window,
    });
    return NextResponse.json({
      configured: true,
      project,
      traces,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to list traces";
    return NextResponse.json(
      { configured: true, error: message, traces: [] },
      { status: 502 },
    );
  }
}
