# EmailJS Templates Setup Guide — Ashram Gandhi Puri

This guide explains how to configure EmailJS so that both **Sender (User Auto-Reply)** and **Received (Staff Notification)** emails share the exact same consistent, professional Ashram Gandhi Puri design system.

---

## 1. What Caused the Inconsistency in the Screenshot?

1. **Missing Message Field in Inquiry Copy:**
   The template previously displayed `"{{name}}"` and `"{{email}}"` inside the inquiry quote, but was missing `{{message}}`.
2. **Duplicate Signatures:**
   The template had `Best regards, Ashram Gandhi Puri` twice at the bottom of the message body.
3. **Plain Text Formatting:**
   The email was rendering without Ashram Gandhi Puri's signature brand header, warm colors, and formatted detail cards.

---

## 2. Updated Codebase Fields

The following parameters are now uniformly passed from both the **Contact form** ([`Footer.tsx`](file:///d:/Dokumen%20Kampus%20-%20Ariel/Semester%206/Web%20Page%20Publishing/Ashram%20Gandhi%20Puri/Ashram-Gandhi-Puri/src/components/Footer.tsx)) and the **Volunteer form** ([`page.tsx`](file:///d:/Dokumen%20Kampus%20-%20Ariel/Semester%206/Web%20Page%20Publishing/Ashram%20Gandhi%20Puri/Ashram-Gandhi-Puri/src/app/(site)/volunteer/page.tsx)):

| Variable | Description | Example |
| :--- | :--- | :--- |
| `{{from_name}}` / `{{name}}` | Sender's full name | `Ariel Oka` |
| `{{from_email}}` / `{{email}}` | Sender's email address | `arielokasch@gmail.com` |
| `{{reply_to}}` | Reply-to address | `arielokasch@gmail.com` |
| `{{phone}}` | Contact phone number | `+62 812-3456-7890` (or `-` for contact) |
| `{{nationality}}` | Nationality | `Indonesian` (or `-` for contact) |
| `{{subject}}` | Formatted subject line | `Contact Inquiry from Ariel Oka` |
| `{{form_title}}` | Form name | `Contact Inquiry` or `Volunteer Application` |
| `{{message}}` | User's message or application details | Full text message |
| `{{to_email}}` | Ashram staff recipient | `ashramgandhipuriorg@gmail.com` |

---

## 3. How to Update Templates in EmailJS Dashboard

Log in to [https://dashboard.emailjs.com/admin/templates](https://dashboard.emailjs.com/admin/templates):

### A. For the Admin / Staff Notification (Received Email)
1. Select your template:
   - Contact Form: **`template_qsdscza`**
   - Volunteer Form: **`template_22lu2os`**
2. In the template header settings:
   - **To Email:** `{{to_email}}` (or `ashramgandhipuriorg@gmail.com`)
   - **From Name:** `{{from_name}} via Ashram Gandhi Puri`
   - **Reply To:** `{{reply_to}}`
   - **Subject:** `{{subject}}`
3. In the content editor, click **Source Code (<>)** or HTML view.
4. Paste the content of [`received-admin-notification.html`](file:///d:/Dokumen%20Kampus%20-%20Ariel/Semester%206/Web%20Page%20Publishing/Ashram%20Gandhi%20Puri/Ashram-Gandhi-Puri/docs/email-templates/received-admin-notification.html).
5. Click **Save**.

### B. For the User Auto-Reply (Sender Email)
1. In the same template, go to the **Auto-Reply** tab (or create a dedicated Auto-Reply template).
2. Enable **Send auto-reply**.
3. In the Auto-Reply settings:
   - **To Email:** `{{from_email}}`
   - **From Name:** `Ashram Gandhi Puri`
   - **Subject:** `Thank You for Contacting Ashram Gandhi Puri`
4. In the content editor, switch to **Source Code (<>)** mode.
5. Paste the content of [`sender-user-autoreply.html`](file:///d:/Dokumen%20Kampus%20-%20Ariel/Semester%206/Web%20Page%20Publishing/Ashram%20Gandhi%20Puri/Ashram-Gandhi-Puri/docs/email-templates/sender-user-autoreply.html).
6. Click **Save**.
