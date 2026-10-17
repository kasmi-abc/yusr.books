"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { KeyRound, Mail } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function AdminLoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-3xl border border-cream-300 bg-white p-8 shadow-sm">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-800 text-gold-300">
          <KeyRound size={30} />
        </span>
        <h1 className="font-display mt-4 text-center text-2xl font-bold text-primary-950">
          {t("adminLogin")}
        </h1>
        <form
          className="mt-6 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            setError(false);
            const res = await signIn("credentials", {
              email,
              password,
              redirect: false,
            });
            setLoading(false);
            if (res?.ok) router.push("/admin");
            else setError(true);
          }}
        >
          <div className="relative">
            <Mail size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-ink-500" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("email")}
              type="email"
              dir="ltr"
              className="w-full rounded-xl border border-cream-300 bg-cream-50 py-3 pe-3 ps-9 text-sm outline-none focus:border-gold-500"
            />
          </div>
          <div className="relative">
            <KeyRound size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-ink-500" />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("password")}
              type="password"
              dir="ltr"
              className="w-full rounded-xl border border-cream-300 bg-cream-50 py-3 pe-3 ps-9 text-sm outline-none focus:border-gold-500"
            />
          </div>
          {error && (
            <p className="text-center text-sm font-bold text-red-600">
              {t("verifyBad")}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-primary-800 py-3.5 font-bold text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? "..." : t("login")}
          </button>
        </form>
      </div>
    </div>
  );
}
