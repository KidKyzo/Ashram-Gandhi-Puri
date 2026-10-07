import type { CollectionConfig } from "payload";

export const GalleryItems: CollectionConfig = {
  slug: "gallery-items",
  labels: { singular: "Gallery Item", plural: "Gallery Items" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "date"],
    description: "Activities shown on the Gallery page.",
  },
  access: { read: () => true },
  defaultSort: "-date",
  fields: [
    { name: "title", type: "text", required: true },
    { name: "image", type: "upload", relationTo: "media", required: true },
    {
      name: "date",
      type: "text",
      required: true,
      validate: (v: string | null | undefined) =>
        /^\d{4}-\d{2}$/.test(v ?? "") || "Use the format YYYY-MM, e.g. 2026-04",
      admin: { description: "Format YYYY-MM, e.g. 2026-04" },
    },
    { name: "description", type: "textarea", required: true },
    {
      name: "source",
      type: "text",
      required: true,
      admin: { description: "Link to the full story (opens in a new tab)." },
    },
  ],
};
