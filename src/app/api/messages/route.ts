import { NextRequest, NextResponse } from "next/server";
import { sendStaffInquiry, type StaffInquiry } from "@/lib/email";

function validText(value: unknown, maxLength: number): value is string {
  return typeof value === "string" && value.trim().length > 0 &&
    value.trim().length <= maxLength;
}

function parseInquiry(value: unknown): StaffInquiry | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  if (input.kind !== "contact" && input.kind !== "volunteer") return null;
  if (!validText(input.name, 120) || !validText(input.email, 254)) return null;
  const email = input.email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

  if (input.kind === "contact") {
    if (!validText(input.message, 5000)) return null;
    return {
      kind: "contact",
      name: input.name.trim(),
      email,
      message: input.message.trim(),
    };
  }

  if (!validText(input.phone, 50) || !validText(input.nationality, 100)) return null;
  return {
    kind: "volunteer",
    name: input.name.trim(),
    email,
    phone: input.phone.trim(),
    nationality: input.nationality.trim(),
  };
}

export async function POST(request: NextRequest) {
  if (Number(request.headers.get("content-length") || 0) > 16_384) {
    return NextResponse.json({ error: "Submission is too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }
  const input = body as Record<string, unknown>;
  if (typeof input.honeypot === "string" && input.honeypot.length > 0) {
    return NextResponse.json({ success: true });
  }

  const inquiry = parseInquiry(input);
  if (!inquiry) {
    return NextResponse.json({ error: "Please check the form fields and try again." }, { status: 400 });
  }

  if (!(await sendStaffInquiry(inquiry))) {
    return NextResponse.json(
      { error: "Email could not be sent. Please try again later." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
