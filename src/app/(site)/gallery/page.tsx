import GalleryView from "@/components/GalleryView";
import { getGalleryItems } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const items = await getGalleryItems();
  return <GalleryView items={items} />;
}
