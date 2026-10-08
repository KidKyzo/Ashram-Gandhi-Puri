import nodemailer, { type SendMailOptions } from "nodemailer";

export interface DonationEmailData {
  donorName: string;
  donorEmail: string;
  amount: number;
  category: string;
  notes?: string;
  transactionId: string;
  proofAttachment?: {
    filename: string;
    content: Buffer;
    contentType: string;
  };
}

/**
 * Format mata uang Rupiah
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Buat transporter Nodemailer dengan fallback jika kredensial belum diisi
 */
function getEmailTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass || pass === "your-google-app-password-here") {
    console.warn(
      "[Nodemailer] SMTP_USER atau SMTP_PASS belum diset di .env. Email akan disimulasikan."
    );
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Mengirimkan email konfirmasi tanda terima donasi ke Donatur
 * dan notifikasi bukti transfer ke Bendahara/Admin Yayasan
 */
export async function sendDonationConfirmationEmail(
  data: DonationEmailData
): Promise<{ success: boolean; simulated: boolean; error?: string }> {
  const transporter = getEmailTransporter();
  const fromName = process.env.SMTP_FROM_NAME || "Yayasan Ashram Gandhi Puri";
  const fromEmail =
    process.env.SMTP_FROM_EMAIL ||
    process.env.SMTP_USER ||
    "ashramgandhipuriorg@gmail.com";
  const staffEmail =
    process.env.NEXT_PUBLIC_STAFF_EMAIL || "ashramgandhipuriorg@gmail.com";

  const formattedAmount = formatCurrency(data.amount);
  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Template HTML Email untuk Donatur
  const donorHtmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tanda Terima Donasi - Ashram Gandhi Puri</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF5FF; margin: 0; padding: 24px; color: #2E1065; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #EDE9FE; overflow: hidden; box-shadow: 0 4px 12px rgba(46, 16, 101, 0.06); }
        .header { background: #2E1065; color: #ffffff; padding: 32px 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; color: #f1ad66; }
        .header p { margin: 8px 0 0; font-size: 13px; color: #DDD6FE; }
        .body { padding: 32px 24px; line-height: 1.6; font-size: 14px; color: #4C1D95; }
        .greeting { font-size: 16px; font-weight: 700; margin-bottom: 12px; color: #2E1065; }
        .table-info { width: 100%; border-collapse: collapse; margin: 20px 0; background: #FAF5FF; border-radius: 12px; overflow: hidden; }
        .table-info td { padding: 12px 16px; border-bottom: 1px solid #EDE9FE; font-size: 13px; }
        .table-info td:first-child { font-weight: 600; color: #6B4FA0; width: 40%; }
        .table-info td:last-child { font-weight: 700; color: #2E1065; }
        .table-info tr:last-child td { border-bottom: none; }
        .badge { display: inline-block; padding: 4px 10px; background: #FEF3C7; color: #92400E; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .note { background: #F3E8FF; border-left: 4px solid #A78BFA; padding: 12px 16px; border-radius: 4px; font-size: 12px; margin: 20px 0; color: #4C1D95; }
        .footer { background: #FAF5FF; padding: 20px 24px; text-align: center; font-size: 12px; color: #6B4FA0; border-top: 1px solid #EDE9FE; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>Ashram Gandhi Puri</h1>
          <p>Sevagram Gunaksa, Klungkung, Bali · Sejak 1997</p>
        </div>
        <div class="body">
          <p class="greeting">Om Swastyastu, Matur Suksma ${data.donorName}</p>
          <p>
            Konfirmasi transfer donasi / dana punia Anda telah berhasil kami terima dalam sistem. 
            Berikut adalah rincian tanda terima sementara Anda:
          </p>

          <table class="table-info">
            <tr>
              <td>Kode Transaksi</td>
              <td><code>${data.transactionId}</code></td>
            </tr>
            <tr>
              <td>Tanggal</td>
              <td>${currentDate}</td>
            </tr>
            <tr>
              <td>Nominal</td>
              <td style="color: #CA8A04; font-size: 16px;">${formattedAmount}</td>
            </tr>
            <tr>
              <td>Program</td>
              <td>${data.category}</td>
            </tr>
            ${
              data.notes
                ? `<tr><td>Catatan / Doa</td><td>"${data.notes}"</td></tr>`
                : ""
            }
            <tr>
              <td>Status Verifikasi</td>
              <td><span class="badge">Menunggu Verifikasi Mutasi</span></td>
            </tr>
          </table>

          <div class="note">
            <strong>🔒 Catatan Transparansi & Akuntabilitas Publik:</strong><br>
            Setelah bendahara memverifikasi mutasi rekening, data donasi Anda akan dicatat 
            dalam Laporan Donasi Publik bulanan di website resmi kami dengan alamat email disensor 
            (contoh: <code>${data.donorEmail.slice(0, 2)}***@...</code>) demi menjaga privasi Anda.
          </div>

          <p>
            Doa dan rasa terima kasih kami haturkan atas ketulusan Anda mendukung pendidikan spiritual, 
            kebun organik, dan santri pasraman di Ashram Gandhi Puri. Semoga kebajikan ini senantiasa melimpahkan berkah kedamaian.
          </p>
        </div>
        <div class="footer">
          <p><strong>Yayasan Ashram Gandhi Puri</strong></p>
          <p>Jalan Raya Gunaksa 99, Klungkung, Bali, Indonesia</p>
          <p>Email: ${staffEmail} · Situs: ashramgandhipuri.org</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Template HTML Email untuk Admin / Bendahara Yayasan
  const adminHtmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head><meta charset="UTF-8"><title>Notifikasi Donasi Masuk</title></head>
    <body style="font-family: sans-serif; background: #f9fafb; padding: 20px; color: #111827;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb;">
        <h2 style="color: #7c2d12; margin-top: 0;">🔔 Konfirmasi Donasi Baru Masuk!</h2>
        <p>Ada donatur yang baru saja mengunggah bukti transfer donasi:</p>
        <ul style="line-height: 1.8;">
          <li><strong>ID:</strong> ${data.transactionId}</li>
          <li><strong>Nama Donatur:</strong> ${data.donorName}</li>
          <li><strong>Email:</strong> ${data.donorEmail}</li>
          <li><strong>Nominal:</strong> ${formattedAmount}</li>
          <li><strong>Program:</strong> ${data.category}</li>
          <li><strong>Catatan/Doa:</strong> ${data.notes || "-"}</li>
          <li><strong>Bukti Transfer:</strong> Terlampir di email ini (${data.proofAttachment?.filename || "file bukti"})</li>
        </ul>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="font-size: 13px; color: #4b5563;">
          Silakan cek mutasi di rekening Bank Mandiri Yayasan. Setelah dana masuk terverifikasi, masukkan catatan ke berkas <code>public/data/donations.csv</code>.
        </p>
      </div>
    </body>
    </html>
  `;

  // Jika kredensial belum ada di .env, kita jalankan simulasi
  if (!transporter) {
    console.log(
      `[SIMULASI NODEMAILER] Email konfirmasi donasi untuk ${data.donorEmail} (${formattedAmount}) berhasil dibuat.`
    );
    return {
      success: true,
      simulated: true,
    };
  }

  try {
    // 1. Kirim email tanda terima ke Donatur
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: data.donorEmail,
      subject: `Tanda Terima Donasi: ${data.category} [${data.transactionId}] - Ashram Gandhi Puri`,
      html: donorHtmlContent,
    });

    // 2. Kirim notifikasi + lampiran bukti transfer ke Staff / Bendahara
    const adminMailOptions: SendMailOptions = {
      from: `"${fromName} System" <${fromEmail}>`,
      to: staffEmail,
      subject: `[Donasi Masuk] ${data.donorName} - ${formattedAmount} (${data.category})`,
      html: adminHtmlContent,
    };

    if (data.proofAttachment) {
      adminMailOptions.attachments = [
        {
          filename: data.proofAttachment.filename,
          content: data.proofAttachment.content,
          contentType: data.proofAttachment.contentType,
        },
      ];
    }

    await transporter.sendMail(adminMailOptions);

    return { success: true, simulated: false };
  } catch (error: unknown) {
    console.error("[Nodemailer] Gagal mengirim email donasi:", error);
    const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan saat mengirim email";
    return {
      success: false,
      simulated: false,
      error: errorMessage,
    };
  }
}
