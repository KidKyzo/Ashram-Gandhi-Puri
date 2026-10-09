import { NextRequest, NextResponse } from "next/server";
import { sendDonationEmails } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    if (Number(req.headers.get("content-length") || 0) > 6 * 1024 * 1024) {
      return NextResponse.json({ error: "Berkas terlalu besar." }, { status: 413 });
    }
    const formData = await req.formData();

    const nameValue = formData.get("name");
    const emailValue = formData.get("email");
    const amountValue = formData.get("amount");
    const categoryValue = formData.get("category");
    const notesValue = formData.get("notes");
    const proofValue = formData.get("proof");

    const name = typeof nameValue === "string" ? nameValue.trim() : "";
    const email = typeof emailValue === "string" ? emailValue.trim() : "";
    const amountStr = typeof amountValue === "string" ? amountValue.trim() : "";
    const category = typeof categoryValue === "string" ? categoryValue.trim() : "";
    const notes = typeof notesValue === "string" ? notesValue.trim() : "";
    const proofFile = proofValue instanceof File ? proofValue : null;

    // 1. Validasi field wajib
    if (!name || name.length > 120 || !email || email.length > 254 || !amountStr ||
        !category || category.length > 100 || notes.length > 1000) {
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
    const amount = Number(amountStr);
    if (!/^\d+$/.test(amountStr) || !Number.isSafeInteger(amount) || amount < 10000) {
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
    if (proofFile.size > MAX_FILE_SIZE || !["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(proofFile.type)) {
      return NextResponse.json(
        { error: "Bukti transfer harus berupa JPG, PNG, WebP, atau PDF berukuran maksimal 5 MB." },
        { status: 400 }
      );
    }

    // Generate Transaction ID unik
    const dateCode = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const transactionId = `AGP-${dateCode}-${crypto.randomUUID()}`;

    // Baca buffer file untuk lampiran email
    const arrayBuffer = await proofFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const isJpeg = buffer.length >= 3 && buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]));
    const isPng = buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    const isWebp = buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP";
    const isPdf = buffer.length >= 5 && buffer.toString("ascii", 0, 5) === "%PDF-";
    const validProof = (proofFile.type === "image/jpeg" && isJpeg) ||
      (proofFile.type === "image/png" && isPng) ||
      (proofFile.type === "image/webp" && isWebp) ||
      (proofFile.type === "application/pdf" && isPdf);
    if (!validProof) {
      return NextResponse.json(
        { error: "Bukti transfer bukan berkas JPG, PNG, WebP, atau PDF yang valid." },
        { status: 400 }
      );
    }

    // Staff receives the transfer proof before the donor receives an acknowledgment.
    const emailResult = await sendDonationEmails({
      donorName: name,
      donorEmail: email,
      amount,
      category,
      notes,
      transactionId,
      proofAttachment: {
        filename: proofFile.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 100),
        content: buffer,
        contentType: proofFile.type || "application/octet-stream",
      },
    });

    if (!emailResult.staffSent) {
      return NextResponse.json(
        { error: "Konfirmasi belum terkirim. Silakan coba lagi atau hubungi yayasan." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      transactionId,
      donorEmailSent: emailResult.donorSent,
    });
  } catch (error) {
    console.error("Error processing donation confirmation:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server saat memproses konfirmasi donasi." },
      { status: 500 }
    );
  }
}
