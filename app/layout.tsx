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

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '越境アービトラージとは？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '日本国内で安く買える商品と海外で高く売れる商品の価格差をAIが毎日発掘し、その情報リストを提供するサービスです。',
      },
    },
    {
      '@type': 'Question',
      name: 'メルカリの規約に違反しませんか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '本サービスはメルカリAPIへの直接アクセスは行いません。eBay公開API・楽天API等の公開データのみを使用した価格差情報の提供です。',
      },
    },
    {
      '@type': 'Question',
      name: '無料トライアルはありますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '7日間の無料トライアルをご用意しています。クレジットカード不要で今すぐ開始できます。',
      },
    },
    {
      '@type': 'Question',
      name: '初心者でも稼げますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい。各商品にはeBay出品用の推奨英語キーワード・推奨価格帯・注意点をAIが自動生成します。eBay出品経験がゼロでも、リストを見ながら始められる設計です。',
      },
    },
    {
      '@type': 'Question',
      name: '月額以外の料金はかかりますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'サービス利用料は月額1,980円（Standard）または4,980円（Pro）のみです。仕入れ費用・eBay出品手数料はユーザー様の実費となります。',
      },
    },
    {
      '@type': 'Question',
      name: '年間プランはありますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい。Standard年間プラン¥19,800/年（月払い比17%オフ）とPro年間プラン¥49,800/年をご用意しています。まとめて支払うことで毎月節約できます。',
      },
    },
    {
      '@type': 'Question',
      name: 'どのくらいの利益が期待できますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '掲載商品の平均ROIは180%です。仕入れ価格・送料・eBay手数料・PayPal手数料・為替マージンを考慮した利益シミュレーターで事前確認が可能です。',
      },
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
