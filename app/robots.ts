import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/', '/settings/', '/billing/', '/transactions/', '/invoices/'],
    },
    sitemap: 'https://merfreee.vercel.app/sitemap.xml',
  };
}
