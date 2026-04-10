import type { Metadata } from 'next';
import './globals.css';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: '越境アービトラージ',
  description: 'メルカリ等で安く買ってeBayで高く売る。AIが毎日更新する価格差情報リストで副業収入を最大化。7日間無料トライアル。',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: 'https://merfreee.vercel.app',
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
  metadataBase: new URL('https://merfreee.vercel.app'),
  openGraph: {
    title: '越境アービトラージ | AIお宝リスト配信',
    description: 'AIが毎日発掘する越境EC価格差情報。eBay×メルカリで確実に抜く。',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: '越境アービトラージ' }],
    locale: 'ja_JP',
    type: 'website',
    siteName: '越境アービトラージ',
    url: 'https://merfreee.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: '越境アービトラージ | AIお宝リスト配信',
    description: 'AIが毎日発掘する越境EC価格差情報。eBay×メルカリで確実に抜く。',
    images: ['/opengraph-image'],
  },
  alternates: { canonical: 'https://merfreee.vercel.app' },
  robots: {
    index: true,
    follow: true,
  },
};

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': [
    {
      '@type': 'Question',
      'name': '越境アービトラージとは何ですか？',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'メルカリ・ヤフオクなど国内フリマで安く仕入れ、eBay・Amazonなど海外マーケットで高く販売する価格差ビジネスをAIがサポートするサービスです。AIが毎日価格差のある商品リストを自動更新します。'
      }
    },
    {
      '@type': 'Question',
      'name': '月額料金はいくらですか？',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': '月額¥1,980（税込）です。7日間の無料トライアルがあり、クレジットカード不要で始められます。'
      }
    },
    {
      '@type': 'Question',
      'name': '副業として月いくら稼げますか？',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'AIが毎日更新する価格差リストを活用することで、副業として月¥5万〜¥10万の収入を目指せます。実績はユーザーの作業量・在庫管理・販売スキルによって異なります。'
      }
    },
    {
      '@type': 'Question',
      'name': 'eBayの出品経験がなくても始められますか？',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'はい。eBayアカウント作成から出品方法まで解説ガイドを提供しています。日本語で手順を確認しながら始められます。'
      }
    },
  ]
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
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
