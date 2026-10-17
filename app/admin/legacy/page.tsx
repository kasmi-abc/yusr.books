"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Download,
  LogOut,
  Package,
  Pencil,
  Plus,
  Printer,
  RotateCcw,
  ShoppingBag,
  Star,
  Trash2,
  Truck,
  Users,
  Wallet,
} from "lucide-react";
import {
  BOOKS,
  Book,
  Order,
  OrderStatus,
  TESTIMONIALS,
  WILAYAS,
  formatPrice,
  orderTotal,
} from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

type Tab = "analytics" | "products" | "orders" | "customers" | "shipping" | "returns";

const STATUS: OrderStatus[] = ["pending", "confirmed", "packed", "shipped", "delivered", "returned"];

export default function AdminPage() {
  const { t } = useI18n();
  const { status } = useSession();
  const router = useRouter();
  const { orders, updateOrder } = useStore();
  const [tab, setTab] = useState<Tab>("analytics");
  const [remote, setRemote] = useState<Order[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    let alive = true;
    fetch("/api/orders?all=1")
      .then((r) => (r.ok ? r.json() : { orders: [] }))
      .then((d) => {
        if (alive && Array.isArray(d.orders)) setRemote(d.orders);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [status]);

  const all = useMemo(() => {
    const map = new Map<string, Order>();
    for (const o of orders) map.set(o.number, o);
    for (const o of remote) map.set(o.number, o);
    return [...map.values()].sort((a, b) =>
      (b.createdAt ?? "").localeCompare(a.createdAt ?? "")
    );
  }, [orders, remote]);

  const patchOrder = (number: string, patch: Partial<Order>) => {
    if (remote.some((o) => o.number === number)) {
      setRemote((rs) =>
        rs.map((o) => (o.number === number ? { ...o, ...patch } : o))
      );
      fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number, patch }),
      }).catch(() => {});
    } else {
      updateOrder(number, patch);
    }
  };

  if (status === "loading")
    return <div className="px-4 py-20 text-center font-bold">...</div>;
  if (status === "unauthenticated") return null;

  const revenue = all
    .filter((o) => o.status !== "returned")
    .reduce((s, o) => s + orderTotal(o), 0);

  const tabs: { id: Tab; label: string; icon: typeof Package }[] = [
    { id: "analytics", label: t("tabAnalytics"), icon: BarChart3 },
    { id: "products", label: t("tabProducts"), icon: ShoppingBag },
    { id: "orders", label: t("tabOrders"), icon: Package },
    { id: "customers", label: t("tabCustomers"), icon: Users },
    { id: "shipping", label: t("tabShipping"), icon: Truck },
    { id: "returns", label: t("tabReturns"), icon: RotateCcw },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold text-primary-950">
          {t("dash")}
        </h1>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-1.5 rounded-full border border-cream-300 bg-white px-5 py-2.5 text-sm font-bold text-ink-700 hover:text-red-600"
        >
          <LogOut size={15} /> {t("logout")}
        </button>
      </div>

      <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold transition ${
              tab === tb.id
                ? "bg-primary-800 text-white"
                : "border border-cream-300 bg-white text-ink-700"
            }`}
          >
            <tb.icon size={15} /> {tb.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "analytics" && (
          <Analytics all={all} revenue={revenue} />
        )}
        {tab === "products" && <Products />}
        {tab === "orders" && (
          <Orders all={all} onStatus={(n, s) => patchOrder(n, { status: s })} />
        )}
        {tab === "customers" && <Customers />}
        {tab === "shipping" && <Shipping all={all} />}
        {tab === "returns" && (
          <Returns all={all} onStatus={(n, s) => patchOrder(n, { status: s })} />
        )}
      </div>
    </div>
  );
}

/* ---------- ANALYTICS ---------- */
function Analytics({ all, revenue }: { all: Order[]; revenue: number }) {
  const { t } = useI18n();
  const pending = all.filter((o) => o.status === "pending").length;
  const cards = [
    { icon: Wallet, label: t("statRevenue"), value: `${formatPrice(revenue)} ${t("da")}` },
    { icon: Package, label: t("statOrders"), value: String(all.length) },
    { icon: ShoppingBag, label: t("statBooks"), value: String(BOOKS.length) },
    { icon: BarChart3, label: t("statPending"), value: String(pending) },
  ];
  const top = [...BOOKS].sort((a, b) => b.sold - a.sold).slice(0, 5);
  const max = top[0]?.sold ?? 1;

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c, i) => (
          <div key={i} className="rounded-2xl border border-cream-300 bg-white p-5">
            <c.icon size={22} className="text-gold-600" />
            <p className="mt-2 text-2xl font-bold text-primary-950">{c.value}</p>
            <p className="text-sm text-ink-500">{c.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-cream-300 bg-white p-6">
        <h3 className="font-bold text-primary-950">{t("topBooks")}</h3>
        <div className="mt-4 space-y-3">
          {top.map((b) => (
            <div key={b.slug} className="flex items-center gap-3">
              <span className="w-40 truncate text-sm font-bold">{b.title}</span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-cream-200">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-primary-800 to-gold-500"
                  style={{ width: `${Math.round((b.sold / max) * 100)}%` }}
                />
              </div>
              <span className="w-16 text-end text-sm font-bold text-ink-500">{b.sold}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- PRODUCTS ---------- */
function Products() {
  const { t } = useI18n();
  const [list, setList] = useState<Book[]>(BOOKS);
  const [editing, setEditing] = useState<Book | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: "", author: "", price: 1000, stock: 10 });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("yusr-admin-products");
      if (raw) setList(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("yusr-admin-products", JSON.stringify(list));
    } catch {}
  }, [list]);

  const saveEdit = () => {
    if (!editing) return;
    setList((l) => l.map((b) => (b.slug === editing.slug ? editing : b)));
    setEditing(null);
  };

  return (
    <div className="rounded-2xl border border-cream-300 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold text-primary-950">{t("tabProducts")} ({list.length})</h3>
        <button
          onClick={() => setAdding(!adding)}
          className="flex items-center gap-1.5 rounded-full bg-primary-800 px-4 py-2 text-sm font-bold text-white"
        >
          <Plus size={15} /> {t("newOrder")}
        </button>
      </div>

      {adding && (
        <form
          className="mb-4 grid gap-2 rounded-2xl bg-cream-50 p-4 md:grid-cols-5"
          onSubmit={(e) => {
            e.preventDefault();
            const slug = `book-${Date.now()}`;
            setList((l) => [
              ...l,
              {
                slug,
                title: form.title || "كتاب جديد",
                author: form.author || "—",
                publisher: "مكتبة يُسر",
                volumes: 1,
                pages: 200,
                binding: { ar: "غلاف مقوى", fr: "Rigide", en: "Hard" },
                price: form.price,
                rating: 5,
                reviews: 0,
                category: "student",
                stock: form.stock,
                sold: 0,
                hue: 150,
                desc: { ar: "", fr: "", en: "" },
                index: [],
              },
            ]);
            setAdding(false);
            setForm({ title: "", author: "", price: 1000, stock: 10 });
          }}
        >
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="العنوان" className="rounded-xl border border-cream-300 px-3 py-2 text-sm" />
          <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="المؤلف" className="rounded-xl border border-cream-300 px-3 py-2 text-sm" />
          <input value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} type="number" placeholder="السعر" className="rounded-xl border border-cream-300 px-3 py-2 text-sm" />
          <input value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} type="number" placeholder="المخزون" className="rounded-xl border border-cream-300 px-3 py-2 text-sm" />
          <button className="rounded-xl bg-gold-500 px-4 py-2 text-sm font-bold text-primary-950">{t("save")}</button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-cream-200 text-start text-ink-500">
              <th className="py-2 text-start">الكتاب</th>
              <th className="text-start">السعر</th>
              <th className="text-start">المخزون</th>
              <th className="text-start">المبيعات</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((b) => (
              <tr key={b.slug} className="border-b border-cream-100">
                <td className="py-2.5 font-bold text-primary-950">{b.title}<span className="block text-xs font-normal text-ink-500">{b.author}</span></td>
                <td>
                  {editing?.slug === b.slug ? (
                    <input type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} className="w-24 rounded-lg border border-cream-300 px-2 py-1" />
                  ) : (
                    `${formatPrice(b.price)}`
                  )}
                </td>
                <td>
                  {editing?.slug === b.slug ? (
                    <input type="number" value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} className="w-20 rounded-lg border border-cream-300 px-2 py-1" />
                  ) : (
                    <span className={b.stock === 0 ? "font-bold text-red-600" : b.stock < 12 ? "font-bold text-gold-600" : ""}>{b.stock}</span>
                  )}
                </td>
                <td>{b.sold}</td>
                <td className="whitespace-nowrap text-end">
                  {editing?.slug === b.slug ? (
                    <>
                      <button onClick={saveEdit} className="rounded-lg bg-primary-800 px-3 py-1 text-xs font-bold text-white">{t("save")}</button>{" "}
                      <button onClick={() => setEditing(null)} className="rounded-lg border px-3 py-1 text-xs font-bold">{t("cancel")}</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setEditing(b)} aria-label="edit" className="rounded-lg p-1.5 text-primary-700 hover:bg-cream-100"><Pencil size={15} /></button>
                      <button onClick={() => setList((l) => l.filter((x) => x.slug !== b.slug))} aria-label="delete" className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"><Trash2 size={15} /></button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- ORDERS ---------- */
function Orders({
  all,
  onStatus,
}: {
  all: Order[];
  onStatus: (n: string, s: OrderStatus) => void;
}) {
  const { t } = useI18n();
  return (
    <div className="space-y-3">
      {all.map((o) => (
        <div key={o.number} className="rounded-2xl border border-cream-300 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-bold text-primary-950">{o.number} — {o.name} <span className="font-normal text-ink-500" dir="ltr">{o.phone}</span></p>
            <select
              value={o.status}
              onChange={(e) => onStatus(o.number, e.target.value as OrderStatus)}
              className="rounded-xl border border-cream-300 bg-cream-50 px-3 py-2 text-sm font-bold"
            >
              {STATUS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <p className="mt-1 text-sm text-ink-500">
            {WILAYAS.find((w) => w.code === o.wilaya)?.ar} {o.commune} • {o.items.map((i) => `${i.title}×${i.qty}`).join("، ")}
          </p>
          <p className="mt-1 text-sm font-bold text-primary-800">
            {t("total")}: {formatPrice(orderTotal(o))} {t("da")} {o.verified ? "• ✓ OTP" : "• OTP؟"}
          </p>
        </div>
      ))}
      {all.length === 0 && <p className="text-center font-bold text-ink-500">—</p>}
    </div>
  );
}

/* ---------- CUSTOMERS ---------- */
function Customers() {
  const { t, locale } = useI18n();
  const [reviews, setReviews] = useState(TESTIMONIALS);
  const [alerts, setAlerts] = useState<Array<{ slug: string; phone: string }>>([]);

  useEffect(() => {
    try {
      setAlerts(JSON.parse(localStorage.getItem("yusr-alerts") ?? "[]"));
    } catch {}
  }, []);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-2xl border border-cream-300 bg-white p-5">
        <h3 className="flex items-center gap-2 font-bold text-primary-950">
          <Star size={16} className="text-gold-500" /> {t("testimonialsTitle")} ({reviews.length})
        </h3>
        <div className="mt-3 space-y-3">
          {reviews.map((r, i) => (
            <div key={i} className="rounded-xl bg-cream-50 p-3 text-sm">
              <p className="font-bold">{r.name[locale]} <span className="font-normal text-ink-500">— {r.wilaya}</span></p>
              <p className="mt-1 text-ink-700">{r.text[locale]}</p>
              <button onClick={() => setReviews((x) => x.filter((_, j) => j !== i))} className="mt-1 text-xs font-bold text-red-600">{t("remove")}</button>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-cream-300 bg-white p-5">
        <h3 className="font-bold text-primary-950">
          {locale === "ar" ? "تنبيهات توفر المنتج" : "Alertes stock"} ({alerts.length})
        </h3>
        <div className="mt-3 space-y-2 text-sm">
          {alerts.map((a, i) => (
            <div key={i} className="flex justify-between rounded-xl bg-cream-50 px-3 py-2">
              <span className="font-bold">{BOOKS.find((b) => b.slug === a.slug)?.title ?? a.slug}</span>
              <span dir="ltr">{a.phone}</span>
            </div>
          ))}
          {alerts.length === 0 && <p className="text-ink-500">—</p>}
        </div>
      </div>
    </div>
  );
}

/* ---------- SHIPPING ---------- */
function Shipping({ all }: { all: Order[] }) {
  const { t } = useI18n();
  const [sel, setSel] = useState<string[]>([]);
  const [print, setPrint] = useState(false);
  const chosen = all.filter((o) => sel.includes(o.number));

  const csv = () => {
    const rows = [
      ["number", "name", "phone", "wilaya", "commune", "type", "total"].join(","),
      ...chosen.map((o) =>
        [o.number, `"${o.name}"`, o.phone, o.wilaya, `"${o.commune}"`, o.deliveryType, orderTotal(o)].join(",")
      ),
    ].join("\n");
    const blob = new Blob(["\uFEFF" + rows], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "bordereau.csv";
    a.click();
  };

  return (
    <div className="rounded-2xl border border-cream-300 bg-white p-5">
      <div className="flex flex-wrap gap-2">
        <button onClick={csv} disabled={chosen.length === 0} className="flex items-center gap-1.5 rounded-full bg-primary-800 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-40">
          <Download size={15} /> {t("exportCsv")} (Amana / Ozone)
        </button>
        <button onClick={() => setPrint(true)} disabled={chosen.length === 0} className="flex items-center gap-1.5 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-bold text-primary-950 disabled:opacity-40">
          <Printer size={15} /> {t("printLabel")}
        </button>
      </div>
      <div className="mt-4 space-y-2">
        {all.filter((o) => o.status !== "delivered" && o.status !== "returned").map((o) => (
          <label key={o.number} className="flex cursor-pointer items-center gap-3 rounded-xl bg-cream-50 px-4 py-3 text-sm">
            <input
              type="checkbox"
              checked={sel.includes(o.number)}
              onChange={() =>
                setSel((s) => (s.includes(o.number) ? s.filter((x) => x !== o.number) : [...s, o.number]))
              }
              className="h-5 w-5 accent-primary-800"
            />
            <span className="font-bold">{o.number}</span>
            <span>{o.name}</span>
            <span className="text-ink-500">{WILAYAS.find((w) => w.code === o.wilaya)?.ar}</span>
            <b className="ms-auto">{formatPrice(orderTotal(o))} {t("da")}</b>
          </label>
        ))}
      </div>

      {print && (
        <div className="fixed inset-0 z-[200] overflow-auto bg-white p-8">
          <button onClick={() => setPrint(false)} className="print-hidden mb-4 rounded-full bg-primary-800 px-6 py-2 font-bold text-white">
            {t("close")}
          </button>
          <button onClick={() => window.print()} className="print-hidden mb-6 ms-2 rounded-full bg-gold-500 px-6 py-2 font-bold text-primary-950">
            <Printer size={15} className="inline" /> Print
          </button>
          <div className="grid gap-4 md:grid-cols-2">
            {chosen.map((o) => (
              <div key={o.number} className="rounded-xl border-2 border-black p-5" dir="rtl">
                <h2 className="font-display text-2xl font-bold">مكتبة يُسر — Bordereau</h2>
                <p className="mt-2"><b>N°:</b> {o.number}</p>
                <p><b>Nom:</b> {o.name} — <span dir="ltr">{o.phone}</span></p>
                <p><b>Ville:</b> {o.wilaya} {WILAYAS.find((w) => w.code === o.wilaya)?.ar} / {WILAYAS.find((w) => w.code === o.wilaya)?.fr} — {o.commune}</p>
                <p><b>Type:</b> {o.deliveryType === "home" ? "Domicile" : "Bureau"}</p>
                <p><b>Articles:</b> {o.items.map((i) => `${i.title} ×${i.qty}`).join(" + ")}</p>
                <p className="mt-2 text-xl"><b>COD: {formatPrice(orderTotal(o))} DA</b></p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- RETURNS ---------- */
function Returns({
  all,
  onStatus,
}: {
  all: Order[];
  onStatus: (n: string, s: OrderStatus) => void;
}) {
  const { t } = useI18n();
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [reason, setReason] = useState("");

  useEffect(() => {
    try {
      setReasons(JSON.parse(localStorage.getItem("yusr-returns") ?? "{}"));
    } catch {}
  }, []);

  const mark = (n: string) => {
    onStatus(n, "returned");
    const r = { ...reasons, [n]: reason || "بدون سبب" };
    setReasons(r);
    try {
      localStorage.setItem("yusr-returns", JSON.stringify(r));
    } catch {}
    setReason("");
  };

  const returned = all.filter((o) => o.status === "returned");

  return (
    <div className="rounded-2xl border border-cream-300 bg-white p-5">
      <div className="flex gap-2">
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={locale_ph(t)}
          className="flex-1 rounded-xl border border-cream-300 px-4 py-2.5 text-sm outline-none"
        />
      </div>
      <div className="mt-4 space-y-2">
        {all.filter((o) => o.status !== "returned").map((o) => (
          <div key={o.number} className="flex items-center justify-between gap-2 rounded-xl bg-cream-50 px-4 py-2.5 text-sm">
            <span className="font-bold">{o.number} — {o.name}</span>
            <button onClick={() => mark(o.number)} className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold text-white">
              {t("statusReturned")}
            </button>
          </div>
        ))}
      </div>
      <h3 className="mt-5 font-bold text-primary-950">{t("tabReturns")} ({returned.length})</h3>
      <div className="mt-2 space-y-2 text-sm">
        {returned.map((o) => (
          <div key={o.number} className="rounded-xl bg-red-50 px-4 py-2.5">
            <b>{o.number}</b> — {o.name} • {reasons[o.number] ?? ""}
          </div>
        ))}
        {returned.length === 0 && <p className="text-ink-500">—</p>}
      </div>
    </div>
  );
}

function locale_ph(t: (k: "notes") => string) {
  return t("notes");
}
