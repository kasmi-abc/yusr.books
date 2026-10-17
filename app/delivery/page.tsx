"use client";

import { CARRIERS, WILAYAS } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useSettings } from "@/lib/settings";
import DeliveryCalculator from "@/components/DeliveryCalculator";
import { Money } from "@/components/ui";

export default function DeliveryPage() {
  const { t, locale } = useI18n();
  const { feeFor, whatsapp } = useSettings();
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-primary-950 md:text-4xl dark:text-cream-50">
        {t("deliveryTitle")}
      </h1>
      <div className="mt-6">
        <DeliveryCalculator />
      </div>
      <div className="mt-6 rounded-3xl border border-cream-300 bg-white p-6 leading-loose text-ink-700 md:p-8">
        <h3 className="font-bold text-primary-900">شركات التوصيل المعتمدة</h3>
        <p>نتعامل مع {CARRIERS.join(" و")} حسب المدينة لضمان أسرع وأرخص توصيل. التوصيل للمكتب أرخص من التوصيل للمنزل.</p>
        <h3 className="mt-4 font-bold text-primary-900">آجال التوصيل</h3>
        <p>من يوم إلى 3 أيام لمدن الوسط والشمال، ومن 3 إلى 7 أيام للمدن البعيدة والصحراء المغربية.</p>
        <h3 className="mt-4 font-bold text-primary-900">التوصيل لأوروبا</h3>
        <p>
          نوصل الطلبات لأوروبا أيضاً — تواصلوا معنا على{" "}
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="font-bold text-primary-800 underline">
            واتساب
          </a>{" "}
          لمعرفة السعر والآجال.
        </p>
        <h3 className="mt-4 font-bold text-primary-900">جدول الأسعار (35 مدينة)</h3>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm md:grid-cols-3">
          {WILAYAS.map((w) => {
            const h = feeFor(w.code, "home").fee;
            const o = feeFor(w.code, "office").fee;
            return (
              <div key={w.code} className="flex justify-between gap-2 rounded-xl bg-cream-50 px-3 py-2">
                <span className="font-bold">{w.code} — {locale === "fr" ? w.fr : w.ar}</span>
                <span className="text-ink-500">
                  <Money value={h} /> / <Money value={o} />
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
