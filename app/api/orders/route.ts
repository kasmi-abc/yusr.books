import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { eq, or } from "drizzle-orm";
import { z } from "zod";
import { Order } from "@/lib/data";
import { authOptions } from "@/lib/auth";
import { getDb, orders } from "@/lib/db";
import { clientKey, rateLimited } from "@/lib/rate-limit";

const itemSchema = z.object({
  slug: z.string().min(1).max(80),
  title: z.string().min(1).max(200),
  qty: z.number().int().min(1).max(99),
  price: z.number().int().min(0),
});

const orderSchema = z.object({
  number: z.string().min(4).max(20),
  name: z.string().min(2).max(80),
  phone: z.string().min(6).max(20),
  phone2: z.string().max(20).optional(),
  wilaya: z.number().int().min(1).max(35),
  commune: z.string().min(1).max(80),
  deliveryType: z.enum(["home", "office"]),
  carrier: z.string().max(40).optional(),
  items: z.array(itemSchema).min(1).max(50),
  subtotal: z.number().int().min(0),
  discount: z.number().int().min(0).default(0),
  deliveryFee: z.number().int().min(0),
  gift: z.boolean().default(false),
  giftNote: z.string().max(300).optional(),
  notes: z.string().max(500).optional(),
  otp: z.string().regex(/^\d{4}$/),
});

const patchSchema = z.object({
  number: z.string().min(4).max(20),
  patch: z
    .object({
      status: z
        .enum([
          "pending",
          "confirmed",
          "packed",
          "shipped",
          "delivered",
          "returned",
          "cancelled",
        ])
        .optional(),
      carrier: z.string().max(40).optional(),
      notes: z.string().max(500).optional(),
    })
    .refine((p) => Object.values(p).some((v) => v !== undefined)),
});

async function isAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return (session?.user as { role?: string } | undefined)?.role === "admin";
}

type Row = typeof orders.$inferSelect;

function toOrder(r: Row): Order {
  return {
    number: r.number,
    name: r.name,
    phone: r.phone,
    phone2: r.phone2 ?? undefined,
    wilaya: r.wilaya,
    commune: r.commune,
    deliveryType: r.deliveryType as Order["deliveryType"],
    carrier: r.carrier ?? undefined,
    items: JSON.parse(r.items) as Order["items"],
    subtotal: r.subtotal,
    discount: r.discount,
    deliveryFee: r.deliveryFee,
    gift: r.gift,
    giftNote: r.giftNote ?? undefined,
    notes: r.notes ?? undefined,
    status: r.status as Order["status"],
    otp: r.otp,
    verified: r.verified,
    createdAt: r.createdAt.toISOString(),
  };
}

/** Save order to Neon when DATABASE_URL is set; else acknowledge (local mode). */
export async function POST(req: NextRequest) {
  if (rateLimited(`post:${clientKey(req)}`))
    return NextResponse.json({ ok: false }, { status: 429 });
  const parsed = orderSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ ok: false }, { status: 400 });
  const b = parsed.data;
  const db = await getDb();
  if (db) {
    await db
      .insert(orders)
      .values({
        number: b.number,
        name: b.name,
        phone: b.phone,
        phone2: b.phone2 ?? null,
        wilaya: b.wilaya,
        commune: b.commune,
        deliveryType: b.deliveryType,
        carrier: b.carrier ?? null,
        items: JSON.stringify(b.items),
        subtotal: b.subtotal,
        discount: b.discount,
        deliveryFee: b.deliveryFee,
        gift: b.gift,
        giftNote: b.giftNote ?? null,
        notes: b.notes ?? null,
        status: "pending",
        otp: b.otp,
        verified: false,
      })
      .onConflictDoNothing();
    return NextResponse.json({ ok: true, stored: "neon" });
  }
  return NextResponse.json({ ok: true, stored: "local" });
}

/** ?q= public order lookup; ?all=1 admin-only full list. */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? "";
  const all = url.searchParams.get("all") === "1";
  const db = await getDb();
  if (!db) return NextResponse.json({ orders: [] });
  if (all) {
    if (!(await isAdmin()))
      return NextResponse.json({ orders: [] }, { status: 401 });
    try {
      const rows = await db.select().from(orders);
      return NextResponse.json({ orders: rows.map(toOrder) });
    } catch {
      return NextResponse.json({ orders: [] });
    }
  }
  if (!q || rateLimited(`get:${clientKey(req)}`, 30))
    return NextResponse.json({ orders: [] });
  try {
    const needle = q.trim();
    const flat = needle.replace(/\s/g, "");
    const rows = await db
      .select()
      .from(orders)
      .where(
        or(
          eq(orders.number, needle),
          eq(orders.phone, needle),
          eq(orders.phone, flat)
        )
      );
    return NextResponse.json({ orders: rows.map(toOrder) });
  } catch {
    return NextResponse.json({ orders: [] });
  }
}

/** Admin order update (status / carrier / notes). */
export async function PATCH(req: NextRequest) {
  if (rateLimited(`patch:${clientKey(req)}`))
    return NextResponse.json({ ok: false }, { status: 429 });
  if (!(await isAdmin()))
    return NextResponse.json({ ok: false }, { status: 401 });
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ ok: false }, { status: 400 });
  const { number, patch } = parsed.data;
  const db = await getDb();
  if (!db) return NextResponse.json({ ok: false }, { status: 400 });
  try {
    await db
      .update(orders)
      .set(patch)
      .where(eq(orders.number, number));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
