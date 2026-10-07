import type { CollectionConfig } from "payload";

export const GalleryItems: CollectionConfig = {
  slug: "gallery-items",
  labels: { singular: "Gallery Item", plural: "Gallery Items" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "date"],
    description: "Activities shown on the Gallery page.",
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
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
