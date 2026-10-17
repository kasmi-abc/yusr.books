"use client";

import { useI18n } from "@/lib/i18n";

export default function PrivacyPage() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-primary-950 md:text-4xl dark:text-cream-50">
        {t("privacyTitle")}
      </h1>
      <div className="mt-6 space-y-4 rounded-3xl border border-cream-300 bg-white p-6 leading-loose text-ink-700 md:p-10">
        <p>نحترم خصوصيتكم: نجمع فقط ما يلزم لإيصال طلبكم (الاسم، الهاتف، العنوان).</p>
        <p>لا نبيع بياناتكم ولا نشاركها مع أي طرف ثالث باستثناء شركات التوصيل بقدر ما يلزم للشحن.</p>
        <p>أرقام الهواتف المسجلة للتنبيه عند التوفر تُستخدم لهذا الغرض فقط ويمكن طلب حذفها في أي وقت عبر الهاتف.</p>
        <p>بتسجيل طلبكم أنتم توافقون على الاتصال بكم هاتفياً لتأكيد الطلب وتحسين الخدمة.</p>
      </div>
    </div>
  );
}
