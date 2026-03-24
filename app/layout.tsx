import type { Metadata } from 'next';
import './globals.css';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: '越境アービトラージ',
  description: 'メルカリ等で安く買ってeBayで高く売る。AIが毎日更新する価格差情報リストで副業収入を最大化。7日間無料トライアル。',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: 'https://ecross-arbitrage.vercel.app',
  offers: {
    '@type': 'Offer',
    price: '1980',
    priceCurrency: 'JPY',
    description: '月額1,980円（7日間無料トライアルあり）',
  },
  inLanguage: 'ja',
  author: { '@type': 'Organization', name: '越境アービトラージ' },
};

export const metadata: Metadata = {
  title: '越境アービトラージ | AIが毎日発掘する海外で売れるお宝リスト',
  description: 'メルカリ等で安く買ってeBayで高く売る。AIが毎日更新する価格差情報リストで副業収入を最大化。7日間無料トライアル。',
  keywords: ['越境EC', '転売', 'アービトラージ', 'eBay', 'メルカリ', '副業', '価格差', 'お宝', '輸出転売'],
  metadataBase: new URL('https://ecross-arbitrage.vercel.app'),
  openGraph: {
    title: '越境アービトラージ | AIお宝リスト配信',
    description: 'AIが毎日発掘する越境EC価格差情報。eBay×メルカリで確実に抜く。',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: '越境アービトラージ' }],
    locale: 'ja_JP',
    type: 'website',
    siteName: '越境アービトラージ',
    url: 'https://ecross-arbitrage.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: '越境アービトラージ | AIお宝リスト配信',
    description: 'AIが毎日発掘する越境EC価格差情報。eBay×メルカリで確実に抜く。',
    images: ['/opengraph-image'],
  },
  alternates: { canonical: 'https://ecross-arbitrage.vercel.app' },
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="skip-nav">
          メインコンテンツへスキップ
        </a>
        {children}
      </body>
    </html>
  );
}
