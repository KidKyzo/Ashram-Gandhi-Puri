
export interface DonationRecord {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  donorName: string;
  emailRaw?: string;
  emailCensored: string;
  category: string;
  notes: string;
  status: "Verified" | "Pending";
  monthPeriod: string; // e.g. "2026-10"
  monthDisplay: string; // e.g. "Oktober 2026"
}

export interface DonationSummary {
  totalAmount: number;
  totalDonors: number;
  totalTransactions: number;
  currentMonthAmount: number;
  currentMonthDonors: number;
  categories: { [key: string]: number };
  periods: string[];
}

const MONTH_NAMES_ID: { [key: string]: string } = {
  "01": "Januari",
  "02": "Februari",
  "03": "Maret",
  "04": "April",
  "05": "Mei",
  "06": "Juni",
  "07": "Juli",
  "08": "Agustus",
  "09": "September",
  "10": "Oktober",
  "11": "November",
  "12": "Desember",
};

/**
 * Sensor email untuk transparansi publik dan kepatuhan privasi (UU PDP).
 * Contoh:
 * - "ketut.suastika@gmail.com" -> "ke***a@gmail.com"
 * - "bagoes@gmail.com" -> "ba***s@gmail.com"
 * - "ab@test.com" -> "a***@test.com"
 */
export function censorEmail(email?: string): string {
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return "do***@anonym.org";
  }

  const parts = email.trim().split("@");
  if (parts.length !== 2) return "do***@anonym.org";

  const [username, domain] = parts;
  if (!username || !domain) return "do***@anonym.org";

  let censoredUser = "";
  if (username.length <= 2) {
    censoredUser = `${username[0]}***`;
  } else if (username.length <= 4) {
    censoredUser = `${username.slice(0, 2)}***`;
  } else {
    // Tampilkan 2 huruf awal dan 1 huruf akhir sebelum @
    censoredUser = `${username.slice(0, 2)}***${username.slice(-1)}`;
  }

  return `${censoredUser}@${domain}`;
}

/**
 * Format nominal Rupiah
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format tanggal ke format Indonesia (e.g., "06 Okt 2026")
 */
export function formatIndoDate(dateStr: string): string {
  if (!dateStr || !dateStr.includes("-")) return dateStr;
  const [year, month, day] = dateStr.split("-");
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
  ];
  const mIndex = parseInt(month, 10) - 1;
  const mName = monthNames[mIndex] || month;
  return `${day} ${mName} ${year}`;
}

/**
 * Parse CSV string ke DonationRecord[]
 */
export function parseDonationsCsv(csvText: string): DonationRecord[] {
  const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  if (lines.length <= 1) return [];

  // Header: id,date,amount,donor_name,email,category,notes,status
  const records: DonationRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Split by comma ignoring commas inside quotes if any
    const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
    if (cols.length < 3) continue;

    const id = cols[0] || `DN-${i}`;
    const date = cols[1] || "";
    const amount = parseInt(cols[2], 10) || 0;
    const donorName = cols[3] || "Donatur";
    const rawEmail = cols[4] || "";
    const category = cols[5] || "Dana Punia Umum";
    const notes = cols[6] || "";
    const status = (cols[7] === "Verified" ? "Verified" : "Pending") as "Verified" | "Pending";

    const dateParts = date.split("-");
    const monthPart = dateParts[1] || "01";
    const yearPart = dateParts[0] || "2026";
    const monthPeriod = `${yearPart}-${monthPart}`;
    const monthDisplay = `${MONTH_NAMES_ID[monthPart] || monthPart} ${yearPart}`;

    records.push({
      id,
      date,
      amount,
      donorName,
      emailRaw: rawEmail,
      emailCensored: censorEmail(rawEmail),
      category,
      notes,
      status,
      monthPeriod,
      monthDisplay,
    });
  }

  // Sort by date descending
  return records.sort((a, b) => (b.date > a.date ? 1 : -1));
}


/**
 * Generate CSV publik yang aman (Email tersensor, siap didownload publik)
 */
export function generatePublicCsv(donations: DonationRecord[]): string {
  const header = "ID_Donasi,Tanggal,Nominal_IDR,Donatur,Email_Disensor,Program_Kategori,Keterangan,Status";
  const rows = donations.map((d) => {
    const cleanNotes = d.notes.replace(/"/g, '""');
    const cleanName = d.donorName.replace(/"/g, '""');
    return `"${d.id}","${d.date}",${d.amount},"${cleanName}","${d.emailCensored}","${d.category}","${cleanNotes}","${d.status}"`;
  });
  return [header, ...rows].join("\r\n");
}
