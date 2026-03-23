import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://merfreee.vercel.app', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://merfreee.vercel.app/legal/privacy', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: 'https://merfreee.vercel.app/legal/terms', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: 'https://merfreee.vercel.app/legal/tokusho', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];
}
