import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/'],
    },
    sitemap: 'https://ecross-arbitrage.vercel.app/sitemap.xml',
    host: 'https://ecross-arbitrage.vercel.app',
  };
}
