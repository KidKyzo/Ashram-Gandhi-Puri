/**
 * Content access layer.
 *
 * Pages must read content ONLY through these functions. Data comes from the
 * Payload CMS (admin at /admin) via the Local API.
 */
import config from "@payload-config";
import { getPayload } from "payload";

import type { Media } from "@/payload-types";
import type { GalleryItem, Milestone, SiteSettingsData } from "@/types/content";
import { galleryData } from "@/content/gallery";
import { milestonesData } from "@/content/milestones";
import { indonesianSettings, indonesianMilestones, indonesianGallery } from "@/content/indonesian";
import { formatMonth, type Locale } from "./i18n";
import { cache } from "react";

export const DEFAULT_SITE_SETTINGS: SiteSettingsData = {
  siteTitle: "Ashram Gandhi Puri — Spiritual Education, Yoga & Community Service in Bali",
  siteDescription:
    "Since 1997, Ashram Gandhi Puri in Klungkung, Bali has nurtured young people through spiritual education, yoga, organic farming and service in the spirit of Mahatma Gandhi. Donate or volunteer today.",
  contactEmail: "ashramgandhipuriorg@gmail.com",
  address: "Ashram Gandhi Puri Sevagram\nJalan Raya Gunaksa 99, Klungkung, Indonesia",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Ashram+Gandhi+Puri+Sevagram",
  facebookUrl: "https://www.facebook.com/profile.php?id=100078784072776",
  instagramUrl: "https://www.instagram.com/ashramgandhipuri/",
  heroEyebrow: "Klungkung, Bali · Since 1997",
  heroTitle: "Soul by Soul, We Build a Peaceful World",
  heroSubtitle:
    "Ashram Gandhi Puri nurtures young people through spiritual education, yoga and service — carrying forward the ideals of Mahatma Gandhi for a kinder community.",
  heroFact1: "Sevagram, Klungkung",
  heroFact2: "Serving since 1997",
  heroFact3: "Open to every volunteer",
  founderEyebrow: "The Founder",
  founderName: "Ida Rsi Putra Manuaba",
  founderBio:
    "Ida Rsi Putra Manuaba is a Hindu cleric, social activist, and founder of Ashram Gandhi Puri in Klungkung, Bali. He is widely known for his dedication in the fields of education, yoga, as well as humanitarian and environmental advocacy.",
  founderAwards: [
    { award: "Jamnalal Bajaj Award · 2011" },
    { award: "Padma Shri · 2020" },
  ],
  bankName: "Bank Mandiri",
  accountNumber: "1450018046181",
  accountName: "Yayasan Ashram Gandhi Puri",
  donationSubtitle:
    "By donating, you also join the Japa Malamitra philanthropy network that cares about humanity and peace.",
};

export function getDefaultSettings(locale: Locale): SiteSettingsData {
  return locale === "id" ? { ...DEFAULT_SITE_SETTINGS, ...indonesianSettings } : DEFAULT_SITE_SETTINGS;
}

export function getDefaultGallery(locale: Locale): GalleryItem[] {
  return galleryData.map((item) => ({ ...item,
    ...(locale === "id" ? indonesianGallery[item.id] : {}),
    date_display: formatMonth(item.date, locale),
  }));
}

export const getMilestones = cache(async (locale: Locale = "en"): Promise<Milestone[]> => {
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "milestones",
      locale, fallbackLocale: "en", draft: false, overrideAccess: false,
      sort: "year",
      limit: 100,
      pagination: false,
    });
    return docs.map(({ year, title, description }) => ({ year, title, description }));
  } catch (err) {
    console.error("Failed to load milestones from CMS, falling back to static data:", err);
    return locale === "id" ? indonesianMilestones : milestonesData;
  }
});

export const getGalleryItems = cache(async (locale: Locale = "en"): Promise<GalleryItem[]> => {
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "gallery-items",
      locale, fallbackLocale: "en", draft: false, overrideAccess: false,
      sort: "-date",
      depth: 1,
      limit: 500,
      pagination: false,
    });
    return docs.map((doc) => {
      let imageUrl = "";
      if (typeof doc.image === "object" && doc.image) {
        imageUrl = (doc.image as Media).url ?? "";
      } else if (typeof doc.image === "string") {
        imageUrl = doc.image;
      }

      imageUrl = (imageUrl || "").trim();

      if (!imageUrl) {
        imageUrl = "/assets/activity-gallery-1.jpg";
      }

      const dateStr = doc.date || "";
      return {
        id: String(doc.id),
        image: imageUrl,
        alt: typeof doc.image === "object" && doc.image ? doc.image.alt : doc.title,
        title: doc.title,
        date: dateStr,
        date_display: formatMonth(dateStr, locale),
        description: doc.description,
        source: doc.source,
      };
    });
  } catch (err) {
    console.error("Failed to load gallery items from CMS, falling back to static data:", err);
    return getDefaultGallery(locale);
  }
});

export const getSiteSettings = cache(async (locale: Locale = "en"): Promise<SiteSettingsData> => {
  const defaults = getDefaultSettings(locale);
  try {
    const payload = await getPayload({ config });
    const settings = (await payload.findGlobal({
      slug: "site-settings",
      locale, fallbackLocale: "en", draft: false, overrideAccess: false,
    })) as Partial<SiteSettingsData> | null;

    if (!settings) {
      return defaults;
    }

    return {
      siteTitle: settings.siteTitle ?? defaults.siteTitle,
      siteDescription: settings.siteDescription ?? defaults.siteDescription,
      contactEmail: settings.contactEmail ?? defaults.contactEmail,
      address: settings.address ?? defaults.address,
      googleMapsUrl: settings.googleMapsUrl ?? defaults.googleMapsUrl,
      facebookUrl: settings.facebookUrl ?? defaults.facebookUrl,
      instagramUrl: settings.instagramUrl ?? defaults.instagramUrl,
      heroEyebrow: settings.heroEyebrow ?? defaults.heroEyebrow,
      heroTitle: settings.heroTitle ?? defaults.heroTitle,
      heroSubtitle: settings.heroSubtitle ?? defaults.heroSubtitle,
      heroFact1: settings.heroFact1 ?? defaults.heroFact1,
      heroFact2: settings.heroFact2 ?? defaults.heroFact2,
      heroFact3: settings.heroFact3 ?? defaults.heroFact3,
      founderEyebrow: settings.founderEyebrow ?? defaults.founderEyebrow,
      founderName: settings.founderName ?? defaults.founderName,
      founderBio: settings.founderBio ?? defaults.founderBio,
      founderAwards:
        Array.isArray(settings.founderAwards) && settings.founderAwards.length > 0
          ? settings.founderAwards
          : defaults.founderAwards,
      bankName: settings.bankName ?? defaults.bankName,
      accountNumber: settings.accountNumber ?? defaults.accountNumber,
      accountName: settings.accountName ?? defaults.accountName,
      donationSubtitle: settings.donationSubtitle ?? defaults.donationSubtitle,
    };
  } catch (err) {
    console.error("Failed to load site settings from CMS:", err);
    return defaults;
  }
});
