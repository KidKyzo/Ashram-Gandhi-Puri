import fs from "fs";
import path from "path";
import {
  parseDonationsCsv,
  type DonationRecord,
  type DonationSummary,
} from "./donations";

/**
 * Membaca data donasi dari CSV di filesystem (public/data/donations.csv)
 */
export async function getDonationData(): Promise<{
  donations: DonationRecord[];
  summary: DonationSummary;
}> {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "donations.csv");
    if (!fs.existsSync(filePath)) {
      return {
        donations: [],
        summary: {
          totalAmount: 0,
          totalDonors: 0,
          totalTransactions: 0,
          currentMonthAmount: 0,
          currentMonthDonors: 0,
          categories: {},
          periods: [],
        },
      };
    }

    const csvContent = fs.readFileSync(filePath, "utf-8");
    const donations = parseDonationsCsv(csvContent);

    // Hitung ringkasan
    let totalAmount = 0;
    const categories: { [key: string]: number } = {};
    const periodsSet = new Set<string>();

    const latestMonth = donations.length > 0 ? donations[0].monthPeriod : "";
    let currentMonthAmount = 0;
    let currentMonthDonors = 0;

    for (const d of donations) {
      if (d.status === "Verified") {
        totalAmount += d.amount;
        categories[d.category] = (categories[d.category] || 0) + d.amount;
        periodsSet.add(d.monthPeriod);

        if (d.monthPeriod === latestMonth) {
          currentMonthAmount += d.amount;
          currentMonthDonors += 1;
        }
      }
    }

    const periods = Array.from(periodsSet).sort().reverse();

    const summary: DonationSummary = {
      totalAmount,
      totalDonors: donations.length,
      totalTransactions: donations.length,
      currentMonthAmount,
      currentMonthDonors,
      categories,
      periods,
    };

    return { donations, summary };
  } catch (error) {
    console.error("Error reading donations CSV:", error);
    return {
      donations: [],
      summary: {
        totalAmount: 0,
        totalDonors: 0,
        totalTransactions: 0,
        currentMonthAmount: 0,
        currentMonthDonors: 0,
        categories: {},
        periods: [],
      },
    };
  }
}
