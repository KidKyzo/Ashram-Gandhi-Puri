/**
 * Content models. These are the contract between the website and its data
 * source (static files today, a CMS later). Mirror these as CMS collections.
 */

export interface Milestone {
  year: string;
  title: string;
  description: string;
}

export interface GalleryItem {
  alt?: string;
  id: string;
  image: string;
  title: string;
  /** Sortable value, e.g. "2026-04" */
  date: string;
  /** Human readable, e.g. "April 2026" */
  date_display: string;
  description: string;
  source: string;
}

export interface SiteSettingsData {
  siteTitle: string;
  siteDescription: string;
  contactEmail: string;
  address: string;
  googleMapsUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroFact1: string;
  heroFact2: string;
  heroFact3: string;
  founderEyebrow: string;
  founderName: string;
  founderBio: string;
  founderAwards: Array<{ award: string }>;
  bankName: string;
  accountNumber: string;
  accountName: string;
  donationSubtitle: string;
}
