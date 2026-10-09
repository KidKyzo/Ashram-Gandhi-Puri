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

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

export function escapeHtml(value: string): string {
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

async function sendEmail(
  apiKey: string,
  payload: Record<string, unknown>,
  idempotencyKey: string
): Promise<boolean> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("[Resend] Donation email failed:", response.status);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[Resend] Donation email request failed:", error);
    return false;
  }
}

/** Send the proof to staff first, then acknowledge receipt to the donor. */
export async function sendDonationEmails(data: DonationEmailData): Promise<DonationEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const staffEmail = process.env.STAFF_EMAIL;

  if (!apiKey || !fromEmail || !staffEmail) {
    console.error("[Resend] Donation email configuration is incomplete.");
    return { staffSent: false, donorSent: false };
  }

  const from = `Yayasan Ashram Gandhi Puri <${fromEmail}>`;
  const name = escapeHtml(data.donorName);
  const email = escapeHtml(data.donorEmail);
  const category = escapeHtml(data.category);
  const notes = escapeHtml(data.notes || "-");
  const amount = formatCurrency(data.amount);
  const transactionId = escapeHtml(data.transactionId);

  const staffSent = await sendEmail(
    apiKey,
    {
      from,
      to: [staffEmail],
      subject: `[Donasi Masuk] ${data.transactionId} - ${amount}`,
      html: `<p>Konfirmasi donasi baru menunggu pemeriksaan mutasi rekening.</p>
        <p><strong>Referensi:</strong> ${transactionId}<br>
        <strong>Nama:</strong> ${name}<br>
        <strong>Email:</strong> ${email}<br>
        <strong>Nominal:</strong> ${amount}<br>
        <strong>Program:</strong> ${category}<br>
        <strong>Catatan:</strong> ${notes}</p>
        <p>Bukti transfer terlampir. Periksa mutasi rekening sebelum mengonfirmasi donasi.</p>`,
      attachments: [
        {
          filename: data.proofAttachment.filename,
          content: data.proofAttachment.content.toString("base64"),
          content_type: data.proofAttachment.contentType,
        },
      ],
    },
    `${data.transactionId}-staff`
  );

  if (!staffSent) return { staffSent: false, donorSent: false };

  const donorSent = await sendEmail(
    apiKey,
    {
      from,
      to: [data.donorEmail],
      subject: `Konfirmasi Donasi Diterima [${data.transactionId}]`,
      html: `<p>Om Swastyastu, ${name}.</p>
        <p>Kami telah menerima formulir konfirmasi dan bukti transfer Anda.</p>
        <p><strong>Referensi:</strong> ${transactionId}<br>
        <strong>Nominal yang dilaporkan:</strong> ${amount}<br>
        <strong>Program:</strong> ${category}</p>
        <p>Donasi Anda masih menunggu pemeriksaan mutasi rekening oleh bendahara. Email ini bukan bukti bahwa transfer telah diverifikasi.</p>
        <p>Matur suksma,<br>Yayasan Ashram Gandhi Puri</p>`,
    },
    `${data.transactionId}-donor`
  );

  return { staffSent: true, donorSent };
}

export interface StaffInquiry {
  kind: "contact" | "volunteer";
  name: string;
  email: string;
  message?: string;
  phone?: string;
  nationality?: string;
}

export async function sendStaffInquiry(inquiry: StaffInquiry): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const staffEmail = process.env.STAFF_EMAIL;
  if (!apiKey || !fromEmail || !staffEmail) {
    console.error("[Resend] Staff email configuration is incomplete.");
    return false;
  }

  const title = inquiry.kind === "contact" ? "Contact Inquiry" : "Volunteer Application";
  const details = inquiry.kind === "contact"
    ? `<p><strong>Message:</strong><br>${escapeHtml(inquiry.message || "").replace(/\n/g, "<br>")}</p>`
    : `<p><strong>Phone:</strong> ${escapeHtml(inquiry.phone || "")}<br>
        <strong>Nationality:</strong> ${escapeHtml(inquiry.nationality || "")}</p>`;

  return sendEmail(
    apiKey,
    {
      from: `Yayasan Ashram Gandhi Puri <${fromEmail}>`,
      to: [staffEmail],
      reply_to: inquiry.email,
      subject: `${title} - Ashram Gandhi Puri`,
      html: `<h1>${title}</h1>
        <p><strong>Name:</strong> ${escapeHtml(inquiry.name)}<br>
        <strong>Email:</strong> ${escapeHtml(inquiry.email)}</p>${details}`,
    },
    `${inquiry.kind}-${crypto.randomUUID()}`
  );
}
