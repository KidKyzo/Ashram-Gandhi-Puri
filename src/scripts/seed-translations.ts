import { getPayload } from "payload";
import config from "@payload-config";
import { galleryData } from "../content/gallery";
import { milestonesData } from "../content/milestones";
import { indonesianGallery, indonesianMilestones, indonesianSettings } from "../content/indonesian";
import { DEFAULT_SITE_SETTINGS } from "../lib/content";

// Translate only untouched original copy. Never replace staff-written translations,
// custom English content, or documents with an unpublished draft.
async function seedTranslations() {
  const payload = await getPayload({ config });
  for (const collection of ["milestones", "gallery-items"] as const) {
    const { docs } = await payload.find({ collection, locale: "en", fallbackLocale: false, limit: 0 });
    for (const doc of docs) {
      const latest = await payload.findByID({ collection, id: doc.id, locale: "en", draft: true });
      if (latest._status !== "published" || latest.updatedAt !== doc.updatedAt) continue;
      const original = collection === "milestones"
        ? milestonesData.find((item) => item.title === doc.title && item.description === doc.description)
        : galleryData.find((item) => item.title === doc.title && item.description === doc.description);
      if (!original) continue;
      const translation = "year" in original
        ? indonesianMilestones.find((item) => item.year === original.year)
        : indonesianGallery[original.id];
      if (!translation) continue;
      const current = await payload.findByID({ collection, id: doc.id, locale: "id", fallbackLocale: false });
      if (current.title || current.description) continue;
      await payload.update({ collection, id: doc.id, locale: "id", data: { title: translation.title, description: translation.description, _status: "published" } });
    }
  }

  const english = await payload.findGlobal({ slug: "site-settings", locale: "en", fallbackLocale: false });
  const latest = await payload.findGlobal({ slug: "site-settings", locale: "en", draft: true });
  const current = await payload.findGlobal({ slug: "site-settings", locale: "id", fallbackLocale: false });
  if (english.id && latest._status === "published" && latest.updatedAt === english.updatedAt) {
    const data: Record<string, string> = {};
    for (const [field, value] of Object.entries(indonesianSettings)) {
      const key = field as keyof typeof DEFAULT_SITE_SETTINGS;
      if (typeof value === "string" && !current[key] && english[key] === DEFAULT_SITE_SETTINGS[key]) data[field] = value;
    }
    if (Object.keys(data).length) await payload.updateGlobal({ slug: "site-settings", locale: "id", data: { ...data, _status: "published" } });
  }
  console.log("Original Indonesian translations added where English content was unchanged and no Indonesian content or pending draft existed.");
  await payload.destroy();
}

await seedTranslations();
