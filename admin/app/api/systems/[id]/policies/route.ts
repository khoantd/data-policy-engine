import { NextResponse } from "next/server";
import { drpe } from "@/lib/drpe-client";
import { DrpeApiError } from "@/lib/types";

/** BFF: list policy IDs linked to a catalog system (governance only). */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  try {
    const policyIds = await drpe.listSystemPolicies(id);
    return NextResponse.json(policyIds);
  } catch (err) {
    const status = err instanceof DrpeApiError ? err.status : 500;
    const error =
      err instanceof DrpeApiError
        ? String(err.detail)
        : err instanceof Error
          ? err.message
          : "Failed to load system policies";
    return NextResponse.json({ error }, { status });
  }
}
