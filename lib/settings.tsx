"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Locale } from "./i18n";
import { CARRIERS, deliveryFee } from "./data";

export interface CarrierKeys {
  apiKey: string;
  secret: string;
  address: string;
  enabled: boolean;
}

export type Localized = Record<Locale, string>;

export interface Faq {
  q: Localized;
  a: Localized;
}

export interface Settings {
  phone: string;
  phoneDisplay: string;
  instagram: string;
  whatsapp: string;
  facebook: string;
  announcement: Localized;
  announcement2: Localized;
  about: Localized;
  terms: Localized;
  faq: Faq[];
  deliveryOverrides: Record<string, { home: number; office: number }>;
  bundlePrices: Record<string, number>;
  carriers: string[];
  carrierKeys: Record<string, CarrierKeys>;
}

export const DEFAULT_ABOUT: Localized = {
  ar: "مكتبة يُسر — نشارك معكم رحلة تبدأ بكتاب: كتب شرعية، قصص ملهمة، تربية ووعي.\n\nرؤيتنا ورسالتنا: نسهل على طالب العلم والقارئ في كل مكان الوصول إلى الكتب الموثوقة بطبعات ممتازة، دون عناء البحث والتنقل.\n\nنعتمد على المتجر الإلكتروني والخدمة المباشرة عبر الإنترنت: تشكيلة متنوعة من الكتب، تغليف فاخر وعناية بالطلب حتى باب منزلكم، وتوصيل سريع لجميع مدن المغرب، ولأوروبا عبر التواصل معنا على واتساب.",
  fr: "Yusr Books — un voyage qui commence par un livre : livres religieux, histoires inspirantes et éducation. Notre mission : rapprocher le lecteur des livres de confiance en excellentes éditions, sans se déplacer. Commande en ligne, emballage soigné jusqu'à votre porte, livraison rapide dans toutes les villes du Maroc et vers l'Europe via WhatsApp.",
  en: "Yusr Books — a journey starting with a book: religious books, inspiring stories and education. Our mission: bring trusted books in fine editions to every reader with no hassle. Online ordering, premium packing to your doorstep, fast delivery across Morocco and to Europe via WhatsApp.",
};

export const DEFAULT_TERMS: Localized = {
  ar: "اهلا بكم في متجر مكتبة يُسر. يرجى قراءة الشروط والأحكام التالية بعناية قبل إتمام طلبك:\n\n1. طبيعة المتجر والطلب: مكتبة يُسر متجر إلكتروني يقدم خدمة بيع وتوصيل الكتب داخل المغرب، ولأوروبا عبر التواصل معنا. يتم استلام جميع الطلبات ومعالجتها عبر الموقع الإلكتروني أو صفحاتنا الرسمية (انستغرام وفيسبوك وواتساب).\n\n2. تأكيد الطلبيات: بعد إتمام نموذج الطلب على الموقع، سيتصل بك فريقنا أو تصلك رسالة لتأكيد الطلب والمعلومات (الاسم ورقم الهاتف والمدينة). يرجى الاستجابة لتأكيد الطلب حتى يتم تجهيزه وإرساله في أقرب وقت.\n\n3. التوصيل والدفع: التوصيل متوفر لجميع مدن المغرب (إلى المنزل أو إلى مكتب شركة التوصيل حسب اختيارك). الدفع يكون عند الاستلام بعد معاينة الطرد والتأكد منه. آجال التوصيل تتراوح عادة بين 24 ساعة إلى 5 أيام عمل حسب المدينة والمنطقة.\n\n4. سياسة الإرجاع والاستبدال: يحق للزبون معاينة الكتاب أو الطرد عند الاستلام. في حال وجود أي عيب مصنعي أو تلف ناتج عن الشحن، نلتزم باستبدال الكتاب مجانا أو إعادة مبلغ الكتاب. يشترط إعلامنا خلال 48 ساعة من الاستلام مع تقديم صورة أو فيديو يوضح المشكلة.\n\n5. إلغاء الطلب: يمكن للزبون إلغاء الطلب مجانا قبل خروجه مع شركة الشحن. في حال الإلغاء بعد الشحن دون سبب قاهر، يتحمل الزبون تكاليف الشحن والإرجاع.",
  fr: "Bienvenue chez Yusr Books. Librairie en ligne livrant dans toutes les villes du Maroc et vers l'Europe via WhatsApp. Toute commande est confirmee par telephone ou WhatsApp avant expedition. Livraison a domicile ou au bureau, paiement a la livraison apres verification du colis (24h a 5 jours ouvrables). Defaut d'impression ou casse transport : remplacement gratuit ou remboursement sous 48h avec photo ou video. Annulation gratuite avant expedition ; apres expedition, les frais de retour sont a la charge du client.",
  en: "Welcome to Yusr Books. An online bookstore delivering across Morocco and to Europe via WhatsApp. Every order is confirmed by phone or WhatsApp before shipping. Home or office delivery, cash on delivery after inspecting the parcel (24h to 5 working days). Printing defect or shipping damage: free replacement or refund within 48h with photo or video. Free cancellation before shipping; after shipping, return fees are the customer's responsibility.",
};

const DEFAULT_FAQ: Faq[] = [
  {
    q: { ar: "كيف أطلب؟ وهل الدفع مسبق؟", fr: "Comment commander ? Faut-il payer d'avance ?", en: "How do I order? Is prepayment needed?" },
    a: { ar: "اختر كتبك ثم املأ الاسم والهاتف والمدينة، والدفع نقدا عند الاستلام بعد معاينة الطرد.", fr: "Choisissez vos livres, indiquez nom, telephone et ville. Paiement en especes a la livraison, apres verification.", en: "Pick your books, enter name, phone and city. Pay cash on delivery after inspecting the parcel." },
  },
  {
    q: { ar: "كم تستغرق مدة التوصيل؟", fr: "Quel est le delai de livraison ?", en: "How long is delivery?" },
    a: { ar: "من 24 ساعة إلى 5 أيام عمل حسب المدينة، ويمكنك حساب السعر من حاسبة التوصيل في الموقع.", fr: "De 24h a 5 jours ouvrables selon la ville. Calculez le prix avec notre calculateur.", en: "From 24h to 5 working days depending on the city. Use our delivery calculator for the exact fee." },
  },
  {
    q: { ar: "لماذا تتصلون بي بعد الطلب؟", fr: "Pourquoi m'appelez-vous apres la commande ?", en: "Why do you call after I order?" },
    a: { ar: "للتأكيد ومنع الطلبيات الوهمية، ثم تحصل على رمز تحقق لمتابعة طلبك.", fr: "Pour confirmer et eviter les fausses commandes, puis vous recevez un code de suivi.", en: "To confirm and prevent fake orders, then you receive a verification code to track your order." },
  },
  {
    q: { ar: "هل يمكن إرجاع كتاب فيه عيب؟", fr: "Puis-je retourner un livre defectueux ?", en: "Can I return a defective book?" },
    a: { ar: "نعم، خلال 48 ساعة من الاستلام مع صورة أو فيديو، نستبدله مجانا أو نعيد المبلغ.", fr: "Oui, sous 48h avec photo ou video : remplacement gratuit ou remboursement.", en: "Yes, within 48h with a photo or video: free replacement or refund." },
  },
  {
    q: { ar: "هل لديكم محل أزوره؟", fr: "Avez-vous une boutique physique ?", en: "Do you have a physical shop?" },
    a: { ar: "لا، نحن متجر إلكتروني بالكامل: الطلب عبر الموقع والتوصيل حتى باب البيت.", fr: "Non, librairie 100% en ligne : commande sur le site, livraison jusqu'a votre porte.", en: "No, a fully online bookstore: order on the site, delivered to your door." },
  },
];

const DEFAULTS: Settings = {
  phone: "+212601730698",
  phoneDisplay: "0601 73 06 98",
  instagram: "https://www.instagram.com/yusr.books/",
  whatsapp: "https://api.whatsapp.com/send/?phone=212601730698&text&type=phone_number&app_absent=0&utm_source=ig",
  facebook: "https://www.facebook.com/Yusrbooks/?ref=PROFILE_EDIT_xav_ig_profile_page_web#",
  announcement: {
    ar: "مكتبة يُسر — كتب شرعية • قصص ملهمة • تربية ووعي",
    fr: "Yusr Books — Livres religieux • Histoires inspirantes • Éducation",
    en: "Yusr Books — Religious books • Inspiring stories • Education",
  },
  announcement2: {
    ar: "بوكس الأحلام: هدية العلم الأجمل لمن تحب",
    fr: "Dream Box : le plus beau cadeau de savoir",
    en: "Dream Box: the finest gift of knowledge",
  },
  about: DEFAULT_ABOUT,
  terms: DEFAULT_TERMS,
  faq: DEFAULT_FAQ,
  deliveryOverrides: {},
  bundlePrices: {},
  carriers: [...CARRIERS],
  carrierKeys: {
    Amana: { apiKey: "", secret: "", address: "https://www.barid.ma", enabled: true },
    "Ozone Express": { apiKey: "", secret: "", address: "", enabled: true },
    Speedaf: { apiKey: "", secret: "", address: "", enabled: true },
    EMS: { apiKey: "", secret: "", address: "", enabled: true },
  },
};

interface SettingsCtx extends Settings {
  update: (patch: Partial<Settings>) => void;
  feeFor: (code: number, type: "home" | "office") => { fee: number; days: string };
  bundlePrice: (slug: string, fallback: number) => number;
}

const Ctx = createContext<SettingsCtx | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [s, setS] = useState<Settings>(DEFAULTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("yusr-settings");
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Settings>;
        setS({ ...DEFAULTS, ...parsed });
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem("yusr-settings", JSON.stringify(s));
      } catch {}
    }
  }, [s, ready]);

  const value = useMemo<SettingsCtx>(
    () => ({
      ...s,
      update: (patch) => setS((prev) => ({ ...prev, ...patch })),
      feeFor: (code, type) => {
        const ov = s.deliveryOverrides[String(code)];
        const base = deliveryFee(code, type);
        if (ov && typeof ov[type] === "number" && ov[type] > 0)
          return { fee: ov[type], days: base.days };
        return base;
      },
      bundlePrice: (slug, fallback) => s.bundlePrices[slug] ?? fallback,
    }),
    [s]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings(): SettingsCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSettings outside provider");
  return v;
}
