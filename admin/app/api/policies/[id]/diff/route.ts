import { NextResponse } from "next/server";
import { drpe } from "@/lib/drpe-client";
import { DrpeApiError } from "@/lib/types";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  try {
    const body = await request.json();
    const result = await drpe.diffVersions(
      id,
      Number(body.from_version),
      Number(body.to_version),
    );
    return NextResponse.json(result);
  } catch (err) {
    const status = err instanceof DrpeApiError ? err.status : 500;
    const error =
      err instanceof DrpeApiError
        ? String(err.detail)
        : err instanceof Error
          ? err.message
          : "Diff failed";
    return NextResponse.json({ error }, { status });
  }
}
