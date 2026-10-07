import type { CollectionConfig } from "payload";

export const Milestones: CollectionConfig = {
  slug: "milestones",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["year", "title"],
    description: "Timeline entries shown on the home page.",
  },
  access: { read: () => true },
  defaultSort: "year",
  fields: [
    { name: "year", type: "text", required: true },
    { name: "title", type: "text", required: true },
    { name: "description", type: "textarea", required: true },
  ],
};
