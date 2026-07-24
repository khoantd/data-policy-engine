import { NextResponse } from "next/server";
import { drpe } from "@/lib/drpe-client";
import { DrpeApiError } from "@/lib/types";

/** BFF: list policy IDs linked to a catalog process (governance only). */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  try {
    const policyIds = await drpe.listProcessPolicies(id);
    return NextResponse.json(policyIds);
  } catch (err) {
    const status = err instanceof DrpeApiError ? err.status : 500;
    const error =
      err instanceof DrpeApiError
        ? String(err.detail)
        : err instanceof Error
          ? err.message
          : "Failed to load process policies";
    return NextResponse.json({ error }, { status });
  }
}
