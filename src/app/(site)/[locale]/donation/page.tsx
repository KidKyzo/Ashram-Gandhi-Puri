import { getPageMetadata } from "@/lib/page-metadata";
import React from "react";
import DonationView from "@/components/DonationView";
import { getSiteSettings } from "@/lib/content";
import { getRequestLocale, type LocaleParams } from "@/lib/request-locale";

export async function generateMetadata({ params }: LocaleParams) {
  return getPageMetadata(await getRequestLocale(params), "/donation", "Donate");
}

export default async function DonationPage({ params }: LocaleParams) {
  const settings = await getSiteSettings(await getRequestLocale(params));
  return <DonationView settings={settings} />;
}
