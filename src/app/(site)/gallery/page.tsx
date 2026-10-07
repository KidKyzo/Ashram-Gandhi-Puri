import GalleryView from "@/components/GalleryView";
import { getGalleryItems } from "@/lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function GalleryPage() {
  const items = await getGalleryItems();
  return <GalleryView items={items} />;
}
