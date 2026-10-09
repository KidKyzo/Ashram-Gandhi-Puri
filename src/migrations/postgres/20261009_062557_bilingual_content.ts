import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`CREATE TEMP TABLE "cms_legacy_media" AS SELECT * FROM "media";`);
  await db.execute(sql`CREATE TEMP TABLE "cms_legacy_milestones" AS SELECT * FROM "milestones";`);
  await db.execute(sql`CREATE TEMP TABLE "cms_legacy_gallery_items" AS SELECT * FROM "gallery_items";`);
  await db.execute(sql`CREATE TEMP TABLE "cms_legacy_site_settings" AS SELECT * FROM "site_settings";`);
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'id');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_milestones_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__milestones_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__milestones_v_published_locale" AS ENUM('en', 'id');
  CREATE TYPE "public"."enum_gallery_items_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__gallery_items_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__gallery_items_v_published_locale" AS ENUM('en', 'id');
  CREATE TYPE "public"."enum_site_settings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_settings_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_settings_v_published_locale" AS ENUM('en', 'id');
  CREATE TABLE "media_locales" (
	"alt" varchar NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" integer NOT NULL
  );

  CREATE TABLE "milestones_locales" (
	"title" varchar,
	"description" varchar,
	"id" serial PRIMARY KEY NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" integer NOT NULL
  );

  CREATE TABLE "_milestones_v" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"version_year" varchar,
	"version_updated_at" timestamp(3) with time zone,
	"version_created_at" timestamp(3) with time zone,
	"version__status" "enum__milestones_v_version_status" DEFAULT 'draft',
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"snapshot" boolean,
	"published_locale" "enum__milestones_v_published_locale",
	"latest" boolean,
	"autosave" boolean
  );

  CREATE TABLE "_milestones_v_locales" (
	"version_title" varchar,
	"version_description" varchar,
	"id" serial PRIMARY KEY NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" integer NOT NULL
  );

  CREATE TABLE "gallery_items_locales" (
	"title" varchar,
	"description" varchar,
	"id" serial PRIMARY KEY NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" integer NOT NULL
  );

  CREATE TABLE "_gallery_items_v" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"version_image_id" integer,
	"version_date" varchar,
	"version_source" varchar,
	"version_updated_at" timestamp(3) with time zone,
	"version_created_at" timestamp(3) with time zone,
	"version__status" "enum__gallery_items_v_version_status" DEFAULT 'draft',
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"snapshot" boolean,
	"published_locale" "enum__gallery_items_v_published_locale",
	"latest" boolean,
	"autosave" boolean
  );

  CREATE TABLE "_gallery_items_v_locales" (
	"version_title" varchar,
	"version_description" varchar,
	"id" serial PRIMARY KEY NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" integer NOT NULL
  );

  CREATE TABLE "site_settings_locales" (
	"site_title" varchar DEFAULT 'Ashram Gandhi Puri — Spiritual Education, Yoga & Community Service in Bali',
	"site_description" varchar DEFAULT 'Since 1997, Ashram Gandhi Puri in Klungkung, Bali has nurtured young people through spiritual education, yoga, organic farming and service in the spirit of Mahatma Gandhi. Donate or volunteer today.',
	"hero_eyebrow" varchar DEFAULT 'Klungkung, Bali · Since 1997',
	"hero_title" varchar DEFAULT 'Soul by Soul, We Build a Peaceful World',
	"hero_subtitle" varchar DEFAULT 'Ashram Gandhi Puri nurtures young people through spiritual education, yoga and service — carrying forward the ideals of Mahatma Gandhi for a kinder community.',
	"hero_fact1" varchar DEFAULT 'Sevagram, Klungkung',
	"hero_fact2" varchar DEFAULT 'Serving since 1997',
	"hero_fact3" varchar DEFAULT 'Open to every volunteer',
	"founder_eyebrow" varchar DEFAULT 'The Founder',
	"founder_bio" varchar DEFAULT 'Ida Rsi Putra Manuaba is a Hindu cleric, social activist, and founder of Ashram Gandhi Puri in Klungkung, Bali. He is widely known for his dedication in the fields of education, yoga, as well as humanitarian and environmental advocacy.',
	"donation_subtitle" varchar DEFAULT 'By donating, you also join the Japa Malamitra philanthropy network that cares about humanity and peace.',
	"id" serial PRIMARY KEY NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" integer NOT NULL
  );

  CREATE TABLE "_site_settings_v_version_founder_awards" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"award" varchar,
	"_uuid" varchar
  );

  CREATE TABLE "_site_settings_v" (
	"id" serial PRIMARY KEY NOT NULL,
	"version_contact_email" varchar DEFAULT 'ashramgandhipuriorg@gmail.com',
	"version_address" varchar DEFAULT 'Ashram Gandhi Puri Sevagram
  Jalan Raya Gunaksa 99, Klungkung, Indonesia',
	"version_google_maps_url" varchar DEFAULT 'https://www.google.com/maps/search/?api=1&query=Ashram+Gandhi+Puri+Sevagram',
	"version_facebook_url" varchar DEFAULT 'https://www.facebook.com/profile.php?id=100078784072776',
	"version_instagram_url" varchar DEFAULT 'https://www.instagram.com/ashramgandhipuri/',
	"version_founder_name" varchar DEFAULT 'Ida Rsi Putra Manuaba',
	"version_bank_name" varchar DEFAULT 'Bank Mandiri',
	"version_account_number" varchar DEFAULT '1450018046181',
	"version_account_name" varchar DEFAULT 'Yayasan Ashram Gandhi Puri',
	"version__status" "enum__site_settings_v_version_status" DEFAULT 'draft',
	"version_updated_at" timestamp(3) with time zone,
	"version_created_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"snapshot" boolean,
	"published_locale" "enum__site_settings_v_published_locale",
	"latest" boolean,
	"autosave" boolean
  );

  CREATE TABLE "_site_settings_v_locales" (
	"version_site_title" varchar DEFAULT 'Ashram Gandhi Puri — Spiritual Education, Yoga & Community Service in Bali',
	"version_site_description" varchar DEFAULT 'Since 1997, Ashram Gandhi Puri in Klungkung, Bali has nurtured young people through spiritual education, yoga, organic farming and service in the spirit of Mahatma Gandhi. Donate or volunteer today.',
	"version_hero_eyebrow" varchar DEFAULT 'Klungkung, Bali · Since 1997',
	"version_hero_title" varchar DEFAULT 'Soul by Soul, We Build a Peaceful World',
	"version_hero_subtitle" varchar DEFAULT 'Ashram Gandhi Puri nurtures young people through spiritual education, yoga and service — carrying forward the ideals of Mahatma Gandhi for a kinder community.',
	"version_hero_fact1" varchar DEFAULT 'Sevagram, Klungkung',
	"version_hero_fact2" varchar DEFAULT 'Serving since 1997',
	"version_hero_fact3" varchar DEFAULT 'Open to every volunteer',
	"version_founder_eyebrow" varchar DEFAULT 'The Founder',
	"version_founder_bio" varchar DEFAULT 'Ida Rsi Putra Manuaba is a Hindu cleric, social activist, and founder of Ashram Gandhi Puri in Klungkung, Bali. He is widely known for his dedication in the fields of education, yoga, as well as humanitarian and environmental advocacy.',
	"version_donation_subtitle" varchar DEFAULT 'By donating, you also join the Japa Malamitra philanthropy network that cares about humanity and peace.',
	"id" serial PRIMARY KEY NOT NULL,
	"_locale" "_locales" NOT NULL,
	"_parent_id" integer NOT NULL
  );

  ALTER TABLE "milestones" ALTER COLUMN "year" DROP NOT NULL;
  ALTER TABLE "gallery_items" ALTER COLUMN "image_id" DROP NOT NULL;
  ALTER TABLE "gallery_items" ALTER COLUMN "date" DROP NOT NULL;
  ALTER TABLE "gallery_items" ALTER COLUMN "source" DROP NOT NULL;
  ALTER TABLE "site_settings_founder_awards" ALTER COLUMN "award" DROP NOT NULL;
  ALTER TABLE "users" ADD COLUMN "role" "enum_users_role" DEFAULT 'editor' NOT NULL;
  ALTER TABLE "milestones" ADD COLUMN "_status" "enum_milestones_status" DEFAULT 'draft';
  ALTER TABLE "gallery_items" ADD COLUMN "_status" "enum_gallery_items_status" DEFAULT 'draft';
  ALTER TABLE "site_settings" ADD COLUMN "_status" "enum_site_settings_status" DEFAULT 'draft';
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "milestones_locales" ADD CONSTRAINT "milestones_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."milestones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_milestones_v" ADD CONSTRAINT "_milestones_v_parent_id_milestones_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."milestones"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_milestones_v_locales" ADD CONSTRAINT "_milestones_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_milestones_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "gallery_items_locales" ADD CONSTRAINT "gallery_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."gallery_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_gallery_items_v" ADD CONSTRAINT "_gallery_items_v_parent_id_gallery_items_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."gallery_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_gallery_items_v" ADD CONSTRAINT "_gallery_items_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_gallery_items_v_locales" ADD CONSTRAINT "_gallery_items_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_gallery_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_founder_awards" ADD CONSTRAINT "_site_settings_v_version_founder_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_locales" ADD CONSTRAINT "_site_settings_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "milestones_locales_locale_parent_id_unique" ON "milestones_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_milestones_v_parent_idx" ON "_milestones_v" USING btree ("parent_id");
  CREATE INDEX "_milestones_v_version_version_updated_at_idx" ON "_milestones_v" USING btree ("version_updated_at");
  CREATE INDEX "_milestones_v_version_version_created_at_idx" ON "_milestones_v" USING btree ("version_created_at");
  CREATE INDEX "_milestones_v_version_version__status_idx" ON "_milestones_v" USING btree ("version__status");
  CREATE INDEX "_milestones_v_created_at_idx" ON "_milestones_v" USING btree ("created_at");
  CREATE INDEX "_milestones_v_updated_at_idx" ON "_milestones_v" USING btree ("updated_at");
  CREATE INDEX "_milestones_v_snapshot_idx" ON "_milestones_v" USING btree ("snapshot");
  CREATE INDEX "_milestones_v_published_locale_idx" ON "_milestones_v" USING btree ("published_locale");
  CREATE INDEX "_milestones_v_latest_idx" ON "_milestones_v" USING btree ("latest");
  CREATE INDEX "_milestones_v_autosave_idx" ON "_milestones_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_milestones_v_locales_locale_parent_id_unique" ON "_milestones_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "gallery_items_locales_locale_parent_id_unique" ON "gallery_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_gallery_items_v_parent_idx" ON "_gallery_items_v" USING btree ("parent_id");
  CREATE INDEX "_gallery_items_v_version_version_image_idx" ON "_gallery_items_v" USING btree ("version_image_id");
  CREATE INDEX "_gallery_items_v_version_version_updated_at_idx" ON "_gallery_items_v" USING btree ("version_updated_at");
  CREATE INDEX "_gallery_items_v_version_version_created_at_idx" ON "_gallery_items_v" USING btree ("version_created_at");
  CREATE INDEX "_gallery_items_v_version_version__status_idx" ON "_gallery_items_v" USING btree ("version__status");
  CREATE INDEX "_gallery_items_v_created_at_idx" ON "_gallery_items_v" USING btree ("created_at");
  CREATE INDEX "_gallery_items_v_updated_at_idx" ON "_gallery_items_v" USING btree ("updated_at");
  CREATE INDEX "_gallery_items_v_snapshot_idx" ON "_gallery_items_v" USING btree ("snapshot");
  CREATE INDEX "_gallery_items_v_published_locale_idx" ON "_gallery_items_v" USING btree ("published_locale");
  CREATE INDEX "_gallery_items_v_latest_idx" ON "_gallery_items_v" USING btree ("latest");
  CREATE INDEX "_gallery_items_v_autosave_idx" ON "_gallery_items_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_gallery_items_v_locales_locale_parent_id_unique" ON "_gallery_items_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_site_settings_v_version_founder_awards_order_idx" ON "_site_settings_v_version_founder_awards" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_founder_awards_parent_id_idx" ON "_site_settings_v_version_founder_awards" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_version__status_idx" ON "_site_settings_v" USING btree ("version__status");
  CREATE INDEX "_site_settings_v_created_at_idx" ON "_site_settings_v" USING btree ("created_at");
  CREATE INDEX "_site_settings_v_updated_at_idx" ON "_site_settings_v" USING btree ("updated_at");
  CREATE INDEX "_site_settings_v_snapshot_idx" ON "_site_settings_v" USING btree ("snapshot");
  CREATE INDEX "_site_settings_v_published_locale_idx" ON "_site_settings_v" USING btree ("published_locale");
  CREATE INDEX "_site_settings_v_latest_idx" ON "_site_settings_v" USING btree ("latest");
  CREATE INDEX "_site_settings_v_autosave_idx" ON "_site_settings_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_site_settings_v_locales_locale_parent_id_unique" ON "_site_settings_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "milestones__status_idx" ON "milestones" USING btree ("_status");
  CREATE INDEX "gallery_items__status_idx" ON "gallery_items" USING btree ("_status");
  CREATE INDEX "site_settings__status_idx" ON "site_settings" USING btree ("_status");
  ALTER TABLE "media" DROP COLUMN "alt";
  ALTER TABLE "milestones" DROP COLUMN "title";
  ALTER TABLE "milestones" DROP COLUMN "description";
  ALTER TABLE "gallery_items" DROP COLUMN "title";
  ALTER TABLE "gallery_items" DROP COLUMN "description";
  ALTER TABLE "site_settings" DROP COLUMN "site_title";
  ALTER TABLE "site_settings" DROP COLUMN "site_description";
  ALTER TABLE "site_settings" DROP COLUMN "hero_eyebrow";
  ALTER TABLE "site_settings" DROP COLUMN "hero_title";
  ALTER TABLE "site_settings" DROP COLUMN "hero_subtitle";
  ALTER TABLE "site_settings" DROP COLUMN "hero_fact1";
  ALTER TABLE "site_settings" DROP COLUMN "hero_fact2";
  ALTER TABLE "site_settings" DROP COLUMN "hero_fact3";
  ALTER TABLE "site_settings" DROP COLUMN "founder_eyebrow";
  ALTER TABLE "site_settings" DROP COLUMN "founder_bio";
  ALTER TABLE "site_settings" DROP COLUMN "donation_subtitle";`)
  await db.execute(sql`INSERT INTO "media_locales" ("_locale", "_parent_id", "alt") SELECT 'en', "id", "alt" FROM "cms_legacy_media";`);
  await db.execute(sql`INSERT INTO "milestones_locales" ("_locale", "_parent_id", "title", "description") SELECT 'en', "id", "title", "description" FROM "cms_legacy_milestones";`);
  await db.execute(sql`INSERT INTO "gallery_items_locales" ("_locale", "_parent_id", "title", "description") SELECT 'en', "id", "title", "description" FROM "cms_legacy_gallery_items";`);
  await db.execute(sql`INSERT INTO "site_settings_locales" ("_locale", "_parent_id", "site_title", "site_description", "hero_eyebrow", "hero_title", "hero_subtitle", "hero_fact1", "hero_fact2", "hero_fact3", "founder_eyebrow", "founder_bio", "donation_subtitle") SELECT 'en', "id", "site_title", "site_description", "hero_eyebrow", "hero_title", "hero_subtitle", "hero_fact1", "hero_fact2", "hero_fact3", "founder_eyebrow", "founder_bio", "donation_subtitle" FROM "cms_legacy_site_settings";`);
  await db.execute(sql`UPDATE "users" SET "role" = 'admin';`);
  await db.execute(sql`UPDATE "milestones" SET "_status" = 'published';`);
  await db.execute(sql`UPDATE "gallery_items" SET "_status" = 'published';`);
  await db.execute(sql`UPDATE "site_settings" SET "_status" = 'published';`);
  await db.execute(sql`DROP TABLE "cms_legacy_media";`);
  await db.execute(sql`DROP TABLE "cms_legacy_milestones";`);
  await db.execute(sql`DROP TABLE "cms_legacy_gallery_items";`);
  await db.execute(sql`DROP TABLE "cms_legacy_site_settings";`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`CREATE TABLE "cms_rollback_milestones_v" AS SELECT * FROM "_milestones_v";`);
  await db.execute(sql`CREATE TABLE "cms_rollback_milestones_v_locales" AS SELECT * FROM "_milestones_v_locales";`);
  await db.execute(sql`CREATE TABLE "cms_rollback_gallery_items_v" AS SELECT * FROM "_gallery_items_v";`);
  await db.execute(sql`CREATE TABLE "cms_rollback_gallery_items_v_locales" AS SELECT * FROM "_gallery_items_v_locales";`);
  await db.execute(sql`CREATE TABLE "cms_rollback_site_settings_v" AS SELECT * FROM "_site_settings_v";`);
  await db.execute(sql`CREATE TABLE "cms_rollback_site_settings_v_locales" AS SELECT * FROM "_site_settings_v_locales";`);
  await db.execute(sql`CREATE TABLE "cms_rollback_site_settings_v_version_founder_awards" AS SELECT * FROM "_site_settings_v_version_founder_awards";`);
  await db.execute(sql`CREATE TEMP TABLE "cms_english_media" AS SELECT * FROM "media_locales" WHERE "_locale" = 'en';`);
  await db.execute(sql`CREATE TABLE "cms_rollback_media_locales" AS SELECT * FROM "media_locales";`);
  await db.execute(sql`CREATE TEMP TABLE "cms_english_milestones" AS SELECT * FROM "milestones_locales" WHERE "_locale" = 'en';`);
  await db.execute(sql`CREATE TABLE "cms_rollback_milestones_locales" AS SELECT * FROM "milestones_locales";`);
  await db.execute(sql`CREATE TEMP TABLE "cms_english_gallery_items" AS SELECT * FROM "gallery_items_locales" WHERE "_locale" = 'en';`);
  await db.execute(sql`CREATE TABLE "cms_rollback_gallery_items_locales" AS SELECT * FROM "gallery_items_locales";`);
  await db.execute(sql`CREATE TEMP TABLE "cms_english_site_settings" AS SELECT * FROM "site_settings_locales" WHERE "_locale" = 'en';`);
  await db.execute(sql`CREATE TABLE "cms_rollback_site_settings_locales" AS SELECT * FROM "site_settings_locales";`);
  await db.execute(sql`
   ALTER TABLE "media_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "milestones_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_milestones_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_milestones_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "gallery_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_gallery_items_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_gallery_items_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_version_founder_awards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "milestones_locales" CASCADE;
  DROP TABLE "_milestones_v" CASCADE;
  DROP TABLE "_milestones_v_locales" CASCADE;
  DROP TABLE "gallery_items_locales" CASCADE;
  DROP TABLE "_gallery_items_v" CASCADE;
  DROP TABLE "_gallery_items_v_locales" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TABLE "_site_settings_v_version_founder_awards" CASCADE;
  DROP TABLE "_site_settings_v" CASCADE;
  DROP TABLE "_site_settings_v_locales" CASCADE;
  DROP INDEX "milestones__status_idx";
  DROP INDEX "gallery_items__status_idx";
  DROP INDEX "site_settings__status_idx";
  ALTER TABLE "milestones" ALTER COLUMN "year" SET NOT NULL;
  ALTER TABLE "gallery_items" ALTER COLUMN "image_id" SET NOT NULL;
  ALTER TABLE "gallery_items" ALTER COLUMN "date" SET NOT NULL;
  ALTER TABLE "gallery_items" ALTER COLUMN "source" SET NOT NULL;
  ALTER TABLE "site_settings_founder_awards" ALTER COLUMN "award" SET NOT NULL;
  ALTER TABLE "media" ADD COLUMN "alt" varchar;
  ALTER TABLE "milestones" ADD COLUMN "title" varchar;
  ALTER TABLE "milestones" ADD COLUMN "description" varchar;
  ALTER TABLE "gallery_items" ADD COLUMN "title" varchar;
  ALTER TABLE "gallery_items" ADD COLUMN "description" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "site_title" varchar DEFAULT 'Ashram Gandhi Puri — Spiritual Education, Yoga & Community Service in Bali';
  ALTER TABLE "site_settings" ADD COLUMN "site_description" varchar DEFAULT 'Since 1997, Ashram Gandhi Puri in Klungkung, Bali has nurtured young people through spiritual education, yoga, organic farming and service in the spirit of Mahatma Gandhi. Donate or volunteer today.';
  ALTER TABLE "site_settings" ADD COLUMN "hero_eyebrow" varchar DEFAULT 'Klungkung, Bali · Since 1997';
  ALTER TABLE "site_settings" ADD COLUMN "hero_title" varchar DEFAULT 'Soul by Soul, We Build a Peaceful World';
  ALTER TABLE "site_settings" ADD COLUMN "hero_subtitle" varchar DEFAULT 'Ashram Gandhi Puri nurtures young people through spiritual education, yoga and service — carrying forward the ideals of Mahatma Gandhi for a kinder community.';
  ALTER TABLE "site_settings" ADD COLUMN "hero_fact1" varchar DEFAULT 'Sevagram, Klungkung';
  ALTER TABLE "site_settings" ADD COLUMN "hero_fact2" varchar DEFAULT 'Serving since 1997';
  ALTER TABLE "site_settings" ADD COLUMN "hero_fact3" varchar DEFAULT 'Open to every volunteer';
  ALTER TABLE "site_settings" ADD COLUMN "founder_eyebrow" varchar DEFAULT 'The Founder';
  ALTER TABLE "site_settings" ADD COLUMN "founder_bio" varchar DEFAULT 'Ida Rsi Putra Manuaba is a Hindu cleric, social activist, and founder of Ashram Gandhi Puri in Klungkung, Bali. He is widely known for his dedication in the fields of education, yoga, as well as humanitarian and environmental advocacy.';
  ALTER TABLE "site_settings" ADD COLUMN "donation_subtitle" varchar DEFAULT 'By donating, you also join the Japa Malamitra philanthropy network that cares about humanity and peace.';
  ALTER TABLE "users" DROP COLUMN "role";
  ALTER TABLE "milestones" DROP COLUMN "_status";
  ALTER TABLE "gallery_items" DROP COLUMN "_status";
  ALTER TABLE "site_settings" DROP COLUMN "_status";
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_milestones_status";
  DROP TYPE "public"."enum__milestones_v_version_status";
  DROP TYPE "public"."enum__milestones_v_published_locale";
  DROP TYPE "public"."enum_gallery_items_status";
  DROP TYPE "public"."enum__gallery_items_v_version_status";
  DROP TYPE "public"."enum__gallery_items_v_published_locale";
  DROP TYPE "public"."enum_site_settings_status";
  DROP TYPE "public"."enum__site_settings_v_version_status";
  DROP TYPE "public"."enum__site_settings_v_published_locale";`)
  await db.execute(sql`UPDATE "media" SET "alt" = (SELECT "alt" FROM "cms_english_media" WHERE "_parent_id" = "media"."id");`);
  await db.execute(sql`DROP TABLE "cms_english_media";`);
  await db.execute(sql`UPDATE "milestones" SET "title" = (SELECT "title" FROM "cms_english_milestones" WHERE "_parent_id" = "milestones"."id"), "description" = (SELECT "description" FROM "cms_english_milestones" WHERE "_parent_id" = "milestones"."id");`);
  await db.execute(sql`DROP TABLE "cms_english_milestones";`);
  await db.execute(sql`UPDATE "gallery_items" SET "title" = (SELECT "title" FROM "cms_english_gallery_items" WHERE "_parent_id" = "gallery_items"."id"), "description" = (SELECT "description" FROM "cms_english_gallery_items" WHERE "_parent_id" = "gallery_items"."id");`);
  await db.execute(sql`DROP TABLE "cms_english_gallery_items";`);
  await db.execute(sql`UPDATE "site_settings" SET "site_title" = (SELECT "site_title" FROM "cms_english_site_settings" WHERE "_parent_id" = "site_settings"."id"), "site_description" = (SELECT "site_description" FROM "cms_english_site_settings" WHERE "_parent_id" = "site_settings"."id"), "hero_eyebrow" = (SELECT "hero_eyebrow" FROM "cms_english_site_settings" WHERE "_parent_id" = "site_settings"."id"), "hero_title" = (SELECT "hero_title" FROM "cms_english_site_settings" WHERE "_parent_id" = "site_settings"."id"), "hero_subtitle" = (SELECT "hero_subtitle" FROM "cms_english_site_settings" WHERE "_parent_id" = "site_settings"."id"), "hero_fact1" = (SELECT "hero_fact1" FROM "cms_english_site_settings" WHERE "_parent_id" = "site_settings"."id"), "hero_fact2" = (SELECT "hero_fact2" FROM "cms_english_site_settings" WHERE "_parent_id" = "site_settings"."id"), "hero_fact3" = (SELECT "hero_fact3" FROM "cms_english_site_settings" WHERE "_parent_id" = "site_settings"."id"), "founder_eyebrow" = (SELECT "founder_eyebrow" FROM "cms_english_site_settings" WHERE "_parent_id" = "site_settings"."id"), "founder_bio" = (SELECT "founder_bio" FROM "cms_english_site_settings" WHERE "_parent_id" = "site_settings"."id"), "donation_subtitle" = (SELECT "donation_subtitle" FROM "cms_english_site_settings" WHERE "_parent_id" = "site_settings"."id");`);
  await db.execute(sql`DROP TABLE "cms_english_site_settings";`);
  await db.execute(sql`ALTER TABLE "media" ALTER COLUMN "alt" SET NOT NULL;`);
  await db.execute(sql`ALTER TABLE "milestones" ALTER COLUMN "title" SET NOT NULL;`);
  await db.execute(sql`ALTER TABLE "milestones" ALTER COLUMN "description" SET NOT NULL;`);
  await db.execute(sql`ALTER TABLE "gallery_items" ALTER COLUMN "title" SET NOT NULL;`);
  await db.execute(sql`ALTER TABLE "gallery_items" ALTER COLUMN "description" SET NOT NULL;`);
}
