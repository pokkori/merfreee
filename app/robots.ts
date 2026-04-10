import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/'],
    },
    sitemap: 'https://merfreee.vercel.app/sitemap.xml',
    host: 'https://merfreee.vercel.app',
  };
}
