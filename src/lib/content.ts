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

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatMonth(date?: string): string {
  if (!date || typeof date !== "string") return "";
  const [year, month] = date.split("-");
  if (!month || !year) return date;
  return `${MONTHS[Number(month) - 1] ?? month} ${year}`;
}

export async function getMilestones(): Promise<Milestone[]> {
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "milestones",
      sort: "year",
      limit: 100,
      pagination: false,
    });
    if (!docs || docs.length === 0) {
      return milestonesData;
    }
    return docs.map(({ year, title, description }) => ({ year, title, description }));
  } catch (err) {
    console.error("Failed to load milestones from CMS, falling back to static data:", err);
    return milestonesData;
  }
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "gallery-items",
      sort: "-date",
      depth: 1,
      limit: 500,
      pagination: false,
    });
    if (!docs || docs.length === 0) {
      return galleryData;
    }
    return docs.map((doc) => {
      let imageUrl = "";
      if (typeof doc.image === "object" && doc.image) {
        imageUrl = (doc.image as Media).url ?? "";
      } else if (typeof doc.image === "string") {
        imageUrl = doc.image;
      }

      if (!imageUrl) {
        imageUrl = "/assets/activity-gallery-1.jpg";
      }

      const dateStr = doc.date || "";
      return {
        id: String(doc.id),
        image: imageUrl,
        title: doc.title,
        date: dateStr,
        date_display: formatMonth(dateStr),
        description: doc.description,
        source: doc.source,
      };
    });
  } catch (err) {
    console.error("Failed to load gallery items from CMS, falling back to static data:", err);
    return galleryData;
  }
}

export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    const payload = await getPayload({ config });
    const settings = (await payload.findGlobal({
      slug: "site-settings",
    })) as Partial<SiteSettingsData> | null;

    if (!settings) {
      return DEFAULT_SITE_SETTINGS;
    }

    return {
      siteTitle: settings.siteTitle ?? DEFAULT_SITE_SETTINGS.siteTitle,
      siteDescription: settings.siteDescription ?? DEFAULT_SITE_SETTINGS.siteDescription,
      contactEmail: settings.contactEmail ?? DEFAULT_SITE_SETTINGS.contactEmail,
      address: settings.address ?? DEFAULT_SITE_SETTINGS.address,
      googleMapsUrl: settings.googleMapsUrl ?? DEFAULT_SITE_SETTINGS.googleMapsUrl,
      facebookUrl: settings.facebookUrl ?? DEFAULT_SITE_SETTINGS.facebookUrl,
      instagramUrl: settings.instagramUrl ?? DEFAULT_SITE_SETTINGS.instagramUrl,
      heroEyebrow: settings.heroEyebrow ?? DEFAULT_SITE_SETTINGS.heroEyebrow,
      heroTitle: settings.heroTitle ?? DEFAULT_SITE_SETTINGS.heroTitle,
      heroSubtitle: settings.heroSubtitle ?? DEFAULT_SITE_SETTINGS.heroSubtitle,
      heroFact1: settings.heroFact1 ?? DEFAULT_SITE_SETTINGS.heroFact1,
      heroFact2: settings.heroFact2 ?? DEFAULT_SITE_SETTINGS.heroFact2,
      heroFact3: settings.heroFact3 ?? DEFAULT_SITE_SETTINGS.heroFact3,
      founderEyebrow: settings.founderEyebrow ?? DEFAULT_SITE_SETTINGS.founderEyebrow,
      founderName: settings.founderName ?? DEFAULT_SITE_SETTINGS.founderName,
      founderBio: settings.founderBio ?? DEFAULT_SITE_SETTINGS.founderBio,
      founderAwards:
        Array.isArray(settings.founderAwards) && settings.founderAwards.length > 0
          ? settings.founderAwards
          : DEFAULT_SITE_SETTINGS.founderAwards,
      bankName: settings.bankName ?? DEFAULT_SITE_SETTINGS.bankName,
      accountNumber: settings.accountNumber ?? DEFAULT_SITE_SETTINGS.accountNumber,
      accountName: settings.accountName ?? DEFAULT_SITE_SETTINGS.accountName,
      donationSubtitle: settings.donationSubtitle ?? DEFAULT_SITE_SETTINGS.donationSubtitle,
    };
  } catch (err) {
    console.error("Failed to load site settings from CMS:", err);
    return DEFAULT_SITE_SETTINGS;
  }
}
