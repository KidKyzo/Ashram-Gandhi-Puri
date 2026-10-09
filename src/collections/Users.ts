import type { CollectionConfig } from "payload";
import { adminField, adminOnly, adminOrSelf, isStaff } from "../lib/cms-access";

export const Users: CollectionConfig = {
  slug: "users",
  admin: { useAsTitle: "email", group: "Administration", description: "Admins manage accounts and donation settings. Editors manage website content." },
  auth: true,
  access: {
    admin: ({ req }) => isStaff(req.user),
    create: adminOnly,
    read: adminOrSelf,
    update: adminOrSelf,
    delete: adminOnly,
  },
  hooks: {
    beforeChange: [async ({ data, operation, req }) => {
      if (operation === "create") {
        const { totalDocs } = await req.payload.count({ collection: "users", overrideAccess: true, req });
        // Payload's first-user registration bypasses access. Always assign its role here.
        if (totalDocs === 0) data.role = "admin";
      }
      return data;
    }],
  },
  fields: [{
    name: "role", type: "select", required: true, defaultValue: "editor", saveToJWT: true,
    options: [{ label: "Administrator", value: "admin" }, { label: "Content editor", value: "editor" }],
    access: { create: adminField, update: adminField },
  }],
};

