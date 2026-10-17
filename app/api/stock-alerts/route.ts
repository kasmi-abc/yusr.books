import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { getDb, stockAlerts } from "@/lib/db";
import { clientKey, rateLimited } from "@/lib/rate-limit";

const alertSchema = z.object({
  slug: z.string().min(1).max(80),
  phone: z.string().min(6).max(20),
});

/** Save a back-in-stock request (public, rate-limited). */
export async function POST(req: NextRequest) {
  if (rateLimited(`alert:${clientKey(req)}`, 10))
    return NextResponse.json({ ok: false }, { status: 429 });
  const parsed = alertSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ ok: false }, { status: 400 });
  const db = await getDb();
  if (!db) return NextResponse.json({ ok: true, stored: "local" });
  try {
    await db.insert(stockAlerts).values({
      id: crypto.randomUUID(),
      slug: parsed.data.slug,
      contact: parsed.data.phone,
    });
    return NextResponse.json({ ok: true, stored: "neon" });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

/** List all alerts (admin only). */
export async function GET() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string } | undefined)?.role !== "admin")
    return NextResponse.json({ alerts: [] }, { status: 401 });
  const db = await getDb();
  if (!db) return NextResponse.json({ alerts: [] });
  try {
    const rows = await db.select().from(stockAlerts);
    return NextResponse.json({
      alerts: rows.map((r) => ({ slug: r.slug, phone: r.contact })),
    });
  } catch {
    return NextResponse.json({ alerts: [] });
  }
}
