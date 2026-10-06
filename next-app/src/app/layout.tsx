import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/context/ToastContext";

export const viewport = {
  themeColor: "#2E1065",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ashramgandhipuri.org"),
  title: "Ashram Gandhi Puri — Spiritual Education, Yoga & Community Service in Bali",
  description:
    "Since 1997, Ashram Gandhi Puri in Klungkung, Bali has nurtured young people through spiritual education, yoga, organic farming and service in the spirit of Mahatma Gandhi. Donate or volunteer today.",
  icons: {
    icon: "/assets/logo-ngo-256.png",
  },
  openGraph: {
    title: "Ashram Gandhi Puri — Soul by Soul, We Build a Peaceful World",
    description: "Spiritual education, yoga and community service in Klungkung, Bali since 1997.",
    images: ["/assets/hero-photo-5.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ToastProvider>
          <a className="skip-link" href="#main">
            Skip to main content
          </a>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
