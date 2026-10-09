import type { Metadata } from "next";
import { localizedPath, translate, type Locale } from "./i18n";
import { getSiteSettings } from "./content";

export async function getPageMetadata(locale: Locale, path: string, title?: string): Promise<Metadata> {
  const settings = await getSiteSettings(locale);
  return {
    title: title ? `${translate(locale, title)} — Ashram Gandhi Puri` : settings.siteTitle,
    description: settings.siteDescription,
    alternates: {
      canonical: localizedPath(locale, path),
      languages: { en: localizedPath("en", path), id: localizedPath("id", path), "x-default": localizedPath("en", path) },
    },
  };
}
