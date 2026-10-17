"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Banknote,
  BookOpen,
  CircleHelp,
  Gift,
  Heart,
  LayoutDashboard,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useSettings } from "@/lib/settings";

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function WhatsappIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.5 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.11 3.22 5.1 4.51.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 9.88 9.89c0 5.45-4.44 9.88-9.89 9.88m8.42-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.9 11.9 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.16-3.47-8.41" />
    </svg>
  );
}

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export default function Footer() {
  const { t } = useI18n();
  const { phone, phoneDisplay, whatsapp, instagram, facebook } = useSettings();
  const [year, setYear] = useState(2026);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  return (
    <footer className="print-hidden mt-16 bg-primary-950 text-cream-100">
      {/* trust strip */}
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 md:grid-cols-4">
          {[
            { icon: Truck, ar: "توصيل لجميع المدن", fr: "Livraison partout", en: "Delivery everywhere" },
            { icon: Banknote, ar: "الدفع عند الاستلام", fr: "Paiement à la livraison", en: "Cash on delivery" },
            { icon: PackageCheck, ar: "تغليف آمن فاخر", fr: "Emballage soigné", en: "Safe premium packing" },
            { icon: ShieldCheck, ar: "طبعات أصلية محققة", fr: "Éditions authentiques", en: "Authentic editions" },
          ].map((f, i) => (
            <TrustItem key={i} {...f} />
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="مكتبة يُسر"
              width={56}
              height={56}
              className="h-14 w-14 rounded-full border-2 border-gold-500 bg-white object-cover"
            />
            <div>
              <p className="font-display text-2xl font-bold">مكتبة يُسر</p>
              <p className="text-xs text-gold-300">للكتب الشرعية</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-cream-100/80">{t("footerAbout")}</p>
          <div className="mt-4 flex gap-2">
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="rounded-full bg-white/10 p-2.5 text-cream-100 transition hover:bg-gold-500 hover:text-primary-950"
            >
              <WhatsappIcon />
            </a>
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="rounded-full bg-white/10 p-2.5 text-cream-100 transition hover:bg-gold-500 hover:text-primary-950"
            >
              <InstagramIcon />
            </a>
            <a
              href={facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="rounded-full bg-white/10 p-2.5 text-cream-100 transition hover:bg-gold-500 hover:text-primary-950"
            >
              <FacebookIcon />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-gold-300">{t("footerShop")}</h4>
          <ul className="space-y-2.5 text-sm text-cream-100/80">
            <li><Link href="/books" className="hover:text-gold-300">{t("navBooks")}</Link></li>
            <li><Link href="/bundles" className="hover:text-gold-300">{t("navBundles")}</Link></li>
            <li><Link href="/authors" className="hover:text-gold-300">{t("navAuthors")}</Link></li>
            <li><Link href="/wishlist" className="flex items-center gap-1.5 hover:text-gold-300"><Heart size={13} />{t("wishlist")}</Link></li>
            <li><Link href="/tracking" className="hover:text-gold-300">{t("navTracking")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-gold-300">{t("footerHelp")}</h4>
          <ul className="space-y-2.5 text-sm text-cream-100/80">
            <li><Link href="/about" className="flex items-center gap-1.5 hover:text-gold-300"><BookOpen size={13} />{t("linkAbout")}</Link></li>
            <li><Link href="/faq" className="flex items-center gap-1.5 hover:text-gold-300"><CircleHelp size={13} />{t("navFaq")}</Link></li>
            <li><Link href="/terms" className="hover:text-gold-300">{t("linkTerms")}</Link></li>
            <li><Link href="/delivery" className="flex items-center gap-1.5 hover:text-gold-300"><Truck size={13} />{t("linkDelivery")}</Link></li>
            <li><Link href="/privacy" className="hover:text-gold-300">{t("linkPrivacy")}</Link></li>
            <li><Link href="/bundles" className="flex items-center gap-1.5 hover:text-gold-300"><Gift size={13} />{t("bundleTitle")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-gold-300">{t("footerContact")}</h4>
          <ul className="space-y-2.5 text-sm text-cream-100/80">
            <li>
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-gold-300">
                <Phone size={14} className="text-gold-400" /> <bdi>{phoneDisplay}</bdi>
              </a>
            </li>
            <li className="flex items-center gap-2"><Mail size={14} className="text-gold-400" /> contact@yusr.books</li>
            <li className="flex items-center gap-2"><MapPin size={14} className="text-gold-400" /> المغرب — توصيل لجميع المدن</li>
            <li>
              <Link href="/admin" className="flex items-center gap-2 text-gold-300/80 hover:text-gold-300">
                <LayoutDashboard size={14} /> {t("adminLogin")}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-center text-[13px] text-cream-100/70 md:flex-row">
          <p>© {year} مكتبة يُسر — {t("rights")}</p>
          <p>
            <a
              href="https://www.instagram.com/abdelkader_haith/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gold-300 hover:text-gold-200"
            >
              designed by K.Haithem
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function TrustItem({
  icon: Icon,
  ar,
  fr,
  en,
}: {
  icon: typeof Truck;
  ar: string;
  fr: string;
  en: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="rounded-xl bg-gold-500/15 p-2.5 text-gold-300">
        <Icon size={20} />
      </span>
      <TrustLabel ar={ar} fr={fr} en={en} />
    </div>
  );
}

function TrustLabel({ ar, fr, en }: { ar: string; fr: string; en: string }) {
  const { locale } = useI18n();
  return (
    <span className="text-sm font-bold">
      {locale === "ar" ? ar : locale === "fr" ? fr : en}
    </span>
  );
}
