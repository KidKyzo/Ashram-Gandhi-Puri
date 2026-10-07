import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";
import sharp from "sharp";

import { GalleryItems } from "./collections/GalleryItems";
import { Media } from "./collections/Media";
import { Milestones } from "./collections/Milestones";
import { Users } from "./collections/Users";
import { SiteSettings } from "./globals/SiteSettings";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const dbUri = process.env.DATABASE_URI || "file:./data/payload.db";
const isPostgres = dbUri.startsWith("postgres://") || dbUri.startsWith("postgresql://");

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: " — Ashram Gandhi Puri CMS" },
  },
  collections: [Users, Media, Milestones, GalleryItems],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: isPostgres
    ? postgresAdapter({
        pool: {
          connectionString: dbUri,
        },
      })
    : sqliteAdapter({
        client: { url: dbUri },
      }),
  plugins: [
    ...(process.env.S3_BUCKET || process.env.R2_BUCKET
      ? [
          s3Storage({
            collections: {
              media: true,
            },
            bucket: process.env.S3_BUCKET || process.env.R2_BUCKET || "",
            config: {
              endpoint: process.env.S3_ENDPOINT || process.env.R2_ENDPOINT,
              credentials: {
                accessKeyId:
                  process.env.S3_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID || "",
                secretAccessKey:
                  process.env.S3_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY || "",
              },
              region: process.env.S3_REGION || "auto",
            },
          }),
        ]
      : []),
  ],
  sharp,
});
