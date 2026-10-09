import assert from "node:assert/strict";
import { getPayload } from "payload";
import config from "@payload-config";
import { getDefaultSettings, getMilestones, getSiteSettings } from "../src/lib/content";

const payload = await getPayload({ config });
try {
  await payload.db.migrate();
  const admin = await payload.create({ collection: "users", data: { email: "admin@example.org", password: "isolated-test-password", role: "editor" } });
  assert.equal(admin.role, "admin", "The first account must be an administrator.");
  const editor = await payload.create({ collection: "users", user: admin, overrideAccess: false, data: { email: "editor@example.org", password: "isolated-test-password", role: "editor" } });
  const ownProfile = await payload.update({ collection: "users", id: editor.id, user: editor, overrideAccess: false, data: { role: "admin" } });
  assert.equal(ownProfile.role, "editor", "An editor must not escalate their own role.");
  const visibleUsers = await payload.find({ collection: "users", user: editor, overrideAccess: false });
  assert.deepEqual(visibleUsers.docs.map((doc) => doc.id), [editor.id]);
  await assert.rejects(payload.create({ collection: "users", user: editor, overrideAccess: false, data: { email: "forbidden@example.org", password: "isolated-test-password", role: "admin" } }));

  const doc = await payload.create({ collection: "milestones", user: editor, overrideAccess: false, locale: "en", data: { year: "1997", title: "Published English", description: "English story", _status: "published" } });
  await payload.update({ collection: "milestones", id: doc.id, locale: "id", user: editor, overrideAccess: false, data: { title: "Cerita Indonesia", description: "Kisah ashram", _status: "published" } });
  assert.equal((await getMilestones("id"))[0].title, "Cerita Indonesia");
  await payload.update({ collection: "milestones", id: doc.id, locale: "en", user: editor, overrideAccess: false, draft: true, data: { title: "Secret draft", _status: "draft" } });
  assert.equal((await getMilestones("en"))[0].title, "Published English", "Saving a draft must not replace the public version.");
  const draft = await payload.create({ collection: "milestones", user: editor, overrideAccess: false, draft: true, data: { year: "2026", title: "Never published", _status: "draft" } });
  assert.equal((await getMilestones("en")).length, 1, "Public readers must not see unpublished documents.");
  await assert.rejects(payload.delete({ collection: "milestones", id: doc.id, user: editor, overrideAccess: false }));
  await payload.delete({ collection: "milestones", id: doc.id, user: admin, overrideAccess: false });
  await payload.delete({ collection: "milestones", id: draft.id, user: admin, overrideAccess: false });
  assert.deepEqual(await getMilestones("en"), [], "An intentionally empty collection must stay empty.");

  await payload.updateGlobal({ slug: "site-settings", user: admin, overrideAccess: false, locale: "en", data: { ...getDefaultSettings("en"), accountNumber: "SAFE-ACCOUNT", _status: "published" } });
  await payload.updateGlobal({ slug: "site-settings", user: editor, overrideAccess: false, locale: "id", data: { ...getDefaultSettings("id"), accountNumber: "FORBIDDEN-ACCOUNT", _status: "published" } });
  assert.equal((await getSiteSettings("id")).heroTitle, getDefaultSettings("id").heroTitle);
  assert.equal((await getSiteSettings("id")).accountNumber, "SAFE-ACCOUNT");
  assert.equal((await getSiteSettings("en")).accountNumber, "SAFE-ACCOUNT");
  await payload.updateGlobal({ slug: "site-settings", user: editor, overrideAccess: false, locale: "en", draft: true, data: { heroTitle: "Unpublished heading", _status: "draft" } });
  assert.equal((await getSiteSettings("en")).heroTitle, getDefaultSettings("en").heroTitle);
  console.log("CMS integration passed: first admin, editor restrictions, bilingual content, published-only reads, drafts, empty collections, and protected bank settings.");
} finally {
  await payload.destroy();
}
