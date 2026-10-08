import { NextRequest, NextResponse } from "next/server";
import { sendDonationConfirmationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const amountStr = formData.get("amount")?.toString().trim();
    const category = formData.get("category")?.toString().trim() || "Pendidikan & Yoga";
    const notes = formData.get("notes")?.toString().trim() || "";
    const proofFile = formData.get("proof") as File | null;

    // 1. Validasi field wajib
    if (!name || !email || !amountStr) {
      return NextResponse.json(
        { error: "Mohon isi nama, email, dan nominal donasi dengan lengkap." },
        { status: 400 }
      );
    }

    // 2. Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format alamat email tidak valid." },
        { status: 400 }
      );
    }

    // 3. Validasi nominal donasi
    const amount = parseInt(amountStr, 10);
    if (isNaN(amount) || amount < 10000) {
      return NextResponse.json(
        { error: "Nominal donasi minimal adalah Rp 10.000." },
        { status: 400 }
      );
    }

    // 4. Validasi bukti transfer
    if (!proofFile || proofFile.size === 0) {
      return NextResponse.json(
        { error: "Mohon lampirkan file bukti transfer bank Anda." },
        { status: 400 }
      );
    }

    // Maksimal ukuran file 5 MB
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (proofFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Ukuran file bukti transfer maksimal 5 MB." },
        { status: 400 }
      );
    }

    // Generate Transaction ID unik
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const dateCode = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const transactionId = `AGP-${dateCode}-${randomSuffix}`;

    // Baca buffer file untuk lampiran email
    const arrayBuffer = await proofFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Kirim email konfirmasi ke donatur dan admin via Nodemailer
    const emailResult = await sendDonationConfirmationEmail({
      donorName: name,
      donorEmail: email,
      amount,
      category,
      notes,
      transactionId,
      proofAttachment: {
        filename: proofFile.name,
        content: buffer,
        contentType: proofFile.type || "application/octet-stream",
      },
    });

    return NextResponse.json({
      success: true,
      transactionId,
      simulated: emailResult.simulated,
      message: emailResult.simulated
        ? "Konfirmasi donasi diterima (Mode simulasi SMTP aktif)."
        : `Email tanda terima donasi telah dikirimkan ke ${email}.`,
    });
  } catch (error) {
    console.error("Error processing donation confirmation:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server saat memproses konfirmasi donasi." },
      { status: 500 }
    );
  }
}
