import React from "react";
import DonationView from "@/components/DonationView";
import { getSiteSettings } from "@/lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DonationPage() {
  const settings = await getSiteSettings();
  return <DonationView settings={settings} />;
}
