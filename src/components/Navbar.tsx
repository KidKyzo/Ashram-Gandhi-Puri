"use client";

import { useTranslation } from "@/context/LocaleContext";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { switchLanguagePath } from "@/lib/i18n";

export default function Navbar() {
  const { locale, t, href } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  return (
    <header className={`site-header ${isScrolled ? "is-scrolled" : ""}`} id="site-header">
      <div className="container site-header__inner">
        <Link className="brand" href={href("/")} aria-label={t("Ashram Gandhi Puri — home")}>
          <Image
            className="brand__logo"
            src="/assets/logo-ngo-96.webp"
            alt={t("Ashram Gandhi Puri Logo")}
            width={48}
            height={48}
            priority
          />
          <span className="brand__name">{t(" Ashram Gandhi Puri")}<small>{t("Klungkung · Bali")}</small>
          </span>
        </Link>
        <button
          className="nav-toggle"
          id="nav-toggle"
          type="button"
          aria-expanded={isOpen}
          aria-controls="main-nav"
          aria-label={t("Toggle navigation menu")}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="nav-toggle__bars" aria-hidden="true"></span>
        </button>
        <nav className={`site-nav ${isOpen ? "is-open" : ""}`} id="main-nav" aria-label={t("Primary")}>
          <ul className="nav-links">
            <li>
              <Link href={href("/")} aria-current={pathname === href("/") ? "page" : undefined}>{t(" Home ")}</Link>
            </li>
            <li>
              <Link href={href("/gallery")} aria-current={pathname === href("/gallery") ? "page" : undefined}>{t(" Gallery ")}</Link>
            </li>
            <li>
              <Link href={href("/volunteer")} aria-current={pathname === href("/volunteer") ? "page" : undefined}>{t(" Volunteer ")}</Link>
            </li>
            <li className="language-switcher" aria-label={locale === "id" ? "Bahasa" : "Language"}>
              {(["en", "id"] as const).map((language) => (
                <a key={language} href={switchLanguagePath(pathname, language)}
                  hrefLang={language} lang={language} aria-current={locale === language ? "true" : undefined}
                  onClick={(event) => { event.currentTarget.href += window.location.search + window.location.hash; }}>
                  {language === "en" ? "EN" : "ID"}
                </a>
              ))}
            </li>
            <li className="nav-cta">
              <Link className="btn btn-primary btn-sm" href={href("/donation")}>{t(" Donate ")}</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
