import VolunteerView from "@/components/VolunteerView";
import { getRequestLocale, type LocaleParams } from "@/lib/request-locale";
import { getPageMetadata } from "@/lib/page-metadata";

export async function generateMetadata({ params }: LocaleParams) {
  return getPageMetadata(await getRequestLocale(params), "/volunteer", "Volunteer");
}

export default async function VolunteerPage({ params }: LocaleParams) {
  await getRequestLocale(params);
  return <VolunteerView />;
}
