import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TEMP TABLE "cms_legacy_media" AS SELECT * FROM "media";`);
  await db.run(sql`CREATE TEMP TABLE "cms_legacy_milestones" AS SELECT * FROM "milestones";`);
  await db.run(sql`CREATE TEMP TABLE "cms_legacy_gallery_items" AS SELECT * FROM "gallery_items";`);
  await db.run(sql`CREATE TEMP TABLE "cms_legacy_site_settings" AS SELECT * FROM "site_settings";`);
  await db.run(sql`CREATE TABLE \`media_locales\` (
	\`alt\` text NOT NULL,
	\`id\` integer PRIMARY KEY NOT NULL,
	\`_locale\` text NOT NULL,
	\`_parent_id\` integer NOT NULL,
	FOREIGN KEY (\`_parent_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`media_locales_locale_parent_id_unique\` ON \`media_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`milestones_locales\` (
	\`title\` text,
	\`description\` text,
	\`id\` integer PRIMARY KEY NOT NULL,
	\`_locale\` text NOT NULL,
	\`_parent_id\` integer NOT NULL,
	FOREIGN KEY (\`_parent_id\`) REFERENCES \`milestones\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`milestones_locales_locale_parent_id_unique\` ON \`milestones_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_milestones_v\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`parent_id\` integer,
	\`version_year\` text,
	\`version_updated_at\` text,
	\`version_created_at\` text,
	\`version__status\` text DEFAULT 'draft',
	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`snapshot\` integer,
	\`published_locale\` text,
	\`latest\` integer,
	\`autosave\` integer,
	FOREIGN KEY (\`parent_id\`) REFERENCES \`milestones\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_milestones_v_parent_idx\` ON \`_milestones_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_milestones_v_version_version_updated_at_idx\` ON \`_milestones_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_milestones_v_version_version_created_at_idx\` ON \`_milestones_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_milestones_v_version_version__status_idx\` ON \`_milestones_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_milestones_v_created_at_idx\` ON \`_milestones_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_milestones_v_updated_at_idx\` ON \`_milestones_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_milestones_v_snapshot_idx\` ON \`_milestones_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_milestones_v_published_locale_idx\` ON \`_milestones_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_milestones_v_latest_idx\` ON \`_milestones_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_milestones_v_autosave_idx\` ON \`_milestones_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_milestones_v_locales\` (
	\`version_title\` text,
	\`version_description\` text,
	\`id\` integer PRIMARY KEY NOT NULL,
	\`_locale\` text NOT NULL,
	\`_parent_id\` integer NOT NULL,
	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_milestones_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_milestones_v_locales_locale_parent_id_unique\` ON \`_milestones_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`gallery_items_locales\` (
	\`title\` text,
	\`description\` text,
	\`id\` integer PRIMARY KEY NOT NULL,
	\`_locale\` text NOT NULL,
	\`_parent_id\` integer NOT NULL,
	FOREIGN KEY (\`_parent_id\`) REFERENCES \`gallery_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`gallery_items_locales_locale_parent_id_unique\` ON \`gallery_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_gallery_items_v\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`parent_id\` integer,
	\`version_image_id\` integer,
	\`version_date\` text,
	\`version_source\` text,
	\`version_updated_at\` text,
	\`version_created_at\` text,
	\`version__status\` text DEFAULT 'draft',
	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`snapshot\` integer,
	\`published_locale\` text,
	\`latest\` integer,
	\`autosave\` integer,
	FOREIGN KEY (\`parent_id\`) REFERENCES \`gallery_items\`(\`id\`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (\`version_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_gallery_items_v_parent_idx\` ON \`_gallery_items_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_gallery_items_v_version_version_image_idx\` ON \`_gallery_items_v\` (\`version_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_gallery_items_v_version_version_updated_at_idx\` ON \`_gallery_items_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_gallery_items_v_version_version_created_at_idx\` ON \`_gallery_items_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_gallery_items_v_version_version__status_idx\` ON \`_gallery_items_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_gallery_items_v_created_at_idx\` ON \`_gallery_items_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_gallery_items_v_updated_at_idx\` ON \`_gallery_items_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_gallery_items_v_snapshot_idx\` ON \`_gallery_items_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_gallery_items_v_published_locale_idx\` ON \`_gallery_items_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_gallery_items_v_latest_idx\` ON \`_gallery_items_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_gallery_items_v_autosave_idx\` ON \`_gallery_items_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_gallery_items_v_locales\` (
	\`version_title\` text,
	\`version_description\` text,
	\`id\` integer PRIMARY KEY NOT NULL,
	\`_locale\` text NOT NULL,
	\`_parent_id\` integer NOT NULL,
	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_gallery_items_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_gallery_items_v_locales_locale_parent_id_unique\` ON \`_gallery_items_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_locales\` (
	\`site_title\` text DEFAULT 'Ashram Gandhi Puri — Spiritual Education, Yoga & Community Service in Bali',
	\`site_description\` text DEFAULT 'Since 1997, Ashram Gandhi Puri in Klungkung, Bali has nurtured young people through spiritual education, yoga, organic farming and service in the spirit of Mahatma Gandhi. Donate or volunteer today.',
	\`hero_eyebrow\` text DEFAULT 'Klungkung, Bali · Since 1997',
	\`hero_title\` text DEFAULT 'Soul by Soul, We Build a Peaceful World',
	\`hero_subtitle\` text DEFAULT 'Ashram Gandhi Puri nurtures young people through spiritual education, yoga and service — carrying forward the ideals of Mahatma Gandhi for a kinder community.',
	\`hero_fact1\` text DEFAULT 'Sevagram, Klungkung',
	\`hero_fact2\` text DEFAULT 'Serving since 1997',
	\`hero_fact3\` text DEFAULT 'Open to every volunteer',
	\`founder_eyebrow\` text DEFAULT 'The Founder',
	\`founder_bio\` text DEFAULT 'Ida Rsi Putra Manuaba is a Hindu cleric, social activist, and founder of Ashram Gandhi Puri in Klungkung, Bali. He is widely known for his dedication in the fields of education, yoga, as well as humanitarian and environmental advocacy.',
	\`donation_subtitle\` text DEFAULT 'By donating, you also join the Japa Malamitra philanthropy network that cares about humanity and peace.',
	\`id\` integer PRIMARY KEY NOT NULL,
	\`_locale\` text NOT NULL,
	\`_parent_id\` integer NOT NULL,
	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`site_settings_locales_locale_parent_id_unique\` ON \`site_settings_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_version_founder_awards\` (
	\`_order\` integer NOT NULL,
	\`_parent_id\` integer NOT NULL,
	\`id\` integer PRIMARY KEY NOT NULL,
	\`award\` text,
	\`_uuid\` text,
	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_founder_awards_order_idx\` ON \`_site_settings_v_version_founder_awards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_founder_awards_parent_id_idx\` ON \`_site_settings_v_version_founder_awards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`version_contact_email\` text DEFAULT 'ashramgandhipuriorg@gmail.com',
	\`version_address\` text DEFAULT 'Ashram Gandhi Puri Sevagram
  Jalan Raya Gunaksa 99, Klungkung, Indonesia',
	\`version_google_maps_url\` text DEFAULT 'https://www.google.com/maps/search/?api=1&query=Ashram+Gandhi+Puri+Sevagram',
	\`version_facebook_url\` text DEFAULT 'https://www.facebook.com/profile.php?id=100078784072776',
	\`version_instagram_url\` text DEFAULT 'https://www.instagram.com/ashramgandhipuri/',
	\`version_founder_name\` text DEFAULT 'Ida Rsi Putra Manuaba',
	\`version_bank_name\` text DEFAULT 'Bank Mandiri',
	\`version_account_number\` text DEFAULT '1450018046181',
	\`version_account_name\` text DEFAULT 'Yayasan Ashram Gandhi Puri',
	\`version__status\` text DEFAULT 'draft',
	\`version_updated_at\` text,
	\`version_created_at\` text,
	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`snapshot\` integer,
	\`published_locale\` text,
	\`latest\` integer,
	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_version__status_idx\` ON \`_site_settings_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_created_at_idx\` ON \`_site_settings_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_updated_at_idx\` ON \`_site_settings_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_snapshot_idx\` ON \`_site_settings_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_published_locale_idx\` ON \`_site_settings_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_latest_idx\` ON \`_site_settings_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_autosave_idx\` ON \`_site_settings_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_locales\` (
	\`version_site_title\` text DEFAULT 'Ashram Gandhi Puri — Spiritual Education, Yoga & Community Service in Bali',
	\`version_site_description\` text DEFAULT 'Since 1997, Ashram Gandhi Puri in Klungkung, Bali has nurtured young people through spiritual education, yoga, organic farming and service in the spirit of Mahatma Gandhi. Donate or volunteer today.',
	\`version_hero_eyebrow\` text DEFAULT 'Klungkung, Bali · Since 1997',
	\`version_hero_title\` text DEFAULT 'Soul by Soul, We Build a Peaceful World',
	\`version_hero_subtitle\` text DEFAULT 'Ashram Gandhi Puri nurtures young people through spiritual education, yoga and service — carrying forward the ideals of Mahatma Gandhi for a kinder community.',
	\`version_hero_fact1\` text DEFAULT 'Sevagram, Klungkung',
	\`version_hero_fact2\` text DEFAULT 'Serving since 1997',
	\`version_hero_fact3\` text DEFAULT 'Open to every volunteer',
	\`version_founder_eyebrow\` text DEFAULT 'The Founder',
	\`version_founder_bio\` text DEFAULT 'Ida Rsi Putra Manuaba is a Hindu cleric, social activist, and founder of Ashram Gandhi Puri in Klungkung, Bali. He is widely known for his dedication in the fields of education, yoga, as well as humanitarian and environmental advocacy.',
	\`version_donation_subtitle\` text DEFAULT 'By donating, you also join the Japa Malamitra philanthropy network that cares about humanity and peace.',
	\`id\` integer PRIMARY KEY NOT NULL,
	\`_locale\` text NOT NULL,
	\`_parent_id\` integer NOT NULL,
	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_site_settings_v_locales_locale_parent_id_unique\` ON \`_site_settings_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_milestones\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`year\` text,
	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`INSERT INTO \`__new_milestones\`("id", "year", "updated_at", "created_at", "_status") SELECT "id", "year", "updated_at", "created_at", 'published' FROM \`milestones\`;`)
  await db.run(sql`DROP TABLE \`milestones\`;`)
  await db.run(sql`ALTER TABLE \`__new_milestones\` RENAME TO \`milestones\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`milestones_updated_at_idx\` ON \`milestones\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`milestones_created_at_idx\` ON \`milestones\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`milestones__status_idx\` ON \`milestones\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new_gallery_items\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`image_id\` integer,
	\`date\` text,
	\`source\` text,
	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`_status\` text DEFAULT 'draft',
	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_gallery_items\`("id", "image_id", "date", "source", "updated_at", "created_at", "_status") SELECT "id", "image_id", "date", "source", "updated_at", "created_at", 'published' FROM \`gallery_items\`;`)
  await db.run(sql`DROP TABLE \`gallery_items\`;`)
  await db.run(sql`ALTER TABLE \`__new_gallery_items\` RENAME TO \`gallery_items\`;`)
  await db.run(sql`CREATE INDEX \`gallery_items_image_idx\` ON \`gallery_items\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`gallery_items_updated_at_idx\` ON \`gallery_items\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`gallery_items_created_at_idx\` ON \`gallery_items\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`gallery_items__status_idx\` ON \`gallery_items\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new_site_settings_founder_awards\` (
	\`_order\` integer NOT NULL,
	\`_parent_id\` integer NOT NULL,
	\`id\` text PRIMARY KEY NOT NULL,
	\`award\` text,
	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_site_settings_founder_awards\`("_order", "_parent_id", "id", "award") SELECT "_order", "_parent_id", "id", "award" FROM \`site_settings_founder_awards\`;`)
  await db.run(sql`DROP TABLE \`site_settings_founder_awards\`;`)
  await db.run(sql`ALTER TABLE \`__new_site_settings_founder_awards\` RENAME TO \`site_settings_founder_awards\`;`)
  await db.run(sql`CREATE INDEX \`site_settings_founder_awards_order_idx\` ON \`site_settings_founder_awards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_founder_awards_parent_id_idx\` ON \`site_settings_founder_awards\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`role\` text DEFAULT 'editor' NOT NULL;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`_status\` text DEFAULT 'draft';`)
  await db.run(sql`CREATE INDEX \`site_settings__status_idx\` ON \`site_settings\` (\`_status\`);`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`site_title\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`site_description\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`hero_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`hero_title\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`hero_subtitle\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`hero_fact1\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`hero_fact2\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`hero_fact3\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`founder_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`founder_bio\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`donation_subtitle\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`alt\`;`)
  await db.run(sql`INSERT INTO "media_locales" ("_locale", "_parent_id", "alt") SELECT 'en', "id", "alt" FROM "cms_legacy_media";`);
  await db.run(sql`INSERT INTO "milestones_locales" ("_locale", "_parent_id", "title", "description") SELECT 'en', "id", "title", "description" FROM "cms_legacy_milestones";`);
  await db.run(sql`INSERT INTO "gallery_items_locales" ("_locale", "_parent_id", "title", "description") SELECT 'en', "id", "title", "description" FROM "cms_legacy_gallery_items";`);
  await db.run(sql`INSERT INTO "site_settings_locales" ("_locale", "_parent_id", "site_title", "site_description", "hero_eyebrow", "hero_title", "hero_subtitle", "hero_fact1", "hero_fact2", "hero_fact3", "founder_eyebrow", "founder_bio", "donation_subtitle") SELECT 'en', "id", "site_title", "site_description", "hero_eyebrow", "hero_title", "hero_subtitle", "hero_fact1", "hero_fact2", "hero_fact3", "founder_eyebrow", "founder_bio", "donation_subtitle" FROM "cms_legacy_site_settings";`);
  await db.run(sql`UPDATE "users" SET "role" = 'admin';`);
  await db.run(sql`UPDATE "milestones" SET "_status" = 'published';`);
  await db.run(sql`UPDATE "gallery_items" SET "_status" = 'published';`);
  await db.run(sql`UPDATE "site_settings" SET "_status" = 'published';`);
  await db.run(sql`DROP TABLE "cms_legacy_media";`);
  await db.run(sql`DROP TABLE "cms_legacy_milestones";`);
  await db.run(sql`DROP TABLE "cms_legacy_gallery_items";`);
  await db.run(sql`DROP TABLE "cms_legacy_site_settings";`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`CREATE TABLE "cms_rollback_milestones_v" AS SELECT * FROM "_milestones_v";`);
  await db.run(sql`CREATE TABLE "cms_rollback_milestones_v_locales" AS SELECT * FROM "_milestones_v_locales";`);
  await db.run(sql`CREATE TABLE "cms_rollback_gallery_items_v" AS SELECT * FROM "_gallery_items_v";`);
  await db.run(sql`CREATE TABLE "cms_rollback_gallery_items_v_locales" AS SELECT * FROM "_gallery_items_v_locales";`);
  await db.run(sql`CREATE TABLE "cms_rollback_site_settings_v" AS SELECT * FROM "_site_settings_v";`);
  await db.run(sql`CREATE TABLE "cms_rollback_site_settings_v_locales" AS SELECT * FROM "_site_settings_v_locales";`);
  await db.run(sql`CREATE TABLE "cms_rollback_site_settings_v_version_founder_awards" AS SELECT * FROM "_site_settings_v_version_founder_awards";`);
  await db.run(sql`CREATE TEMP TABLE "cms_english_media" AS SELECT * FROM "media_locales" WHERE "_locale" = 'en';`);
  await db.run(sql`CREATE TABLE "cms_rollback_media_locales" AS SELECT * FROM "media_locales";`);
  await db.run(sql`CREATE TEMP TABLE "cms_english_milestones" AS SELECT * FROM "milestones_locales" WHERE "_locale" = 'en';`);
  await db.run(sql`CREATE TABLE "cms_rollback_milestones_locales" AS SELECT * FROM "milestones_locales";`);
  await db.run(sql`CREATE TEMP TABLE "cms_english_gallery_items" AS SELECT * FROM "gallery_items_locales" WHERE "_locale" = 'en';`);
  await db.run(sql`CREATE TABLE "cms_rollback_gallery_items_locales" AS SELECT * FROM "gallery_items_locales";`);
  await db.run(sql`CREATE TEMP TABLE "cms_english_site_settings" AS SELECT * FROM "site_settings_locales" WHERE "_locale" = 'en';`);
  await db.run(sql`CREATE TABLE "cms_rollback_site_settings_locales" AS SELECT * FROM "site_settings_locales";`);
  await db.run(sql`DROP TABLE \`media_locales\`;`)
  await db.run(sql`DROP TABLE \`milestones_locales\`;`)
  await db.run(sql`DROP TABLE \`_milestones_v\`;`)
  await db.run(sql`DROP TABLE \`_milestones_v_locales\`;`)
  await db.run(sql`DROP TABLE \`gallery_items_locales\`;`)
  await db.run(sql`DROP TABLE \`_gallery_items_v\`;`)
  await db.run(sql`DROP TABLE \`_gallery_items_v_locales\`;`)
  await db.run(sql`DROP TABLE \`site_settings_locales\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v_version_founder_awards\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v_locales\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_milestones\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`year\` text NOT NULL,
	\`title\` text NOT NULL,
	\`description\` text NOT NULL,
	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`INSERT INTO \`__new_milestones\`("id", "year", "title", "description", "updated_at", "created_at") SELECT base."id", base."year", locale."title", locale."description", base."updated_at", base."created_at" FROM "milestones" base LEFT JOIN "cms_english_milestones" locale ON locale."_parent_id" = base."id";`)
  await db.run(sql`DROP TABLE \`milestones\`;`)
  await db.run(sql`ALTER TABLE \`__new_milestones\` RENAME TO \`milestones\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`milestones_updated_at_idx\` ON \`milestones\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`milestones_created_at_idx\` ON \`milestones\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_gallery_items\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`title\` text NOT NULL,
	\`image_id\` integer NOT NULL,
	\`date\` text NOT NULL,
	\`description\` text NOT NULL,
	\`source\` text NOT NULL,
	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_gallery_items\`("id", "title", "image_id", "date", "description", "source", "updated_at", "created_at") SELECT base."id", locale."title", base."image_id", base."date", locale."description", base."source", base."updated_at", base."created_at" FROM "gallery_items" base LEFT JOIN "cms_english_gallery_items" locale ON locale."_parent_id" = base."id";`)
  await db.run(sql`DROP TABLE \`gallery_items\`;`)
  await db.run(sql`ALTER TABLE \`__new_gallery_items\` RENAME TO \`gallery_items\`;`)
  await db.run(sql`CREATE INDEX \`gallery_items_image_idx\` ON \`gallery_items\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`gallery_items_updated_at_idx\` ON \`gallery_items\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`gallery_items_created_at_idx\` ON \`gallery_items\` (\`created_at\`);`)
  await db.run(sql`DROP INDEX \`site_settings__status_idx\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`site_title\` text DEFAULT 'Ashram Gandhi Puri — Spiritual Education, Yoga & Community Service in Bali';`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`site_description\` text DEFAULT 'Since 1997, Ashram Gandhi Puri in Klungkung, Bali has nurtured young people through spiritual education, yoga, organic farming and service in the spirit of Mahatma Gandhi. Donate or volunteer today.';`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`hero_eyebrow\` text DEFAULT 'Klungkung, Bali · Since 1997';`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`hero_title\` text DEFAULT 'Soul by Soul, We Build a Peaceful World';`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`hero_subtitle\` text DEFAULT 'Ashram Gandhi Puri nurtures young people through spiritual education, yoga and service — carrying forward the ideals of Mahatma Gandhi for a kinder community.';`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`hero_fact1\` text DEFAULT 'Sevagram, Klungkung';`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`hero_fact2\` text DEFAULT 'Serving since 1997';`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`hero_fact3\` text DEFAULT 'Open to every volunteer';`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`founder_eyebrow\` text DEFAULT 'The Founder';`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`founder_bio\` text DEFAULT 'Ida Rsi Putra Manuaba is a Hindu cleric, social activist, and founder of Ashram Gandhi Puri in Klungkung, Bali. He is widely known for his dedication in the fields of education, yoga, as well as humanitarian and environmental advocacy.';`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`donation_subtitle\` text DEFAULT 'By donating, you also join the Japa Malamitra philanthropy network that cares about humanity and peace.';`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`_status\`;`)
  await db.run(sql`CREATE TABLE \`__new_site_settings_founder_awards\` (
	\`_order\` integer NOT NULL,
	\`_parent_id\` integer NOT NULL,
	\`id\` text PRIMARY KEY NOT NULL,
	\`award\` text NOT NULL,
	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_site_settings_founder_awards\`("_order", "_parent_id", "id", "award") SELECT "_order", "_parent_id", "id", "award" FROM \`site_settings_founder_awards\`;`)
  await db.run(sql`DROP TABLE \`site_settings_founder_awards\`;`)
  await db.run(sql`ALTER TABLE \`__new_site_settings_founder_awards\` RENAME TO \`site_settings_founder_awards\`;`)
  await db.run(sql`CREATE INDEX \`site_settings_founder_awards_order_idx\` ON \`site_settings_founder_awards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_founder_awards_parent_id_idx\` ON \`site_settings_founder_awards\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`alt\` text DEFAULT '' NOT NULL;`)
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`role\`;`)
  await db.run(sql`UPDATE "media" SET "alt" = (SELECT "alt" FROM "cms_english_media" WHERE "_parent_id" = "media"."id");`);
  await db.run(sql`DROP TABLE "cms_english_media";`);
  await db.run(sql`UPDATE "milestones" SET "title" = (SELECT "title" FROM "cms_english_milestones" WHERE "_parent_id" = "milestones"."id"), "description" = (SELECT "description" FROM "cms_english_milestones" WHERE "_parent_id" = "milestones"."id");`);
  await db.run(sql`DROP TABLE "cms_english_milestones";`);
  await db.run(sql`UPDATE "gallery_items" SET "title" = (SELECT "title" FROM "cms_english_gallery_items" WHERE "_parent_id" = "gallery_items"."id"), "description" = (SELECT "description" FROM "cms_english_gallery_items" WHERE "_parent_id" = "gallery_items"."id");`);
  await db.run(sql`DROP TABLE "cms_english_gallery_items";`);
  await db.run(sql`UPDATE "site_settings" SET "site_title" = (SELECT "site_title" FROM "cms_english_site_settings" WHERE "_parent_id" = "site_settings"."id"), "site_description" = (SELECT "site_description" FROM "cms_english_site_settings" WHERE "_parent_id" = "site_settings"."id"), "hero_eyebrow" = (SELECT "hero_eyebrow" FROM "cms_english_site_settings" WHERE "_parent_id" = "site_settings"."id"), "hero_title" = (SELECT "hero_title" FROM "cms_english_site_settings" WHERE "_parent_id" = "site_settings"."id"), "hero_subtitle" = (SELECT "hero_subtitle" FROM "cms_english_site_settings" WHERE "_parent_id" = "site_settings"."id"), "hero_fact1" = (SELECT "hero_fact1" FROM "cms_english_site_settings" WHERE "_parent_id" = "site_settings"."id"), "hero_fact2" = (SELECT "hero_fact2" FROM "cms_english_site_settings" WHERE "_parent_id" = "site_settings"."id"), "hero_fact3" = (SELECT "hero_fact3" FROM "cms_english_site_settings" WHERE "_parent_id" = "site_settings"."id"), "founder_eyebrow" = (SELECT "founder_eyebrow" FROM "cms_english_site_settings" WHERE "_parent_id" = "site_settings"."id"), "founder_bio" = (SELECT "founder_bio" FROM "cms_english_site_settings" WHERE "_parent_id" = "site_settings"."id"), "donation_subtitle" = (SELECT "donation_subtitle" FROM "cms_english_site_settings" WHERE "_parent_id" = "site_settings"."id");`);
  await db.run(sql`DROP TABLE "cms_english_site_settings";`);
}
