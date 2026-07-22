import { cookies } from "next/headers";

export const API_KEY_COOKIE = "drpe_api_key";
export const OPEN_SESSION = "__none__";

export async function getApiKey(): Promise<string | null> {
  const store = await cookies();
  const fromCookie = store.get(API_KEY_COOKIE)?.value;
  if (fromCookie !== undefined) {
    return fromCookie === OPEN_SESSION ? "" : fromCookie;
  }
  const envKey = process.env.DRPE_API_KEY;
  return envKey ?? null;
}

export async function setApiKey(apiKey: string): Promise<void> {
  const store = await cookies();
  store.set(API_KEY_COOKIE, apiKey.length === 0 ? OPEN_SESSION : apiKey, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearApiKey(): Promise<void> {
  const store = await cookies();
  store.delete(API_KEY_COOKIE);
}

export function cookieHasSession(cookieValue: string | undefined): boolean {
  return cookieValue !== undefined && cookieValue.length > 0;
}
