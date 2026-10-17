import type { NextRequest } from "next/server";

const hits = new Map<string, number[]>();

/** in-memory sliding-window counter; true when over the limit */
export function rateLimited(
  key: string,
  max = 20,
  windowMs = 600_000
): boolean {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.size > 5000) hits.clear();
  list.push(now);
  hits.set(key, list);
  return list.length > max;
}

export function clientKey(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}
