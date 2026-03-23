import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MerFreee | メルカリShops × 弥生・freee 自動連携',
  description: 'メルカリShopsの売上を弥生・freeeに自動連携。インボイス対応の適格請求書を自動生成。記帳作業ゼロへ。月額980円から。',
  keywords: ['メルカリShops', '弥生会計', 'freee', 'インボイス', '自動連携', '記帳自動化', '適格請求書'],
  metadataBase: new URL('https://merfreee.vercel.app'),
  openGraph: {
    title: 'MerFreee | メルカリShops売上を会計ソフトに自動連携',
    description: 'インボイス対応・弥生・freee両対応・メルカリShops専用の会計自動化SaaS',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'MerFreee' }],
    locale: 'ja_JP',
    type: 'website',
    siteName: 'MerFreee',
    url: 'https://merfreee.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MerFreee | メルカリShops × 弥生・freee 自動連携',
    description: 'インボイス対応・弥生・freee両対応の会計自動化SaaS',
    images: ['/og.png'],
  },
  alternates: { canonical: 'https://merfreee.vercel.app' },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
