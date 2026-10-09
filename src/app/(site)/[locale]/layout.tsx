import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ToastProvider } from "@/context/ToastContext";
import { getSiteSettings } from "@/lib/content";
import { LocaleProvider } from "@/context/LocaleContext";
import { translate } from "@/lib/i18n";
import { getRequestLocale, type LocaleParams } from "@/lib/request-locale";
import type { Metadata } from "next";
import "./globals.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const viewport = {
  themeColor: "#FFFFFF",
};

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await getRequestLocale(params);
  const settings = await getSiteSettings(locale);
  return {
    metadataBase: new URL("https://ashramgandhipuri.org"),
    title: settings.siteTitle,
    description: settings.siteDescription,
    icons: {
      icon: "/assets/favicon-32.png",
      apple: "/assets/apple-touch-icon.png",
    },
    openGraph: {
      title: `${settings.heroTitle} — Ashram Gandhi Puri`,
      description: settings.siteDescription,
      images: ["/assets/hero-photo-5.jpg"],
      locale: locale === "id" ? "id_ID" : "en_GB",
      alternateLocale: locale === "id" ? "en_GB" : "id_ID",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
}> & LocaleParams) {
  const locale = await getRequestLocale(params);
  const settings = await getSiteSettings(locale);

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <body>
        <LocaleProvider locale={locale}>
          <ToastProvider>
            <a className="skip-link" href="#main">
              {translate(locale, "Skip to main content")}
            </a>
            <Navbar />
            <main id="main">{children}</main>
            <Footer settings={settings} />
          </ToastProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
