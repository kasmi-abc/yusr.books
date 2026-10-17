import { Cairo, Amiri } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { StoreProvider } from "@/lib/store";
import { ThemeProvider } from "@/lib/theme";
import { SettingsProvider } from "@/lib/settings";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import PageTitle from "@/components/PageTitle";
import AuthProvider from "@/components/AuthProvider";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "مكتبة يُسر للكتب الشرعية | Yusr Books",
  description:
    "مكتبة يُسر — كتب شرعية، قصص ملهمة، تربية ووعي. توصيل لجميع مدن المغرب والدفع عند الاستلام.",
  icons: { icon: "/favicon.ico", shortcut: "/favicon.ico", apple: "/logo.jpg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} ${amiri.variable} flex min-h-full flex-col antialiased`}
      >
        <AuthProvider>
          <ThemeProvider>
            <LanguageProvider>
              <SettingsProvider>
                <StoreProvider>
                  <PageTitle />
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                  <Toast />
                </StoreProvider>
              </SettingsProvider>
            </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
