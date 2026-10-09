# Editing and maintaining the CMS

The public website has English (`/en`) and Bahasa Indonesia (`/id`) versions. Existing `/`, `/gallery`, `/volunteer`, and `/donation` links redirect to English. The language links retain the current page, query, and anchor. Each page includes its language, canonical URL, and alternate-language metadata.

## Editing content

1. Sign in at `/admin` and open **Website content**.
2. Select **English** or **Bahasa Indonesia** before changing a localized field. Hero copy, SEO text, founder biography, donation introduction, gallery titles/descriptions, milestone titles/descriptions, and image descriptions can be translated independently.
3. Save a draft while preparing changes. Autosave saves drafts; it does not publish them.
4. Publish when both language versions are ready. Publication status is shared across languages. A published document's saved draft does not replace its public version.
5. Use version history to compare changes and restore a previous revision. Up to 30 revisions are retained per document/global.

Untranslated CMS fields fall back to English. Shared values—bank details, addresses, dates, images, and links—are not duplicated by language. Interface copy (navigation, form labels, fixed page sections) lives in `src/lib/i18n.ts`; changing these labels requires a code update. Newly seeded original content includes Indonesian translations in `src/content/indonesian.ts`.

The website respects an empty published collection. Removing or unpublishing all stories does not restore sample stories. During a database outage, the content layer logs an error and uses the original translated fallback content.

## Accounts and permissions

- **Administrators:** manage user accounts, roles, bank details, content, and deletion.
- **Content editors:** edit and publish content, upload/edit images, and manage their own profile. They cannot create/delete accounts, change roles, change bank details, or delete content/media.

The first account created through Payload's setup screen is assigned administrator access. On migration, existing accounts keep the administrator privileges they had before roles were introduced. Administrators should downgrade ordinary staff accounts to editor after migration.

## Database setup and rollout

Schema push is disabled for both SQLite and Postgres. Development and production use explicit migrations. `DATABASE_URI` selects the adapter and its migration directory.

**Existing installations:** create and verify a full database backup, retain the previous deployment for rollback, and test these migrations on a restored database or isolated branch before applying them to production. Stop concurrent CMS edits during migration. Check `cms:migrate:status` first; Payload may flag a previous development schema-push entry. Do not bypass that warning on a live database without testing its exact state and backup.

```sh
npm run cms:migrate:status
npm run cms:migrate
npm run seed:translations
```

The baseline creates a new database or registers an existing pre-CMS-improvement schema without recreating its tables. It assumes the existing schema matches the supplied baseline snapshot. The bilingual migration copies existing text into English locale rows before removing the original text columns, keeps shared media/bank values, marks existing content published, and preserves existing administrator access.

`seed:translations` only fills missing Indonesian titles/descriptions and settings that still match the original English copy and have no pending draft. Custom content and existing translations remain untouched. Translate custom content and image descriptions manually. The command is safe to repeat; it does not recreate deleted stories.

**New installations:** after migrating, run `npm run seed` to import the original content in both languages. Optionally supply `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` via the environment to create the first administrator. Never commit these values. Do not use `seed` to initialize an existing installation whose collections were intentionally emptied; it imports sample content into empty collections.

## Rollback

Keep a verified full database backup. To roll back the bilingual migration, review and execute that migration's `down` function against a copy first, then deploy the previous application version. It restores English text to its original columns and archives translated content and revisions in `cms_rollback_*` tables. The baseline refuses rollback to prevent deletion of an existing installation.

Payload rolls back migrations by batch. On an existing installation, register the baseline as one batch **before** applying the bilingual migration as a second batch; otherwise a generic `migrate:down` could also attempt the protected baseline. A full backup restore is the simplest rollback when both were applied in one batch. Incomplete drafts or content that has no English version may prevent rollback to the old required-field schema; use the verified backup in that case. Archive tables are kept for recovery, and a second rollback requires reviewing existing archive tables first.

## Production configuration

- Set `PAYLOAD_SECRET` to a private random value of at least 32 characters. Missing, short, and placeholder secrets stop production startup. Development without a valid secret uses an ephemeral random secret; sessions will not survive a restart.
- Use a managed Postgres database or persistent storage for local SQLite. Local SQLite on an ephemeral deployment filesystem cannot retain content reliably.
- Configure persistent S3-compatible media storage or a durable local media directory. Back up the database and media together.
- Configure a Payload email adapter before relying on CMS password-reset email delivery; the existing public-site email integration is separate. Without an adapter, Payload logs reset emails to the server console.

## Verification

```sh
npm run typecheck
npm run lint -- --max-warnings 0
npm test
npm run test:cms
npm run build
```

The unit tests verify permissions, secret validation, language paths, dates, and SQLite migration/rollback preservation. `test:cms` runs the actual Payload API against a unique temporary SQLite database, checks the first account's role, editor restrictions, bilingual content, drafts, empty collections, and protected bank settings, then removes that test database. Postgres migrations must also be tested on an isolated copy of the target database before production rollout.
