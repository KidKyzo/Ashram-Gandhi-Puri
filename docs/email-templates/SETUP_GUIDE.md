# Email setup — Ashram Gandhi Puri

Contact inquiries, volunteer applications, and donation confirmations use Resend from server routes. Email content is defined in `src/lib/email.ts`; dashboard templates are not required.

1. Verify a domain you control in Resend and create a sending API key.
2. Set `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `STAFF_EMAIL` in the deployment environment. The sender address must use the verified domain. Copy `.env.example` for local development and keep real values out of Git.
3. Redeploy after changing the environment variables.
4. Submit a contact inquiry, volunteer application, and donation confirmation with a small test receipt. Check the staff inbox, the donor acknowledgment, and Resend delivery logs.

Donation submissions send the transfer proof to staff first. The donor receives an acknowledgment only after Resend accepts the staff notification. This acknowledgment says that the bank transfer is still awaiting treasurer verification. If the staff email fails, the form displays an error; if only the donor email fails, it displays the reference number and explains that the acknowledgment was not sent.

The donation report and downloadable CSV have been removed from the public site. Donor details and proof attachments are sent only to the configured staff inbox and Resend.
