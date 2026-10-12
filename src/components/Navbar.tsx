"use client";

import { useTranslation } from "@/context/LocaleContext";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { switchLanguagePath } from "@/lib/i18n";

function LanguageFlag({ language }: { language: "en" | "id" }) {
  return (
    <svg
      className="language-switcher__flag"
      viewBox="0 0 60 40"
      role="img"
      aria-label={language === "en" ? "United Kingdom flag" : "Indonesia flag"}
    >
      <defs>
        <clipPath id={`flag-${language}`}>
          <rect width="60" height="40" rx="4" />
        </clipPath>
      </defs>
      {language === "en" ? (
        <g clipPath="url(#flag-en)">
          <path fill="#012169" d="M0 0h60v40H0z" />
          <path stroke="#fff" strokeWidth="9" d="m0 0 60 40M60 0 0 40" />
          <path stroke="#c8102e" strokeWidth="4" d="m0 0 60 40M60 0 0 40" />
          <path stroke="#fff" strokeWidth="15" d="M30 0v40M0 20h60" />
          <path stroke="#c8102e" strokeWidth="8" d="M30 0v40M0 20h60" />
        </g>
      ) : (
        <g clipPath="url(#flag-id)">
          <path fill="#fff" d="M0 0h60v40H0z" />
          <path fill="#ce1126" d="M0 0h60v20H0z" />
        </g>
      )}
    </svg>
  );
}

export default function Navbar() {
  const { locale, t, href } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const languageSwitcherRef = useRef<HTMLDivElement>(null);
  const languageTriggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isLanguageOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!languageSwitcherRef.current?.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLanguageOpen(false);
        languageTriggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isLanguageOpen]);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
    setIsLanguageOpen(false);
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
            <li className="language-switcher">
              <div className="language-switcher__control" ref={languageSwitcherRef}>
                <button
                  className="language-switcher__trigger"
                  type="button"
                  aria-label={t("Select language")}
                  aria-expanded={isLanguageOpen}
                  aria-controls="language-menu"
                  onClick={() => setIsLanguageOpen((open) => !open)}
                  ref={languageTriggerRef}
                >
                  <LanguageFlag language={locale} />
                  <span>{locale.toUpperCase()}</span>
                  <svg className="language-switcher__chevron" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="m5 7.5 5 5 5-5" />
                  </svg>
                </button>
                <div
                  className="language-switcher__menu"
                  id="language-menu"
                  aria-label={t("Select language")}
                  hidden={!isLanguageOpen}
                >
                  {(["en", "id"] as const).map((language) => (
                    <a
                      className="language-switcher__option"
                      key={language}
                      href={switchLanguagePath(pathname, language)}
                      hrefLang={language}
                      lang={language}
                      aria-current={locale === language ? "true" : undefined}
                      onClick={(event) => {
                        event.currentTarget.href += window.location.search + window.location.hash;
                        setIsLanguageOpen(false);
                      }}
                    >
                      <LanguageFlag language={language} />
                      <span>{t(language === "en" ? "English" : "Bahasa Indonesia")}</span>
                      {locale === language && <span className="language-switcher__current" aria-hidden="true">✓</span>}
                    </a>
                  ))}
                </div>
              </div>
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
