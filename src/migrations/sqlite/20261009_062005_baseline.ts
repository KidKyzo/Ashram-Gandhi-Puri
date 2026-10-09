import { type MigrateUpArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const existing = await db.all(sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'users';`);
  if (existing.length > 0) return;
  await db.run(sql`CREATE TABLE \`users_sessions\` (
	\`_order\` integer NOT NULL,
	\`_parent_id\` integer NOT NULL,
	\`id\` text PRIMARY KEY NOT NULL,
	\`created_at\` text,
	\`expires_at\` text NOT NULL,
	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`email\` text NOT NULL,
	\`reset_password_token\` text,
	\`reset_password_expiration\` text,
	\`salt\` text,
	\`hash\` text,
	\`reset_password_requested_at\` text,
	\`login_attempts\` numeric DEFAULT 0,
	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`alt\` text NOT NULL,
	\`_objectkey\` text,
	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`url\` text,
	\`thumbnail_u_r_l\` text,
	\`filename\` text,
	\`mime_type\` text,
	\`filesize\` numeric,
	\`width\` numeric,
	\`height\` numeric,
	\`focal_x\` numeric,
	\`focal_y\` numeric,
	\`sizes_thumbnail_url\` text,
	\`sizes_thumbnail_width\` numeric,
	\`sizes_thumbnail_height\` numeric,
	\`sizes_thumbnail_mime_type\` text,
	\`sizes_thumbnail_filesize\` numeric,
	\`sizes_thumbnail_filename\` text,
	\`sizes_card_url\` text,
	\`sizes_card_width\` numeric,
	\`sizes_card_height\` numeric,
	\`sizes_card_mime_type\` text,
	\`sizes_card_filesize\` numeric,
	\`sizes_card_filename\` text,
	\`sizes_tablet_url\` text,
	\`sizes_tablet_width\` numeric,
	\`sizes_tablet_height\` numeric,
	\`sizes_tablet_mime_type\` text,
	\`sizes_tablet_filesize\` numeric,
	\`sizes_tablet_filename\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_thumbnail_sizes_thumbnail_filename_idx\` ON \`media\` (\`sizes_thumbnail_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_card_sizes_card_filename_idx\` ON \`media\` (\`sizes_card_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_tablet_sizes_tablet_filename_idx\` ON \`media\` (\`sizes_tablet_filename\`);`)
  await db.run(sql`CREATE TABLE \`milestones\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`year\` text NOT NULL,
	\`title\` text NOT NULL,
	\`description\` text NOT NULL,
	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`milestones_updated_at_idx\` ON \`milestones\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`milestones_created_at_idx\` ON \`milestones\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`gallery_items\` (
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
  await db.run(sql`CREATE INDEX \`gallery_items_image_idx\` ON \`gallery_items\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`gallery_items_updated_at_idx\` ON \`gallery_items\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`gallery_items_created_at_idx\` ON \`gallery_items\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`key\` text NOT NULL,
	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`global_slug\` text,
	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`order\` integer,
	\`parent_id\` integer NOT NULL,
	\`path\` text NOT NULL,
	\`users_id\` integer,
	\`media_id\` integer,
	\`milestones_id\` integer,
	\`gallery_items_id\` integer,
	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`milestones_id\`) REFERENCES \`milestones\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`gallery_items_id\`) REFERENCES \`gallery_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_milestones_id_idx\` ON \`payload_locked_documents_rels\` (\`milestones_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_gallery_items_id_idx\` ON \`payload_locked_documents_rels\` (\`gallery_items_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`key\` text,
	\`value\` text,
	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`order\` integer,
	\`parent_id\` integer NOT NULL,
	\`path\` text NOT NULL,
	\`users_id\` integer,
	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`name\` text,
	\`batch\` numeric,
	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_founder_awards\` (
	\`_order\` integer NOT NULL,
	\`_parent_id\` integer NOT NULL,
	\`id\` text PRIMARY KEY NOT NULL,
	\`award\` text NOT NULL,
	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_founder_awards_order_idx\` ON \`site_settings_founder_awards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_founder_awards_parent_id_idx\` ON \`site_settings_founder_awards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`site_title\` text DEFAULT 'Ashram Gandhi Puri — Spiritual Education, Yoga & Community Service in Bali',
	\`site_description\` text DEFAULT 'Since 1997, Ashram Gandhi Puri in Klungkung, Bali has nurtured young people through spiritual education, yoga, organic farming and service in the spirit of Mahatma Gandhi. Donate or volunteer today.',
	\`contact_email\` text DEFAULT 'ashramgandhipuriorg@gmail.com',
	\`address\` text DEFAULT 'Ashram Gandhi Puri Sevagram
  Jalan Raya Gunaksa 99, Klungkung, Indonesia',
	\`google_maps_url\` text DEFAULT 'https://www.google.com/maps/search/?api=1&query=Ashram+Gandhi+Puri+Sevagram',
	\`facebook_url\` text DEFAULT 'https://www.facebook.com/profile.php?id=100078784072776',
	\`instagram_url\` text DEFAULT 'https://www.instagram.com/ashramgandhipuri/',
	\`hero_eyebrow\` text DEFAULT 'Klungkung, Bali · Since 1997',
	\`hero_title\` text DEFAULT 'Soul by Soul, We Build a Peaceful World',
	\`hero_subtitle\` text DEFAULT 'Ashram Gandhi Puri nurtures young people through spiritual education, yoga and service — carrying forward the ideals of Mahatma Gandhi for a kinder community.',
	\`hero_fact1\` text DEFAULT 'Sevagram, Klungkung',
	\`hero_fact2\` text DEFAULT 'Serving since 1997',
	\`hero_fact3\` text DEFAULT 'Open to every volunteer',
	\`founder_eyebrow\` text DEFAULT 'The Founder',
	\`founder_name\` text DEFAULT 'Ida Rsi Putra Manuaba',
	\`founder_bio\` text DEFAULT 'Ida Rsi Putra Manuaba is a Hindu cleric, social activist, and founder of Ashram Gandhi Puri in Klungkung, Bali. He is widely known for his dedication in the fields of education, yoga, as well as humanitarian and environmental advocacy.',
	\`bank_name\` text DEFAULT 'Bank Mandiri',
	\`account_number\` text DEFAULT '1450018046181',
	\`account_name\` text DEFAULT 'Yayasan Ashram Gandhi Puri',
	\`donation_subtitle\` text DEFAULT 'By donating, you also join the Japa Malamitra philanthropy network that cares about humanity and peace.',
	\`updated_at\` text,
	\`created_at\` text
  );
  `)
}

export async function down(): Promise<void> {
  throw new Error("The baseline cannot be rolled back. Restore a verified database backup instead.");
}
