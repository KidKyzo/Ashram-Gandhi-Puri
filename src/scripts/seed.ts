import { getPayload } from "payload";
import config from "@payload-config";
import fs from "fs";
import path from "path";

import { galleryData } from "../content/gallery";
import { milestonesData } from "../content/milestones";
import { DEFAULT_SITE_SETTINGS, getDefaultSettings } from "../lib/content";
import { indonesianMilestones, indonesianGallery } from "../content/indonesian";

/**
 * One-time import of the original static content into the CMS.
 * Usage: npm run seed
 * Optional env: SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD (creates the first admin).
 */
async function seed() {
  const payload = await getPayload({ config });

  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (email && password) {
    const existing = await payload.find({ collection: "users", limit: 1 });
    if (existing.totalDocs === 0) {
      await payload.create({ collection: "users", data: { email, password, role: "admin" } });
      console.log(`Created admin user ${email}`);
    }
  }

  const ms = await payload.count({ collection: "milestones" });
  if (ms.totalDocs === 0) {
    for (const m of milestonesData) {
      const doc = await payload.create({ collection: "milestones", locale: "en", data: { ...m, _status: "published" } });
      const translation = indonesianMilestones.find((item) => item.year === m.year);
      if (translation) await payload.update({ collection: "milestones", id: doc.id, locale: "id", data: translation });
    }
    console.log(`Seeded ${milestonesData.length} milestones`);
  }

  const gl = await payload.count({ collection: "gallery-items" });
  if (gl.totalDocs === 0) {
    for (const g of galleryData) {
      const file = path.resolve(process.cwd(), "public", g.image.replace(/^\//, ""));
      const media = await payload.create({
        collection: "media",
        locale: "en",
        data: { alt: g.title },
        filePath: file,
      });
      const translation = indonesianGallery[g.id];
      if (translation) await payload.update({ collection: "media", id: media.id, locale: "id", data: { alt: translation.title } });
      const doc = await payload.create({
        collection: "gallery-items",
        locale: "en",
        data: {
          _status: "published",
          title: g.title,
          image: media.id,
          date: g.date,
          description: g.description,
          source: g.source,
        },
      });
      if (translation) await payload.update({ collection: "gallery-items", id: doc.id, locale: "id", data: translation });
    }
    console.log(`Seeded ${galleryData.length} gallery items`);
  }

  try {
    const existingSettings = await payload.findGlobal({ slug: "site-settings" });
    if (!existingSettings?.id) {
      await payload.updateGlobal({
        slug: "site-settings",
        locale: "en",
        data: { ...DEFAULT_SITE_SETTINGS, _status: "published" },
      });
      await payload.updateGlobal({ slug: "site-settings", locale: "id", data: { ...getDefaultSettings("id"), _status: "published" } });
      console.log("Seeded site-settings global");
    }
  } catch (err) {
    console.warn("Could not seed site-settings:", err);
  }

  if (!fs.existsSync(path.resolve(process.cwd(), "media"))) {
    console.warn("media/ folder missing; uploads may have failed");
  }
  process.exit(0);
}

try {
  await seed();
} catch (err) {
  console.error(err);
  process.exit(1);
}
