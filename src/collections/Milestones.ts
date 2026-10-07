import type { CollectionConfig } from "payload";

export const Milestones: CollectionConfig = {
  slug: "milestones",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["year", "title"],
    description: "Timeline entries shown on the home page.",
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  defaultSort: "year",
  fields: [
    { name: "year", type: "text", required: true },
    { name: "title", type: "text", required: true },
    { name: "description", type: "textarea", required: true },
  ],
};
