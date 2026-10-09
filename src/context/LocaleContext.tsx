"use client";

import { createContext, useContext } from "react";
import { localizedPath, translate, type Locale } from "@/lib/i18n";

const LocaleContext = createContext<Locale>("en");

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useTranslation() {
  const locale = useContext(LocaleContext);
  return { locale, t: (text: string) => translate(locale, text), href: (path: string) => localizedPath(locale, path) };
}
