import { NextResponse } from "next/server";
import { probeAuth } from "@/lib/drpe-client";
import { API_KEY_COOKIE, OPEN_SESSION } from "@/lib/session";
import { DrpeApiError } from "@/lib/types";

export async function POST(request: Request) {
  let body: { apiKey?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const apiKey = (body.apiKey ?? "").trim();

  try {
    await probeAuth(apiKey);
  } catch (err) {
    if (err instanceof DrpeApiError) {
      return NextResponse.json(
        { error: typeof err.detail === "string" ? err.detail : err.message },
        { status: err.status === 401 ? 401 : 502 },
      );
    }
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Cannot reach ROS Policy API. Is the server running?",
      },
      { status: 502 },
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(API_KEY_COOKIE, apiKey.length === 0 ? OPEN_SESSION : apiKey, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
