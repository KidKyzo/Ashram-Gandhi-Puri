import type { CollectionConfig } from "payload";
import { adminOnly, staffOnly, publishedOrStaff } from "../lib/cms-access";

export const Milestones: CollectionConfig = {
  slug: "milestones",
  versions: { drafts: { autosave: { interval: 1000 } }, maxPerDoc: 30 },
  admin: {
    group: "Website content",
    useAsTitle: "title",
    defaultColumns: ["year", "title"],
    description: "Timeline entries shown on the home page.",
  },
  access: {
    read: publishedOrStaff,
    create: staffOnly,
    update: staffOnly,
    delete: adminOnly,
  },
  defaultSort: "year",
  fields: [
    { name: "year", type: "text", required: true, validate: (value: string | null | undefined) => /^\d{4}$/.test(value ?? "") || "Enter a four-digit year." },
    { name: "title", type: "text", localized: true, required: true },
    { name: "description", type: "textarea", localized: true, required: true },
  ],
};
