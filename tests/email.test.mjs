import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { sendDonationEmails, sendStaffInquiry } from "../src/lib/email.ts";

const originalFetch = globalThis.fetch;
const originalEnv = {
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
  STAFF_EMAIL: process.env.STAFF_EMAIL,
};

beforeEach(() => {
  process.env.RESEND_API_KEY = "test-key";
  process.env.RESEND_FROM_EMAIL = "hello@example.org";
  process.env.STAFF_EMAIL = "staff@example.org";
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

test("donation sends proof to staff before donor acknowledgment", async () => {
  const requests = [];
  globalThis.fetch = async (_url, options) => {
    requests.push({ headers: options.headers, body: JSON.parse(options.body) });
    return { ok: true };
  };

  const result = await sendDonationEmails({
    donorName: "<Donor>",
    donorEmail: "donor@example.org",
    amount: 10000,
    category: "Yoga",
    transactionId: "AGP-123",
    proofAttachment: {
      filename: "proof.png",
      content: Buffer.from("proof"),
      contentType: "image/png",
    },
  });

  assert.deepEqual(result, { staffSent: true, donorSent: true });
  assert.deepEqual(requests.map(({ body }) => body.to), [["staff@example.org"], ["donor@example.org"]]);
  assert.equal(requests[0].body.attachments[0].content, Buffer.from("proof").toString("base64"));
  assert.match(requests[0].body.html, /&lt;Donor&gt;/);
  assert.match(requests[1].body.html, /menunggu pemeriksaan mutasi rekening/);
  assert.notEqual(requests[0].headers["Idempotency-Key"], requests[1].headers["Idempotency-Key"]);
});

test("donor email is skipped when staff delivery fails", async () => {
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    return { ok: false, status: 503 };
  };

  const result = await sendDonationEmails({
    donorName: "Donor",
    donorEmail: "donor@example.org",
    amount: 10000,
    category: "Yoga",
    transactionId: "AGP-456",
    proofAttachment: {
      filename: "proof.png",
      content: Buffer.from("proof"),
      contentType: "image/png",
    },
  });

  assert.deepEqual(result, { staffSent: false, donorSent: false });
  assert.equal(calls, 1);
});

test("contact and volunteer inquiries use the same sender and escape user text", async () => {
  const bodies = [];
  globalThis.fetch = async (_url, options) => {
    bodies.push(JSON.parse(options.body));
    return { ok: true };
  };

  assert.equal(await sendStaffInquiry({
    kind: "contact",
    name: "Alice",
    email: "alice@example.org",
    message: "Hello <script>alert(1)</script>",
  }), true);
  assert.equal(await sendStaffInquiry({
    kind: "volunteer",
    name: "Bob",
    email: "bob@example.org",
    phone: "+62 123",
    nationality: "Indonesia",
  }), true);

  assert.equal(bodies.length, 2);
  assert.equal(bodies[0].reply_to, "alice@example.org");
  assert.match(bodies[0].html, /&lt;script&gt;/);
  assert.match(bodies[1].html, /\+62 123/);
});
