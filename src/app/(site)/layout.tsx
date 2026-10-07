import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ToastProvider } from "@/context/ToastContext";
import { getSiteSettings } from "@/lib/content";
import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-nunito",
  display: "swap",
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const viewport = {
  themeColor: "#2E1065",
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
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
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable}`}>
      <body>
        <ToastProvider>
          <a className="skip-link" href="#main">
            Skip to main content
          </a>
          <Navbar />
          <main id="main">{children}</main>
          <Footer settings={settings} />
        </ToastProvider>
      </body>
    </html>
  );
}
