import type { CollectionConfig } from "payload";
import { adminOnly, staffOnly } from "../lib/cms-access";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
    create: staffOnly,
    update: staffOnly,
    delete: adminOnly,
  },
  admin: { group: "Website content", description: "Upload website images and add a description in each language." },
  upload: {
    staticDir: "media",
    mimeTypes: ["image/*"],
    formatOptions: {
      format: "webp",
      options: { quality: 85 },
    },
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 800,
        height: 500,
        position: "centre",
      },
      {
        name: "tablet",
        width: 1200,
        height: undefined,
        position: "centre",
      },
    ],
    adminThumbnail: "thumbnail",
  },
  fields: [
    {
      name: "alt",
      localized: true,
      type: "text",
      required: true,
      admin: { description: "Short description of the image, for accessibility." },
    },
  ],
};
