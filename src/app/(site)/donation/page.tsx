import React from "react";
import DonationView from "@/components/DonationView";
import { getSiteSettings } from "@/lib/content";

export const revalidate = 60;

export default async function DonationPage() {
  const settings = await getSiteSettings();
  return <DonationView settings={settings} />;
}
