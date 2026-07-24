import { NextResponse } from "next/server";
import { drpe } from "@/lib/drpe-client";
import { DrpeApiError } from "@/lib/types";

/** BFF: fetch a single policy by id (lazy load for playgrounds). */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  try {
    const policy = await drpe.getPolicy(id);
    return NextResponse.json(policy);
  } catch (err) {
    const status = err instanceof DrpeApiError ? err.status : 500;
    const error =
      err instanceof DrpeApiError
        ? String(err.detail)
        : err instanceof Error
          ? err.message
          : "Failed to load policy";
    return NextResponse.json({ error }, { status });
  }
}
