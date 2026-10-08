import { NextResponse } from "next/server";
import { generatePublicCsv } from "@/lib/donations";
import { getDonationData } from "@/lib/donations.server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { donations } = await getDonationData();
    const csvContent = generatePublicCsv(donations);

    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const filename = `transparansi-donasi-ashram-gandhi-puri-${yearMonth}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Failed to generate public donation CSV:", error);
    return NextResponse.json(
      { error: "Gagal mengunduh file CSV donasi" },
      { status: 500 }
    );
  }
}
