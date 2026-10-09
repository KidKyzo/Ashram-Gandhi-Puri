import assert from "node:assert/strict";
import { test } from "node:test";
import { DatabaseSync } from "node:sqlite";
import { SQLiteSyncDialect } from "drizzle-orm/sqlite-core";
import { adminOnly, adminOrSelf, adminField, staffOnly, publishedOrStaff } from "../src/lib/cms-access.ts";
import { resolvePayloadSecret } from "../src/lib/cms-secret.ts";
import { formatMonth, isLocale, localizedPath, switchLanguagePath, translate } from "../src/lib/i18n.ts";
import * as baseline from "../src/migrations/sqlite/20261009_062005_baseline.ts";
import * as bilingual from "../src/migrations/sqlite/20261009_062545_bilingual_content.ts";

test("editors can edit content and their own profile, but cannot manage users or bank fields", () => {
  const args = { req: { user: { id: 7, role: "editor" } } };
  assert.equal(staffOnly(args), true);
  assert.equal(adminOnly(args), false);
  assert.equal(adminField(args), false);
  assert.deepEqual(adminOrSelf(args), { id: { equals: 7 } });
  assert.equal(adminOnly({ req: { user: { id: 1, role: "admin" } } }), true);
  for (const user of [null, { id: 3 }, { id: 4, role: "visitor" }]) {
    assert.equal(staffOnly({ req: { user } }), false);
    assert.deepEqual(publishedOrStaff({ req: { user } }), { _status: { equals: "published" } });
  }
});

test("production cannot start with missing or placeholder secrets", () => {
  for (const secret of [undefined, "short", "your-payload-secret-here", "temp-payload-secret-change-in-production-env"]) {
    assert.throws(() => resolvePayloadSecret(secret, true), /PAYLOAD_SECRET/);
  }
  const secret = "a".repeat(64);
  assert.equal(resolvePayloadSecret(secret, true), secret);
  assert.notEqual(resolvePayloadSecret(undefined, false), resolvePayloadSecret(undefined, false));
});

test("language paths preserve the current page, query and fragment", () => {
  assert.equal(isLocale("id"), true);
  assert.equal(isLocale("fr"), false);
  assert.equal(localizedPath("id", "/"), "/id");
  assert.equal(switchLanguagePath("/en/gallery?q=yoga#stories", "id"), "/id/gallery?q=yoga#stories");
  assert.equal(switchLanguagePath("/id", "en"), "/en");
  assert.equal(translate("id", "Donate Now"), "Donasi Sekarang");
  assert.equal(translate("en", "Konfirmasi Donasi Saya"), "Confirm My Donation");
  assert.equal(formatMonth("2025-12", "id"), "Desember 2025");
  assert.equal(formatMonth("2025-12", "en"), "December 2025");
  assert.equal(formatMonth("2025-13", "id"), "2025-13");
});

test("SQLite migration preserves English content, media, bank details, and existing administrators; rollback restores text", async () => {
  const connection = new DatabaseSync(":memory:");
  const dialect = new SQLiteSyncDialect();
  const db = {
    run: async (statement) => connection.exec(dialect.sqlToQuery(statement).sql),
    all: async (statement) => connection.prepare(dialect.sqlToQuery(statement).sql).all(),
  };
  try {
    await baseline.up({ db });
    connection.exec(`
      INSERT INTO users (id, email) VALUES (1, 'admin@example.org');
      INSERT INTO media (id, alt, filename) VALUES (1, 'Original image description', 'original.webp');
      INSERT INTO milestones (id, year, title, description) VALUES (1, '1997', 'Original milestone', 'Custom history');
      INSERT INTO gallery_items (id, title, description, image_id, date, source) VALUES (1, 'Original activity', 'Custom story', 1, '2025-12', 'https://example.org/story');
      INSERT INTO site_settings (id, hero_title, account_number) VALUES (1, 'Original heading', 'UNCHANGED-ACCOUNT');
      INSERT INTO site_settings_founder_awards (_order, _parent_id, id, award) VALUES (1, 1, 'award-one', 'Original award');
    `);
    await baseline.up({ db }); // Existing installations must not be recreated.
    connection.exec("BEGIN");
    await bilingual.up({ db });
    connection.exec("COMMIT");
    const row = (sql) => connection.prepare(sql).get();
    assert.equal(row("SELECT title FROM milestones_locales WHERE _locale = 'en'").title, "Original milestone");
    assert.equal(row("SELECT description FROM gallery_items_locales WHERE _locale = 'en'").description, "Custom story");
    assert.equal(row("SELECT alt FROM media_locales WHERE _locale = 'en'").alt, "Original image description");
    assert.equal(row("SELECT hero_title FROM site_settings_locales WHERE _locale = 'en'").hero_title, "Original heading");
    assert.equal(row("SELECT role FROM users").role, "admin");
    assert.equal(row("SELECT _status FROM milestones")._status, "published");
    assert.equal(row("SELECT _status FROM gallery_items")._status, "published");
    assert.equal(row("SELECT _status FROM site_settings")._status, "published");
    assert.equal(row("SELECT account_number FROM site_settings").account_number, "UNCHANGED-ACCOUNT");
    assert.equal(row("SELECT award FROM site_settings_founder_awards").award, "Original award");
    connection.exec("INSERT INTO milestones_locales (_locale, _parent_id, title, description) VALUES ('id', 1, 'Sejarah awal', 'Cerita ashram')");
    connection.exec("BEGIN");
    await bilingual.down({ db });
    connection.exec("COMMIT");
    assert.equal(row("SELECT title FROM milestones").title, "Original milestone");
    assert.equal(row("SELECT description FROM gallery_items").description, "Custom story");
    assert.equal(row("SELECT alt FROM media").alt, "Original image description");
    assert.equal(row("SELECT hero_title FROM site_settings").hero_title, "Original heading");
    assert.equal(row("SELECT award FROM site_settings_founder_awards").award, "Original award");
    assert.equal(row("SELECT title FROM cms_rollback_milestones_locales WHERE _locale = 'id'").title, "Sejarah awal");
    assert.deepEqual(connection.prepare("PRAGMA foreign_key_check").all(), []);
  } finally {
    connection.close();
  }
});
