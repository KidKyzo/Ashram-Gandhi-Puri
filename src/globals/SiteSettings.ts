import type { GlobalConfig } from "payload";
import { adminField, publishedOrStaff, staffOnly } from "../lib/cms-access";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Website settings",
  admin: { group: "Website content", description: "Select English or Bahasa Indonesia before editing. Save a draft, then publish when ready. Bank details are shared between languages and editable by admins only." },
  versions: { drafts: { autosave: { interval: 1000 } }, max: 30 },
  access: {
    read: publishedOrStaff,
    update: staffOnly,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "General & SEO",
          fields: [
            {
              name: "siteTitle",
              localized: true,
              label: "Site Title",
              type: "text",
              defaultValue:
                "Ashram Gandhi Puri — Spiritual Education, Yoga & Community Service in Bali",
            },
            {
              name: "siteDescription",
              localized: true,
              label: "Meta Description",
              type: "textarea",
              defaultValue:
                "Since 1997, Ashram Gandhi Puri in Klungkung, Bali has nurtured young people through spiritual education, yoga, organic farming and service in the spirit of Mahatma Gandhi. Donate or volunteer today.",
            },
            {
              name: "contactEmail",
              label: "Contact Email",
              type: "email",
              defaultValue: "ashramgandhipuriorg@gmail.com",
            },
            {
              name: "address",
              label: "Physical Address",
              type: "textarea",
              defaultValue:
                "Ashram Gandhi Puri Sevagram\nJalan Raya Gunaksa 99, Klungkung, Indonesia",
            },
            {
              name: "googleMapsUrl",
              validate: (value: string | null | undefined) => {
                if (!value) return true;
                try { return ["https:", "http:"].includes(new URL(value).protocol) || "Use an http:// or https:// URL."; }
                catch { return "Enter a valid URL."; }
              },
              label: "Google Maps URL",
              type: "text",
              defaultValue:
                "https://www.google.com/maps/search/?api=1&query=Ashram+Gandhi+Puri+Sevagram",
            },
            {
              name: "facebookUrl",
              validate: (value: string | null | undefined) => {
                if (!value) return true;
                try { return ["https:", "http:"].includes(new URL(value).protocol) || "Use an http:// or https:// URL."; }
                catch { return "Enter a valid URL."; }
              },
              label: "Facebook URL",
              type: "text",
              defaultValue: "https://www.facebook.com/profile.php?id=100078784072776",
            },
            {
              name: "instagramUrl",
              validate: (value: string | null | undefined) => {
                if (!value) return true;
                try { return ["https:", "http:"].includes(new URL(value).protocol) || "Use an http:// or https:// URL."; }
                catch { return "Enter a valid URL."; }
              },
              label: "Instagram URL",
              type: "text",
              defaultValue: "https://www.instagram.com/ashramgandhipuri/",
            },
          ],
        },
        {
          label: "Hero Section",
          fields: [
            {
              name: "heroEyebrow",
              localized: true,
              label: "Hero Eyebrow",
              type: "text",
              defaultValue: "Klungkung, Bali · Since 1997",
            },
            {
              name: "heroTitle",
              localized: true,
              label: "Hero Heading",
              type: "text",
              defaultValue: "Soul by Soul, We Build a Peaceful World",
            },
            {
              name: "heroSubtitle",
              localized: true,
              label: "Hero Lead Paragraph",
              type: "textarea",
              defaultValue:
                "Ashram Gandhi Puri nurtures young people through spiritual education, yoga and service — carrying forward the ideals of Mahatma Gandhi for a kinder community.",
            },
            {
              name: "heroFact1",
              localized: true,
              label: "Quick Fact 1",
              type: "text",
              defaultValue: "Sevagram, Klungkung",
            },
            {
              name: "heroFact2",
              localized: true,
              label: "Quick Fact 2",
              type: "text",
              defaultValue: "Serving since 1997",
            },
            {
              name: "heroFact3",
              localized: true,
              label: "Quick Fact 3",
              type: "text",
              defaultValue: "Open to every volunteer",
            },
          ],
        },
        {
          label: "Founder Section",
          fields: [
            {
              name: "founderEyebrow",
              localized: true,
              label: "Founder Eyebrow",
              type: "text",
              defaultValue: "The Founder",
            },
            {
              name: "founderName",
              label: "Founder Name",
              type: "text",
              defaultValue: "Ida Rsi Putra Manuaba",
            },
            {
              name: "founderBio",
              localized: true,
              label: "Founder Biography",
              type: "textarea",
              defaultValue:
                "Ida Rsi Putra Manuaba is a Hindu cleric, social activist, and founder of Ashram Gandhi Puri in Klungkung, Bali. He is widely known for his dedication in the fields of education, yoga, as well as humanitarian and environmental advocacy.",
            },
            {
              name: "founderAwards",
              label: "Founder Honors & Awards",
              type: "array",
              fields: [
                {
                  name: "award",
                  label: "Award / Honor",
                  type: "text",
                  required: true,
                },
              ],
              defaultValue: [
                { award: "Jamnalal Bajaj Award · 2011" },
                { award: "Padma Shri · 2020" },
              ],
            },
          ],
        },
        {
          label: "Donation Info",
          fields: [
            {
              name: "bankName",
              access: { update: adminField },
              label: "Bank Name",
              type: "text",
              defaultValue: "Bank Mandiri",
            },
            {
              name: "accountNumber",
              access: { update: adminField },
              label: "Account Number",
              type: "text",
              defaultValue: "1450018046181",
            },
            {
              name: "accountName",
              access: { update: adminField },
              label: "Account Name",
              type: "text",
              defaultValue: "Yayasan Ashram Gandhi Puri",
            },
            {
              name: "donationSubtitle",
              localized: true,
              label: "Donation Subtitle",
              type: "textarea",
              defaultValue:
                "By donating, you also join the Japa Malamitra philanthropy network that cares about humanity and peace.",
            },
          ],
        },
      ],
    },
  ],
};
