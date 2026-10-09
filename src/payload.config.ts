import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";
import sharp from "sharp";
import { resolvePayloadSecret } from "./lib/cms-secret";

import { GalleryItems } from "./collections/GalleryItems";
import { Media } from "./collections/Media";
import { Milestones } from "./collections/Milestones";
import { Users } from "./collections/Users";
import { SiteSettings } from "./globals/SiteSettings";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const dbUri = process.env.DATABASE_URI || "file:./data/payload.db";
const isPostgres = dbUri.startsWith("postgres://") || dbUri.startsWith("postgresql://");

const s3Bucket =
  process.env.S3_BUCKET ||
  process.env.BUCKET_NAME ||
  process.env.R2_BUCKET;

const rawEndpoint =
  process.env.S3_ENDPOINT ||
  process.env.AWS_ENDPOINT_URL_S3 ||
  process.env.AWS_ENDPOINT ||
  process.env.R2_ENDPOINT;

const s3Endpoint = rawEndpoint
  ? rawEndpoint.startsWith("http://") || rawEndpoint.startsWith("https://")
    ? rawEndpoint
    : `https://${rawEndpoint}`
  : undefined;

const s3AccessKeyId =
  process.env.S3_ACCESS_KEY_ID ||
  process.env.AWS_ACCESS_KEY_ID ||
  process.env.R2_ACCESS_KEY_ID ||
  "";

const s3SecretAccessKey =
  process.env.S3_SECRET_ACCESS_KEY ||
  process.env.AWS_SECRET_ACCESS_KEY ||
  process.env.R2_SECRET_ACCESS_KEY ||
  "";

const s3Region =
  process.env.S3_REGION ||
  process.env.AWS_REGION ||
  "auto";

const s3PublicUrl = process.env.S3_PUBLIC_URL || process.env.R2_PUBLIC_URL;

const payloadSecret = resolvePayloadSecret(process.env.PAYLOAD_SECRET, process.env.NODE_ENV === "production");

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: " — Ashram Gandhi Puri CMS" },
  },
  collections: [Users, Media, Milestones, GalleryItems],
  globals: [SiteSettings],
  localization: {
    locales: [{ label: "English", code: "en" }, { label: "Bahasa Indonesia", code: "id" }],
    defaultLocale: "en",
    fallback: true,
  },
  editor: lexicalEditor(),
  secret: payloadSecret,
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: isPostgres
    ? postgresAdapter({
        push: false,
        migrationDir: path.resolve(dirname, "migrations/postgres"),
        pool: {
          connectionString: dbUri,
        },
      })
    : sqliteAdapter({
        push: false,
        migrationDir: path.resolve(dirname, "migrations/sqlite"),
        client: { url: dbUri },
      }),
  plugins: [
    ...(s3Bucket
      ? [
          s3Storage({
            collections: {
              media: s3PublicUrl
                ? {
                    generateFileURL: ({ filename, prefix }) => {
                      const cleanBase = s3PublicUrl.replace(/\/$/, "");
                      const pathPrefix = prefix ? `${prefix.replace(/^\/|\/$/g, "")}/` : "";
                      return `${cleanBase}/${pathPrefix}${filename}`;
                    },
                  }
                : true,
            },
            bucket: s3Bucket,
            config: {
              endpoint: s3Endpoint,
              credentials: {
                accessKeyId: s3AccessKeyId,
                secretAccessKey: s3SecretAccessKey,
              },
              region: s3Region,
              forcePathStyle: true,
            },
          }),
        ]
      : []),
  ],
  sharp,
});
