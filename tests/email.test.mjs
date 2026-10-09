import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { sendDonationEmails, sendStaffInquiry } from "../src/lib/email.ts";

const originalFetch = globalThis.fetch;
const originalEnv = {
  EMAILJS_SERVICE_ID: process.env.EMAILJS_SERVICE_ID,
  EMAILJS_PUBLIC_KEY: process.env.EMAILJS_PUBLIC_KEY,
  EMAILJS_INQUIRY_TEMPLATE_ID: process.env.EMAILJS_INQUIRY_TEMPLATE_ID,
  EMAILJS_DONATION_TEMPLATE_ID: process.env.EMAILJS_DONATION_TEMPLATE_ID,
  STAFF_EMAIL: process.env.STAFF_EMAIL,
};

beforeEach(() => {
  process.env.EMAILJS_SERVICE_ID = "service-test";
  process.env.EMAILJS_PUBLIC_KEY = "public-test";
  process.env.EMAILJS_INQUIRY_TEMPLATE_ID = "template-inquiry";
  process.env.EMAILJS_DONATION_TEMPLATE_ID = "template-donation";
  process.env.STAFF_EMAIL = "staff@example.org";
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

test("donation uses one template for staff proof and donor acknowledgment", async () => {
  const requests = [];
  globalThis.fetch = async (_url, options) => {
    requests.push({ url: _url, body: JSON.parse(options.body) });
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
  assert.deepEqual(requests.map(({ body }) => body.template_id), ["template-donation", "template-donation"]);
  assert.deepEqual(requests.map(({ body }) => body.template_params.to_email), ["staff@example.org", "donor@example.org"]);
  assert.match(requests[0].body.template_params.proof_attachment, /^data:image\/png;base64,/);
  assert.equal(requests[0].body.template_params.proof_filename, "proof.png");
  assert.equal(requests[1].body.template_params.proof_attachment, undefined);
  assert.match(requests[0].body.template_params.donor_name, /&lt;Donor&gt;/);
  assert.match(requests[1].body.template_params.recipient_notice, /menunggu verifikasi bendahara/);
  assert.ok(requests.every(({ url }) => url === "https://api.emailjs.com/api/v1.0/email/send"));
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
  assert.deepEqual(bodies.map((body) => body.template_id), ["template-inquiry", "template-inquiry"]);
  assert.equal(bodies[0].template_params.reply_to, "alice@example.org");
  assert.match(bodies[0].template_params.message, /&lt;script&gt;/);
  assert.match(bodies[1].template_params.phone, /\+62 123/);
});
