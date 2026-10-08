import React from "react";
import DonationView from "@/components/DonationView";
import { getSiteSettings } from "@/lib/content";
import { getDonationData } from "@/lib/donations.server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DonationPage() {
  const [settings, { donations, summary }] = await Promise.all([
    getSiteSettings(),
    getDonationData(),
  ]);

  return (
    <DonationView
      settings={settings}
      initialDonations={donations}
      summary={summary}
    />
  );
}
