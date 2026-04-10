import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://merfreee.vercel.app', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: 'https://merfreee.vercel.app/pricing', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://merfreee.vercel.app/categories', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://merfreee.vercel.app/legal/privacy', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: 'https://merfreee.vercel.app/legal/terms', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: 'https://merfreee.vercel.app/legal/tokusho', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: 'https://merfreee.vercel.app/alerts', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://merfreee.vercel.app/dashboard', lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ];
}
