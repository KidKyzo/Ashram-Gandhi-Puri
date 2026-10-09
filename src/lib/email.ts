export interface DonationEmailData {
  donorName: string;
  donorEmail: string;
  amount: number;
  category: string;
  notes?: string;
  transactionId: string;
  proofAttachment: {
    filename: string;
    content: Buffer;
    contentType: string;
  };
}

export interface DonationEmailResult {
  staffSent: boolean;
  donorSent: boolean;
}

export interface StaffInquiry {
  kind: "contact" | "volunteer";
  name: string;
  email: string;
  message?: string;
  phone?: string;
  nationality?: string;
}

interface EmailJsConfig {
  serviceId: string;
  publicKey: string;
  privateKey?: string;
  inquiryTemplateId: string;
  donationTemplateId: string;
  staffEmail: string;
}

type TemplateParams = Record<string, string>;

const EMAILJS_SEND_URL = "https://api.emailjs.com/api/v1.0/email/send";

export function resolveOrigin(customOrigin?: string | null): string {
  if (customOrigin && typeof customOrigin === "string" && customOrigin.trim()) {
    return customOrigin.trim();
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL.trim();
    return siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.trim()}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.trim()}`;
  }
  return "https://ashramgandhipuri.vercel.app";
}

function getEmailJsConfig(): EmailJsConfig | null {
  const serviceId =
    process.env.EMAILJS_SERVICE_ID ||
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const publicKey =
    process.env.EMAILJS_PUBLIC_KEY ||
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  const privateKey =
    process.env.EMAILJS_PRIVATE_KEY ||
    process.env.EMAILJS_ACCESS_TOKEN;
  const inquiryTemplateId =
    process.env.EMAILJS_INQUIRY_TEMPLATE_ID ||
    process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID;
  const donationTemplateId =
    process.env.EMAILJS_DONATION_TEMPLATE_ID ||
    process.env.NEXT_PUBLIC_EMAILJS_VOLUNTEER_TEMPLATE_ID;
  const staffEmail =
    process.env.STAFF_EMAIL ||
    process.env.NEXT_PUBLIC_STAFF_EMAIL;

  if (!serviceId || !publicKey || !inquiryTemplateId || !donationTemplateId || !staffEmail) {
    return null;
  }

  return {
    serviceId,
    publicKey,
    privateKey,
    inquiryTemplateId,
    donationTemplateId,
    staffEmail,
  };
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

async function sendTemplate(
  config: EmailJsConfig,
  templateId: string,
  templateParams: TemplateParams,
  origin?: string
): Promise<boolean> {
  try {
    const requestOrigin = resolveOrigin(origin);
    const payload: Record<string, unknown> = {
      service_id: config.serviceId,
      template_id: templateId,
      user_id: config.publicKey,
      template_params: templateParams,
    };

    if (config.privateKey) {
      payload.accessToken = config.privateKey;
    }

    const response = await fetch(EMAILJS_SEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: requestOrigin,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText =
        typeof response.text === "function"
          ? await response.text().catch(() => "")
          : "";
      console.error(
        `[EmailJS] Email request failed (${response.status}):`,
        errorText
      );
      return false;
    }
    return true;
  } catch (error) {
    console.error("[EmailJS] Email request failed:", error);
    return false;
  }
}

/** Send the proof to staff first, then acknowledge receipt to the donor. */
export async function sendDonationEmails(
  data: DonationEmailData,
  origin?: string
): Promise<DonationEmailResult> {
  const config = getEmailJsConfig();
  if (!config) {
    console.error("[EmailJS] Email configuration is incomplete.");
    return { staffSent: false, donorSent: false };
  }

  const sharedParams = {
    donor_name: escapeHtml(data.donorName),
    donor_email: data.donorEmail,
    amount: formatCurrency(data.amount),
    category: escapeHtml(data.category),
    notes: escapeHtml(data.notes || "-"),
    transaction_id: escapeHtml(data.transactionId),
  };
  const attachment = `data:${data.proofAttachment.contentType};base64,${data.proofAttachment.content.toString("base64")}`;

  const staffSent = await sendTemplate(
    config,
    config.donationTemplateId,
    {
      ...sharedParams,
      to_email: config.staffEmail,
      reply_to: data.donorEmail,
      subject: `[Donasi Masuk] ${data.transactionId} - ${formatCurrency(data.amount)}`,
      recipient_notice:
        "Konfirmasi donasi baru menunggu pemeriksaan mutasi rekening. Periksa bukti transfer terlampir sebelum mengonfirmasi donasi.",
      proof_attachment: attachment,
      proof_filename: data.proofAttachment.filename,
      proof_content_type: data.proofAttachment.contentType,
    },
    origin
  );

  if (!staffSent) return { staffSent: false, donorSent: false };

  // EmailJS limits sends to one request per second.
  await new Promise((resolve) => setTimeout(resolve, 1100));

  const donorSent = await sendTemplate(
    config,
    config.donationTemplateId,
    {
      ...sharedParams,
      to_email: data.donorEmail,
      reply_to: config.staffEmail,
      subject: `Konfirmasi Donasi Diterima [${data.transactionId}]`,
      recipient_notice:
        "Kami telah menerima konfirmasi dan bukti transfer Anda. Transfer masih menunggu verifikasi bendahara; email ini bukan bukti bahwa transfer telah diverifikasi.",
    },
    origin
  );

  return { staffSent: true, donorSent };
}

export async function sendStaffInquiry(
  inquiry: StaffInquiry,
  origin?: string
): Promise<boolean> {
  const config = getEmailJsConfig();
  if (!config) {
    console.error("[EmailJS] Email configuration is incomplete.");
    return false;
  }

  const isContact = inquiry.kind === "contact";
  const formType = isContact ? "Contact Inquiry" : "Volunteer Application";

  return sendTemplate(
    config,
    config.inquiryTemplateId,
    {
      to_email: config.staffEmail,
      reply_to: inquiry.email,
      subject: `${formType} - Ashram Gandhi Puri`,
      form_type: formType,
      name: escapeHtml(inquiry.name),
      email: inquiry.email,
      message: escapeHtml(inquiry.message || "-"),
      phone: escapeHtml(inquiry.phone || "-"),
      nationality: escapeHtml(inquiry.nationality || "-"),
    },
    origin
  );
}
