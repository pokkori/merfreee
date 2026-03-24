import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://ecross-arbitrage.vercel.app', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: 'https://ecross-arbitrage.vercel.app/pricing', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://ecross-arbitrage.vercel.app/categories', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://ecross-arbitrage.vercel.app/legal/privacy', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: 'https://ecross-arbitrage.vercel.app/legal/terms', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: 'https://ecross-arbitrage.vercel.app/legal/tokusho', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];
}
