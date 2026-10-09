import { getPageMetadata } from "@/lib/page-metadata";
import GalleryView from "@/components/GalleryView";
import { getGalleryItems } from "@/lib/content";
import { getRequestLocale, type LocaleParams } from "@/lib/request-locale";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: LocaleParams) {
  return getPageMetadata(await getRequestLocale(params), "/gallery", "Gallery");
}

export default async function GalleryPage({ params }: LocaleParams) {
  const items = await getGalleryItems(await getRequestLocale(params));
  return <GalleryView items={items} />;
}
