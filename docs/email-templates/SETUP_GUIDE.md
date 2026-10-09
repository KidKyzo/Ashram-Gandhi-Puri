# EmailJS setup — Ashram Gandhi Puri

All three forms send through the existing server routes. Configure two EmailJS templates:

1. **Inquiry template** (`EMAILJS_INQUIRY_TEMPLATE_ID`): one dynamic template shared by contact inquiries and volunteer applications. The `form_type` value distinguishes them.
2. **Donation template** (`EMAILJS_DONATION_TEMPLATE_ID`): a dynamic template used twice for each successful donation submission: first for the staff notification with the transfer proof attached, then for the donor acknowledgment without an attachment.

## Environment variables

Set these values in local `.env.local` and the deployment environment. Keep real values out of Git:

| Variable | Purpose |
| --- | --- |
| `EMAILJS_SERVICE_ID` | EmailJS email service ID |
| `EMAILJS_PUBLIC_KEY` | EmailJS public key used for REST requests |
| `EMAILJS_PRIVATE_KEY` | *(Optional / Recommended)* EmailJS private key (Account > Security) for strict API access |
| `EMAILJS_INQUIRY_TEMPLATE_ID` | Shared contact + volunteer template ID |
| `EMAILJS_DONATION_TEMPLATE_ID` | Donation template ID |
| `STAFF_EMAIL` | Inbox for contact, volunteer, and donation notifications |

The application calls EmailJS from server routes, validates form submissions and donation receipts on the server, and sends the transfer proof only to the staff inbox. EmailJS requires non-browser/server requests to either provide an `Origin` header matching the authorized domain or supply the `EMAILJS_PRIVATE_KEY` (`accessToken`). The server routes automatically send the request origin and attach the private key if defined.

## Inquiry template

Set the template's **To Email** to `{{to_email}}`, **Reply To** to `{{reply_to}}`, and **Subject** to `{{subject}}`. Use these variables in the email body:

```text
{{form_type}}
{{name}}
{{email}}
{{phone}}
{{nationality}}
{{message}}
```

For a contact inquiry, phone and nationality contain `-`. For a volunteer application, message contains `-`.

## Donation template

Set **To Email** to `{{to_email}}`, **Reply To** to `{{reply_to}}`, and **Subject** to `{{subject}}`. Include these variables in the email body:

```text
{{recipient_notice}}
{{donor_name}}
{{donor_email}}
{{amount}}
{{category}}
{{notes}}
{{transaction_id}}
```

In the template's **Attachments** settings, add a **Variable Attachment** with parameter `proof_attachment`. Set its filename to `{{proof_filename}}` and content type to `{{proof_content_type}}` if those fields support template variables. The staff notification includes the attachment; the donor acknowledgment omits it. The donor message explains that the transfer is still awaiting verification.

## Test and deployment

After saving both templates and environment variables, redeploy the application. Test contact, volunteer, and donation forms. Confirm that contact and volunteer notifications arrive in the staff inbox with their correct `form_type`; confirm that a donation proof arrives as a staff attachment and that the donor receives the acknowledgment. EmailJS applies a send-rate limit, so donation notification and acknowledgment are sent at least one second apart.

Add the production site origin to the EmailJS allowed domains when the site is hosted. Keep the API routes' validation and honeypot checks enabled; configure EmailJS CAPTCHA if spam becomes a problem.

The public donation report section remains removed. Donor details and proof attachments are sent only to the configured staff inbox and EmailJS.
