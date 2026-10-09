import type { CollectionConfig } from "payload";
import { adminOnly, staffOnly, publishedOrStaff } from "../lib/cms-access";

export const GalleryItems: CollectionConfig = {
  slug: "gallery-items",
  labels: { singular: "Gallery Item", plural: "Gallery Items" },
  versions: { drafts: { autosave: { interval: 1000 } }, maxPerDoc: 30 },
  admin: {
    group: "Website content",
    useAsTitle: "title",
    defaultColumns: ["title", "date"],
    description: "Activities shown on the Gallery page.",
  },
  access: {
    read: publishedOrStaff,
    create: staffOnly,
    update: staffOnly,
    delete: adminOnly,
  },
  defaultSort: "-date",
  fields: [
    { name: "title", type: "text", localized: true, required: true },
    { name: "image", type: "upload", relationTo: "media", required: true },
    {
      name: "date",
      type: "text",
      required: true,
      validate: (v: string | null | undefined) =>
        /^\d{4}-(0[1-9]|1[0-2])$/.test(v ?? "") || "Use the format YYYY-MM, e.g. 2026-04",
      admin: { description: "Format YYYY-MM, e.g. 2026-04" },
    },
    { name: "description", type: "textarea", localized: true, required: true },
    {
      name: "source",
      type: "text",
      required: true,
      validate: (v: string | null | undefined) => {
        if (!v) return "Link source is required.";
        try {
          const parsed = new URL(v);
          if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
            return "URL must begin with http:// or https://";
          }
          return true;
        } catch {
          return "Please enter a valid URL (e.g. https://instagram.com/p/...)";
        }
      },
      admin: { description: "Link to the full story (must start with https:// or http://)." },
    },
  ],
};
