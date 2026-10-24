import type { MetadataRoute } from 'next';
import { profile } from '@/data/profile';

export const dynamic = 'force-static';

// One-page site: the home page is the only URL search engines need.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: profile.siteUrl, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 }];
}
