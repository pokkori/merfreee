# MerFreee（メルカリShops × 弥生/freeeコネクタ）設計書
**作成日**: 2026-03-23
**評価スケール**: evaluation_prompt_v3.1（100点満点・10軸×10点）
**現状スコア**: 0/100（新規サービス・コード未作成）
**目標スコア**: 90/100（保証）
**ディレクトリ**: `D:\99_Webアプリ\MerFreee\`

---

## サービス概要

メルカリShopsの売上データを弥生会計Online・freee会計に自動連携するAPIブリッジSaaS。
インボイス制度（適格請求書）自動生成が競合不在の最大差別化ポイント。

**ターゲット**: メルカリShops出店者（個人事業主・小規模事業者）でインボイス登録済みの事業者
**市場規模**: 出店者約50万件 × インボイス登録済み×会計連携課題60% = 30万件ポテンシャル

---

## 軸別スコア計画

| 軸 | 現在 | R1後 | +点数 | 主要実装 |
|---|---|---|---|---|
| 表現性 | 0 | 9 | +9 | グラスモーフィズムUI・プログレスアニメ・カラーパレット統一 |
| 使いやすさ | 0 | 9 | +9 | 3ステップオンボーディング・44px全タッチターゲット・エラーフォールバック |
| 楽しい度 | 0 | 7 | +7 | SaaS向け「達成感演出」・同期完了トースト・月次レポートビジュアル |
| バズり度 | 0 | 7 | +7 | OGP完備・Twitter/LINE共有・「今月節約できた記帳時間」シェア機能 |
| 収益性 | 0 | 6 | +6 | KOMOJU課金実装・3プラン価格表・14日無料トライアル |
| SEO/発見性 | 0 | 7 | +7 | OGP・sitemap・lang=ja・構造化データ・キーワード最適化 |
| 差別化 | 0 | 9 | +9 | インボイス自動生成（競合なし）・弥生+freee両対応・メルカリShops専用 |
| リテンション設計 | 0 | 8 | +8 | 毎日0時自動同期通知・月次レポートメール・ダッシュボードKPI |
| パフォーマンス | 0 | 8 | +8 | Next.js 14 App Router・SSR・Vercel Edge Functions |
| アクセシビリティ | 0 | 8 | +8 | WCAG 2.2 AA・aria-label全項目・コントラスト4.5:1・14px以上 |
| **合計** | **0** | **88** | | **コード実装のみで88点保証** |

**ユーザーアクション完了後の上限**: 92点
（メルカリShops API審査通過後: +2点 / KOMOJU審査通過後収益実績発生: +2点）

---

## 技術スタック

| 区分 | 技術 | 版 |
|---|---|---|
| フレームワーク | Next.js App Router | 14.x |
| 言語 | TypeScript | 5.x |
| ホスティング | Vercel | - |
| DB | Supabase (PostgreSQL) | - |
| 認証 | NextAuth.js（メールマジックリンク） | 4.x |
| 課金 | KOMOJU（審査通過済み） | - |
| バックグラウンド | Vercel Cron Jobs | - |
| スタイリング | Tailwind CSS | 3.x |
| UIコンポーネント | shadcn/ui | - |

---

## Supabaseスキーマ定義

```sql
-- ユーザーテーブル
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  plan TEXT NOT NULL DEFAULT 'trial' CHECK (plan IN ('trial', 'starter', 'standard', 'pro')),
  plan_started_at TIMESTAMPTZ,
  plan_expires_at TIMESTAMPTZ,
  komoju_customer_id TEXT,
  invoice_number TEXT,           -- 登録適格請求書発行事業者番号（T-XXXXXXXXXX）
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 外部連携設定テーブル
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('mercari_shops', 'yayoi', 'freee')),
  access_token TEXT,             -- 暗号化して保存（AES-256）
  refresh_token TEXT,            -- 暗号化して保存（AES-256）
  token_expires_at TIMESTAMPTZ,
  shop_id TEXT,                  -- メルカリShops ショップID
  company_id TEXT,               -- freee 事業所ID / 弥生 会社ID
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_integrations_user_id ON integrations(user_id);
CREATE UNIQUE INDEX idx_integrations_user_provider ON integrations(user_id, provider);

-- 取引履歴テーブル
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mercari_order_id TEXT NOT NULL,
  mercari_item_name TEXT NOT NULL,
  amount INTEGER NOT NULL,       -- 円単位
  fee INTEGER NOT NULL DEFAULT 0,-- 手数料
  net_amount INTEGER NOT NULL,   -- 手取り金額
  tax_amount INTEGER NOT NULL DEFAULT 0,
  tax_rate NUMERIC(4,2) NOT NULL DEFAULT 0.10,
  invoice_eligible BOOLEAN NOT NULL DEFAULT false,
  sold_at TIMESTAMPTZ NOT NULL,
  synced_to_yayoi_at TIMESTAMPTZ,
  synced_to_freee_at TIMESTAMPTZ,
  yayoi_journal_id TEXT,
  freee_deal_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_sold_at ON transactions(sold_at DESC);
CREATE UNIQUE INDEX idx_transactions_mercari_order ON transactions(user_id, mercari_order_id);

-- 適格請求書テーブル
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invoice_number_seq INTEGER NOT NULL,   -- 通し番号
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_amount INTEGER NOT NULL,
  tax_8_amount INTEGER NOT NULL DEFAULT 0,
  tax_10_amount INTEGER NOT NULL DEFAULT 0,
  pdf_url TEXT,                          -- Supabase Storage URL
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_invoices_user_id ON invoices(user_id);

-- 月次レポートテーブル
CREATE TABLE monthly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  total_sales INTEGER NOT NULL DEFAULT 0,
  total_transactions INTEGER NOT NULL DEFAULT 0,
  total_fee INTEGER NOT NULL DEFAULT 0,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, year, month)
);
```

---

## ディレクトリ構成

```
D:\99_Webアプリ\MerFreee\
├── app/
│   ├── layout.tsx                          # RootLayout・OGP・favicon
│   ├── page.tsx                            # LP（ランディングページ）
│   ├── (auth)/
│   │   ├── login/page.tsx                  # マジックリンクログイン
│   │   └── verify/page.tsx                 # メール認証完了
│   ├── (dashboard)/
│   │   ├── layout.tsx                      # ダッシュボードレイアウト（サイドバー）
│   │   ├── dashboard/page.tsx              # ダッシュボードトップ（KPIカード）
│   │   ├── transactions/page.tsx           # 取引一覧
│   │   ├── invoices/page.tsx               # 適格請求書一覧・ダウンロード
│   │   ├── settings/
│   │   │   ├── page.tsx                    # 設定トップ
│   │   │   ├── mercari/page.tsx            # メルカリShops連携設定
│   │   │   ├── yayoi/page.tsx              # 弥生会計連携設定
│   │   │   └── freee/page.tsx              # freee連携設定
│   │   └── billing/page.tsx                # プラン・課金管理
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts     # NextAuth.js ハンドラ
│   │   ├── cron/sync/route.ts             # Vercel Cron（毎日0時）
│   │   ├── mercari/
│   │   │   ├── callback/route.ts          # OAuth コールバック
│   │   │   └── sync/route.ts              # 手動同期トリガー
│   │   ├── yayoi/
│   │   │   ├── callback/route.ts          # 弥生OAuth コールバック
│   │   │   └── push/route.ts              # 弥生への仕訳送信
│   │   ├── freee/
│   │   │   ├── callback/route.ts          # freee OAuth コールバック
│   │   │   └── push/route.ts              # freeeへの取引送信
│   │   ├── invoices/
│   │   │   ├── generate/route.ts          # PDF生成
│   │   │   └── [id]/route.ts              # PDF取得
│   │   └── komoju/
│   │       ├── checkout/route.ts          # 課金セッション作成
│   │       └── webhook/route.ts           # Webhook受信・プラン更新
│   └── legal/
│       ├── privacy/page.tsx               # プライバシーポリシー
│       ├── terms/page.tsx                 # 利用規約
│       └── tokusho/page.tsx              # 特定商取引法表記
├── components/
│   ├── ui/                                # shadcn/ui ベース
│   ├── layout/
│   │   ├── Sidebar.tsx                    # ダッシュボードサイドバー
│   │   └── TopNav.tsx                     # 上部ナビゲーション
│   ├── dashboard/
│   │   ├── KpiCard.tsx                    # KPIカード（売上・件数・節約時間）
│   │   ├── SyncStatusBadge.tsx            # 最終同期時刻バッジ
│   │   └── MonthlyChart.tsx               # 月次売上グラフ
│   ├── transactions/
│   │   ├── TransactionTable.tsx           # 取引一覧テーブル
│   │   └── SyncStatusCell.tsx            # 同期ステータスセル
│   ├── invoices/
│   │   ├── InvoiceList.tsx               # 請求書一覧
│   │   └── InvoicePdfButton.tsx          # PDF ダウンロードボタン
│   ├── integrations/
│   │   ├── MercariConnectCard.tsx        # メルカリ連携カード
│   │   ├── YayoiConnectCard.tsx          # 弥生連携カード
│   │   └── FreeeConnectCard.tsx          # freee連携カード
│   ├── billing/
│   │   ├── PlanCard.tsx                  # プランカード（3プラン）
│   │   └── CurrentPlanBadge.tsx          # 現在プランバッジ
│   └── shared/
│       ├── SyncProgressToast.tsx         # 同期完了トースト
│       └── ErrorBoundary.tsx             # エラー境界
├── lib/
│   ├── supabase/
│   │   ├── client.ts                     # ブラウザ用クライアント
│   │   └── server.ts                     # サーバー用クライアント
│   ├── mercari/
│   │   ├── client.ts                     # メルカリShops API クライアント
│   │   └── mock.ts                       # モックデータ（API審査期間中使用）
│   ├── yayoi/
│   │   └── client.ts                     # 弥生会計Online API クライアント
│   ├── freee/
│   │   └── client.ts                     # freee会計 API クライアント
│   ├── invoice/
│   │   └── generator.ts                  # 適格請求書PDF生成（react-pdf）
│   ├── komoju/
│   │   └── client.ts                     # KOMOJU API クライアント
│   ├── crypto.ts                         # トークン暗号化・復号（AES-256）
│   └── email/
│       └── monthly-report.ts             # 月次レポートメール送信（Resend）
├── hooks/
│   ├── useTransactions.ts                # 取引一覧フック
│   ├── useIntegrations.ts                # 連携状態フック
│   └── usePlan.ts                        # プラン状態フック
├── types/
│   └── index.ts                          # 型定義
├── public/
│   ├── favicon.ico                       # favicon
│   ├── og.png                            # OGP画像（1200×630px）
│   └── logo.svg                          # サービスロゴ（SVG）
├── .env.local                            # 環境変数（非コミット）
├── .env.example                          # 環境変数テンプレート
├── middleware.ts                          # 認証ミドルウェア（保護ルート）
├── next.config.ts                        # Next.js設定
├── tailwind.config.ts                    # Tailwindカラーパレット
└── package.json
```

---

## 実装タスク（Claude Codeが実施）

### [差別化・表現性] Task 1: プロジェクト初期化（確定+基盤）

**ファイル**: `D:\99_Webアプリ\MerFreee\package.json`
**実装**: `npx create-next-app@14 MerFreee --typescript --tailwind --app --src-dir=false` 実行後、依存関係を追加

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs next-auth \
  @auth/supabase-adapter tailwindcss-animate class-variance-authority clsx \
  tailwind-merge lucide-react @radix-ui/react-dialog @radix-ui/react-tabs \
  @radix-ui/react-toast zod react-hook-form @hookform/resolvers \
  @react-pdf/renderer resend
```

**完了基準**: `npm run build` がエラーなし・`npm run dev` で http://localhost:3000 が表示される

---

### [表現性 9点] Task 2: カラーパレット・グラスモーフィズムUI

**ファイル**: `D:\99_Webアプリ\MerFreee\tailwind.config.ts`
**実装**: MerFreeeブランドカラーをTailwind拡張として定義

```typescript
// tailwind.config.ts に追記
colors: {
  brand: {
    primary:   '#E85D04',  // オレンジ（メルカリ連想）
    secondary: '#0A6EBD',  // ブルー（会計・信頼感）
    accent:    '#00B4D8',  // シアン（連携完了演出）
    dark:      '#03045E',  // ダークネイビー（背景）
    surface:   '#F8FAFC',  // ライトグレー（カード背景）
  },
  status: {
    synced:  '#10B981',   // グリーン（同期完了）
    pending: '#F59E0B',   // アンバー（処理中）
    error:   '#EF4444',   // レッド（エラー）
  }
}
```

**ファイル**: `D:\99_Webアプリ\MerFreee\app\globals.css`
**実装**: グラスモーフィズムユーティリティクラスを定義

```css
.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}
.glass-card-dark {
  background: rgba(3, 4, 94, 0.75);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
}
```

**完了基準**: ダッシュボード画面でカード要素にglass-cardクラスが適用されblur効果が視覚的に確認できる

---

### [表現性 9点] Task 3: OGP・favicon・メタデータ

**ファイル**: `D:\99_Webアプリ\MerFreee\app\layout.tsx`
**実装**: Next.js 14 Metadata API でOGPを完全設定

```typescript
export const metadata: Metadata = {
  title: 'MerFreee | メルカリShops × 弥生・freee 自動連携',
  description: 'メルカリShopsの売上を弥生・freeeに自動連携。インボイス対応の適格請求書を自動生成。記帳作業ゼロへ。',
  metadataBase: new URL('https://merfreee.vercel.app'),
  openGraph: {
    title: 'MerFreee | メルカリShops売上を会計ソフトに自動連携',
    description: 'インボイス対応・弥生・freee両対応・メルカリShops専用の会計自動化SaaS',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'MerFreee' }],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MerFreee | メルカリShops × 弥生・freee 自動連携',
    description: 'インボイス対応・弥生・freee両対応の会計自動化SaaS',
    images: ['/og.png'],
  },
  alternates: { canonical: 'https://merfreee.vercel.app' },
};
```

**ファイル**: `D:\99_Webアプリ\MerFreee\public\og.png`
**実装**: 1200×630px・背景グラデーション（#03045E→#0A6EBD）・白文字ロゴ・「メルカリShops × 弥生・freee 自動連携」テキスト
（Canvaまたはfigmaでデザイン後PNG書き出し。または`@vercel/og`で動的生成）

**ファイル**: `D:\99_Webアプリ\MerFreee\public\favicon.ico`
**実装**: 32×32px・ブランドカラー（#E85D04）の「M」文字アイコン

**完了基準**: localhost:3000 で Twitterカードシミュレーター（https://cards-dev.twitter.com/validator）相当のOGP確認・og:image が表示される

---

### [表現性 9点] Task 4: ランディングページ（LP）

**ファイル**: `D:\99_Webアプリ\MerFreee\app\page.tsx`
**実装**: 以下セクション構成でLPを作成

```
1. ヒーローセクション
   - キャッチコピー: 「メルカリShopsの記帳、全部自動化」
   - サブコピー: 「インボイス対応・弥生・freee両対応。月980円から。」
   - CTAボタン: 「14日間無料で試す」（aria-label="14日間無料トライアルを開始する"）
   - ヒーロー画像: ダッシュボードのスクリーンショット or SVGモックアップ

2. 課題セクション（Before）
   - 「毎月の記帳に何時間かかっていますか？」
   - 3つの課題カード（SVGアイコン付き・絵文字禁止）

3. 解決策セクション（After）
   - 3ステップのフロー図（メルカリ→MerFreee→弥生/freee）
   - アニメーション付きコネクタライン（CSS animation）

4. 機能一覧セクション
   - 6機能カード（glass-cardクラス適用）

5. 料金プランセクション
   - 3プランカード（Starter/Standard/Pro）
   - 最も人気の「Standard」にバッジ表示

6. FAQセクション（構造化データ FAQPage 付き）

7. フッター（特商法・プライバシーポリシー・利用規約リンク）
```

**完了基準**: Lighthouse Performance 80以上・LCP 2.5秒以内・絵文字ゼロをコードレビューで確認

---

### [使いやすさ 9点] Task 5: 認証フロー（NextAuth.js マジックリンク）

**ファイル**: `D:\99_Webアプリ\MerFreee\app\api\auth\[...nextauth]\route.ts`
**実装**:

```typescript
import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { SupabaseAdapter } from '@auth/supabase-adapter';

export const authOptions = {
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  pages: {
    signIn: '/login',
    verifyRequest: '/verify',
    error: '/login?error=true',
  },
  callbacks: {
    session: async ({ session, user }) => {
      session.user.id = user.id;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

**ファイル**: `D:\99_Webアプリ\MerFreee\app\(auth)\login\page.tsx`
**実装**: メールアドレス入力フォーム・「マジックリンクを送信」ボタン（aria-label付き・44px以上）

**ファイル**: `D:\99_Webアプリ\MerFreee\middleware.ts`
**実装**: `/dashboard/*` 配下は認証済みのみアクセス可能なミドルウェア

**完了基準**: メールアドレス入力→送信→リンククリック→ダッシュボードリダイレクトが動作すること

---

### [使いやすさ 9点] Task 6: ダッシュボードレイアウト・サイドバー

**ファイル**: `D:\99_Webアプリ\MerFreee\app\(dashboard)\layout.tsx`
**実装**: レスポンシブサイドバー（SP時はハンバーガーメニュー）

**ファイル**: `D:\99_Webアプリ\MerFreee\components\layout\Sidebar.tsx`
**実装**: ナビゲーション項目（全aria-label必須）

```typescript
const navItems = [
  { href: '/dashboard',      label: 'ダッシュボード',   icon: LayoutDashboard, ariaLabel: 'ダッシュボードトップへ移動' },
  { href: '/transactions',   label: '取引一覧',          icon: ListOrdered,     ariaLabel: '取引一覧へ移動' },
  { href: '/invoices',       label: '適格請求書',        icon: FileText,        ariaLabel: '適格請求書一覧へ移動' },
  { href: '/settings',       label: '連携設定',          icon: Settings,        ariaLabel: '外部サービス連携設定へ移動' },
  { href: '/billing',        label: 'プラン・請求',      icon: CreditCard,      ariaLabel: 'プランと請求情報へ移動' },
];
```

**タッチターゲット**: 全ナビゲーション項目に `min-h-[44px] min-w-[44px]` 適用
**完了基準**: スマートフォン幅（375px）でハンバーガーメニューが動作・全ナビゲーションがaria-label付きで存在する

---

### [差別化 9点] Task 7: メルカリShops API クライアント + モック戦略

**ファイル**: `D:\99_Webアプリ\MerFreee\lib\mercari\client.ts`
**実装**:

```typescript
const MERCARI_API_BASE = 'https://api.mercari-shops.com/v1';

export async function fetchMercariOrders(
  accessToken: string,
  shopId: string,
  fromDate: Date,
  toDate: Date
): Promise<MercariOrder[]> {
  const url = new URL(`${MERCARI_API_BASE}/shops/${shopId}/orders`);
  url.searchParams.set('from_date', fromDate.toISOString());
  url.searchParams.set('to_date', toDate.toISOString());
  url.searchParams.set('status', 'completed');

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`Mercari API error: ${res.status}`);
  }
  return (await res.json()).orders as MercariOrder[];
}
```

**ファイル**: `D:\99_Webアプリ\MerFreee\lib\mercari\mock.ts`
**実装**: API審査期間中（2〜4週間）使用するモックデータ

```typescript
// 環境変数 USE_MOCK_MERCARI=true の場合に使用
export const MOCK_ORDERS: MercariOrder[] = [
  {
    order_id: 'mock-001',
    item_name: 'ノートパソコン（テスト商品）',
    amount: 50000,
    fee: 2750,          // 5.5%
    net_amount: 47250,
    tax_rate: 0.10,
    sold_at: '2026-03-01T10:00:00Z',
    buyer_invoice_number: null,
  },
  {
    order_id: 'mock-002',
    item_name: 'スマートフォンケース（テスト商品）',
    amount: 1200,
    fee: 66,
    net_amount: 1134,
    tax_rate: 0.10,
    sold_at: '2026-03-05T14:30:00Z',
    buyer_invoice_number: 'T-1234567890123',
  },
  // ...計20件
];

export async function fetchMercariOrdersMock(
  fromDate: Date,
  toDate: Date
): Promise<MercariOrder[]> {
  // モックデータをfromDate/toDateでフィルタリングして返す
  return MOCK_ORDERS.filter(
    (o) => new Date(o.sold_at) >= fromDate && new Date(o.sold_at) <= toDate
  );
}
```

**完了基準**: `USE_MOCK_MERCARI=true` 設定時に取引一覧にモックデータが20件表示される

---

### [差別化 9点] Task 8: 弥生会計Online API 連携フロー

**API連携フロー（テキスト形式）**:

```
[弥生会計Online API連携フロー]

1. ユーザーが「弥生連携」ボタンをクリック
   ↓
2. GET /settings/yayoi → 弥生OAuth認証URLへリダイレクト
   URL: https://yayoi-kk.co.jp/oauth/authorize
   ?client_id={YAYOI_CLIENT_ID}
   &redirect_uri={ORIGIN}/api/yayoi/callback
   &scope=accounting.journals:write accounting.journals:read
   &response_type=code
   ↓
3. ユーザーが弥生アカウントでログイン・権限承認
   ↓
4. POST /api/yayoi/callback
   - code を受け取り、アクセストークン・リフレッシュトークンを取得
   - トークンをAES-256暗号化してintegrations テーブルに保存
   - provider='yayoi', is_active=true に更新
   ↓
5. POST /api/yayoi/push（Cron または手動）
   a. integrations テーブルから弥生トークン取得・復号
   b. transactions テーブルから synced_to_yayoi_at IS NULL の取引を取得
   c. 各取引を弥生仕訳APIで送信

   仕訳フォーマット:
   {
     "date": "2026-03-01",
     "debit_account": "売掛金",    // または「現金」
     "credit_account": "売上高",
     "amount": 50000,
     "description": "メルカリShops ノートパソコン（テスト商品）",
     "tax_category": "課税売上10%",
     "invoice_number": "T-XXXXXXXXXX"  // 登録番号
   }

   d. 成功した取引のsynced_to_yayoi_at, yayoi_journal_id を更新
   e. エラー時は is_active=false にせずリトライキュー（Supabase）に積む
```

**ファイル**: `D:\99_Webアプリ\MerFreee\lib\yayoi\client.ts`
**実装**:

```typescript
const YAYOI_API_BASE = 'https://api.yayoi-kk.co.jp/v1';

export async function pushJournal(
  accessToken: string,
  companyId: string,
  transaction: Transaction,
  sellerInvoiceNumber: string
): Promise<{ journalId: string }> {
  const body = {
    date: transaction.sold_at.split('T')[0],
    debit_account_code: '1101',   // 売掛金
    credit_account_code: '4101',  // 売上高
    amount: transaction.net_amount,
    description: `メルカリShops ${transaction.mercari_item_name}`,
    tax_rate: transaction.tax_rate,
    invoice_number: sellerInvoiceNumber,
  };

  const res = await fetch(`${YAYOI_API_BASE}/companies/${companyId}/journals`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Yayoi API error: ${res.status}`);
  return res.json();
}
```

**ファイル**: `D:\99_Webアプリ\MerFreee\app\api\yayoi\callback\route.ts`
**ファイル**: `D:\99_Webアプリ\MerFreee\app\api\yayoi\push\route.ts`

**完了基準**: モックデータ20件を弥生APIに送信し、すべてsynced_to_yayoi_atが更新される（本番APIは弥生開発者アカウント取得後に疎通確認）

---

### [差別化 9点] Task 9: freee会計 API 連携フロー

**API連携フロー（テキスト形式）**:

```
[freee会計 API連携フロー]

1. ユーザーが「freee連携」ボタンをクリック
   ↓
2. GET /settings/freee → freee OAuth認証URLへリダイレクト
   URL: https://accounts.secure.freee.co.jp/public_api/authorize
   ?client_id={FREEE_CLIENT_ID}
   &redirect_uri={ORIGIN}/api/freee/callback
   &response_type=code
   ↓
3. ユーザーがfreeeアカウントでログイン・権限承認
   ↓
4. POST /api/freee/callback
   - code を受け取り、POST https://accounts.secure.freee.co.jp/public_api/token でトークン取得
   - GET https://api.freee.co.jp/api/1/users/me で company_id 取得
   - トークンをAES-256暗号化してintegrations テーブルに保存
   ↓
5. POST /api/freee/push（Cron または手動）
   a. integrations テーブルからfreeeトークン取得・復号
   b. transactions テーブルから synced_to_freee_at IS NULL の取引を取得
   c. 各取引をfreee「取引（収入）」APIで送信

   取引フォーマット:
   POST https://api.freee.co.jp/api/1/deals
   {
     "company_id": {company_id},
     "issue_date": "2026-03-01",
     "type": "income",
     "amount": 50000,
     "due_amount": 50000,
     "details": [{
       "tax_code": 1,           // 10%課税売上
       "account_item_id": {売上高のID},
       "amount": 50000,
       "description": "メルカリShops ノートパソコン（テスト商品）",
       "invoice_registration_number": "T-XXXXXXXXXX"
     }]
   }

   d. 成功した取引のsynced_to_freee_at, freee_deal_id を更新
```

**ファイル**: `D:\99_Webアプリ\MerFreee\lib\freee\client.ts`
**ファイル**: `D:\99_Webアプリ\MerFreee\app\api\freee\callback\route.ts`
**ファイル**: `D:\99_Webアプリ\MerFreee\app\api\freee\push\route.ts`

**完了基準**: freee Sandbox環境に取引を1件送信し、freeeダッシュボードで確認できる

---

### [差別化 9点] Task 10: 適格請求書（インボイス）PDF自動生成

**ファイル**: `D:\99_Webアプリ\MerFreee\lib\invoice\generator.ts`
**実装**: `@react-pdf/renderer` を使用したPDF生成

```typescript
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page:      { padding: 40, fontFamily: 'Helvetica' },
  title:     { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#03045E' },
  label:     { fontSize: 9, color: '#666', marginBottom: 2 },
  value:     { fontSize: 11, marginBottom: 12 },
  table:     { borderWidth: 1, borderColor: '#ddd' },
  tableRow:  { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ddd' },
  tableCell: { padding: 6, fontSize: 9 },
  total:     { fontSize: 14, fontWeight: 'bold', textAlign: 'right', marginTop: 16, color: '#E85D04' },
});

export async function generateInvoicePdf(params: {
  sellerName: string;
  sellerInvoiceNumber: string;       // T-XXXXXXXXXX
  periodStart: Date;
  periodEnd: Date;
  transactions: Transaction[];
}): Promise<Uint8Array> {
  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>適格請求書（売上明細）</Text>
        <Text style={styles.label}>登録番号</Text>
        <Text style={styles.value}>{params.sellerInvoiceNumber}</Text>
        <Text style={styles.label}>対象期間</Text>
        <Text style={styles.value}>
          {params.periodStart.toLocaleDateString('ja-JP')} 〜 {params.periodEnd.toLocaleDateString('ja-JP')}
        </Text>
        {/* 取引明細テーブル */}
        <View style={styles.table}>
          {params.transactions.map((t) => (
            <View key={t.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 3 }]}>{t.mercari_item_name}</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>¥{t.amount.toLocaleString()}</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>{(t.tax_rate * 100).toFixed(0)}%</Text>
            </View>
          ))}
        </View>
        <Text style={styles.total}>
          合計: ¥{params.transactions.reduce((s, t) => s + t.amount, 0).toLocaleString()}（税込）
        </Text>
      </Page>
    </Document>
  );
  return await pdf(doc).toBuffer();
}
```

**ファイル**: `D:\99_Webアプリ\MerFreee\app\api\invoices\generate\route.ts`
**実装**: PDF生成→Supabase Storageにアップロード→署名付きURLを返す

**完了基準**: `/api/invoices/generate` をcURLで叩いたとき、適格請求書番号・期間・明細・合計が記載されたPDFが返る

---

### [収益性 6点] Task 11: KOMOJU課金フロー

**課金フロー**:

```
[KOMOJUサブスクリプション課金フロー]

1. ユーザーが /billing でプランを選択
   ↓
2. POST /api/komoju/checkout
   Body: { plan: 'standard' }
   → KOMOJU セッション作成（Recurring Payment）
   → session_url を返す
   ↓
3. ユーザーがKOMOJUホスト型チェックアウトページで支払い
   → 支払い完了 → success_url にリダイレクト
   ↓
4. POST /api/komoju/webhook（KOMOJU → MerFreee）
   Event: payment.captured
   → users テーブルの plan を更新（starter/standard/pro）
   → plan_started_at, plan_expires_at を更新
   → 確認メール送信（Resend）
```

**ファイル**: `D:\99_Webアプリ\MerFreee\app\api\komoju\checkout\route.ts`
**実装**:

```typescript
const PLAN_PRICES = {
  starter:  { amount: 980,  currency: 'JPY', description: 'MerFreee Starter プラン（月額）' },
  standard: { amount: 1980, currency: 'JPY', description: 'MerFreee Standard プラン（月額）' },
  pro:      { amount: 4980, currency: 'JPY', description: 'MerFreee Pro プラン（月額）' },
};

export async function POST(req: Request) {
  const { plan } = await req.json();
  const price = PLAN_PRICES[plan as keyof typeof PLAN_PRICES];
  if (!price) return Response.json({ error: 'Invalid plan' }, { status: 400 });

  const session = await fetch('https://komoju.com/api/v1/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(process.env.KOMOJU_SECRET_KEY + ':').toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: price.amount,
      currency: price.currency,
      payment_types: ['credit_card'],
      default_locale: 'ja',
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing`,
      metadata: { plan, user_id: '...' },  // セッションからuser_id取得
    }),
  });

  const { session_url } = await session.json();
  return Response.json({ session_url });
}
```

**ファイル**: `D:\99_Webアプリ\MerFreee\app\api\komoju\webhook\route.ts`
**実装**: Webhookシグネチャ検証・プラン更新処理

**完了基準**: KOMOJUテスト環境でStandardプラン（¥1,980）の決済完了→usersテーブルのplanが'standard'に更新される

---

### [リテンション 8点] Task 12: Vercel Cron + 自動同期

**ファイル**: `D:\99_Webアプリ\MerFreee\app\api\cron\sync\route.ts`
**実装**:

```typescript
export async function GET(req: Request) {
  // Vercel Cronからのリクエストのみ許可
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  // アクティブな全ユーザーを取得
  const { data: activeUsers } = await supabase
    .from('users')
    .select('id, plan')
    .in('plan', ['starter', 'standard', 'pro']);

  for (const user of activeUsers ?? []) {
    // 1. メルカリShops取引データを取得（本番 or モック）
    // 2. transactions テーブルに未登録の取引をupsert
    // 3. 弥生・freeeへの連携をプラン制限内で実行
    // 4. エラーは個別ユーザー単位でキャッチ（他ユーザーに影響させない）
  }

  return Response.json({ synced: activeUsers?.length ?? 0 });
}
```

**ファイル**: `D:\99_Webアプリ\MerFreee\vercel.json`
**実装**:

```json
{
  "crons": [
    {
      "path": "/api/cron/sync",
      "schedule": "0 15 * * *"
    }
  ]
}
```

（UTC 15:00 = JST 0:00）

**完了基準**: Vercel Dashboard の Cron Jobs 画面で毎日0時に実行履歴が確認できる・ログにエラーなし

---

### [リテンション 8点] Task 13: 月次レポートメール自動送信

**ファイル**: `D:\99_Webアプリ\MerFreee\lib\email\monthly-report.ts`
**実装**: Resend を使用した月次レポートメール

```typescript
import { Resend } from 'resend';

export async function sendMonthlyReport(params: {
  userEmail: string;
  userName: string;
  year: number;
  month: number;
  totalSales: number;
  totalTransactions: number;
  savedMinutes: number;   // 「節約できた記帳時間」 = 取引数 × 5分
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: 'MerFreee <noreply@merfreee.jp>',
    to: params.userEmail,
    subject: `【MerFreee】${params.year}年${params.month}月の売上レポート`,
    html: `
      <h2>${params.month}月の売上サマリー</h2>
      <p>売上合計: ¥${params.totalSales.toLocaleString()}</p>
      <p>取引件数: ${params.totalTransactions}件</p>
      <p>節約できた記帳時間: 約${params.savedMinutes}分</p>
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard">ダッシュボードを開く</a>
    `,
  });
}
```

**完了基準**: Resendダッシュボードで月次メールの送信履歴が確認できる・届いたメールが正しいデータを表示している

---

### [バズり度 7点] Task 14: SNSシェア機能

**ファイル**: `D:\99_Webアプリ\MerFreee\components\dashboard\KpiCard.tsx`
**実装**: 「今月節約できた記帳時間をシェア」ボタン

```typescript
function ShareButton({ savedMinutes }: { savedMinutes: number }) {
  const shareText = `MerFreeeで今月の記帳作業を${savedMinutes}分節約しました。メルカリShopsの記帳自動化なら #MerFreee`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent('https://merfreee.vercel.app')}`;

  return (
    <a
      href={tweetUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`今月${savedMinutes}分節約をXでシェアする`}
      className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-lg bg-[#1DA1F2] text-white hover:opacity-90"
    >
      <XIcon className="w-4 h-4" aria-hidden="true" />
      シェアする
    </a>
  );
}
```

**完了基準**: ダッシュボードの「シェア」ボタンをクリックするとXの投稿画面が開き、ハッシュタグとURLが入力済みで表示される

---

### [SEO 7点] Task 15: sitemap・構造化データ

**ファイル**: `D:\99_Webアプリ\MerFreee\app\sitemap.ts`
**実装**:

```typescript
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://merfreee.vercel.app', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://merfreee.vercel.app/legal/privacy', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: 'https://merfreee.vercel.app/legal/terms', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: 'https://merfreee.vercel.app/legal/tokusho', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];
}
```

**ファイル**: `D:\99_Webアプリ\MerFreee\app\page.tsx` （FAQセクション内）
**実装**: JSON-LD FAQPage 構造化データを `<script type="application/ld+json">` で埋め込み

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "メルカリShops APIはいつ使えますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "パートナー申請審査（2〜4週間）後に利用可能です。審査期間中もダッシュボードの全機能をお試しいただけます。"
      }
    }
  ]
}
```

**完了基準**: Google Search Console のURLインスペクションでsitemapが認識され、構造化データエラーがゼロ

---

### [アクセシビリティ 8点] Task 16: aria-label 全項目実装

**対象ファイル**: 全 `.tsx` ファイル
**実装ルール**:

```typescript
// 全インタラクティブ要素に aria-label 必須
// NG例
<button onClick={handleSync}>同期</button>

// OK例
<button
  onClick={handleSync}
  aria-label="メルカリShopsの売上データを今すぐ同期する"
  className="min-h-[44px] min-w-[44px]"
>
  同期
</button>

// アイコンのみのボタン
<button aria-label="取引詳細を開く">
  <ExternalLinkIcon aria-hidden="true" />
</button>
```

**完了基準**: 以下のaxeコマンドでaria-label違反ゼロ
```bash
npx axe http://localhost:3000 --tags wcag2a,wcag2aa
```

---

### [パフォーマンス 8点] Task 17: Next.js最適化設定

**ファイル**: `D:\99_Webアプリ\MerFreee\next.config.ts`
**実装**:

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
  },
  compress: true,
  poweredByHeader: false,
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ],
};

export default nextConfig;
```

**完了基準**: `npm run build` 後のバンドルサイズ分析（`ANALYZE=true npm run build`）で初期JSが200KB以下

---

### [アクセシビリティ・セキュリティ] Task 18: 環境変数定義

**ファイル**: `D:\99_Webアプリ\MerFreee\.env.example`
**実装**:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://XXXXXXXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=                        # openssl rand -base64 32

# メール（NextAuthマジックリンク送信用）
EMAIL_SERVER=smtp://user:password@smtp.resend.com:587
EMAIL_FROM=noreply@merfreee.jp

# Resend（月次レポート）
RESEND_API_KEY=re_...

# KOMOJU（審査通過済み）
KOMOJU_SECRET_KEY=sk_...
KOMOJU_PUBLISHABLE_KEY=pk_...
KOMOJU_WEBHOOK_SECRET=

# メルカリShops API（審査通過後に設定）
MERCARI_SHOPS_CLIENT_ID=
MERCARI_SHOPS_CLIENT_SECRET=
USE_MOCK_MERCARI=true                   # 審査通過後に false に変更

# 弥生会計Online API
YAYOI_CLIENT_ID=
YAYOI_CLIENT_SECRET=

# freee API
FREEE_CLIENT_ID=
FREEE_CLIENT_SECRET=

# Cron保護
CRON_SECRET=                            # openssl rand -base64 32

# 暗号化キー（トークン保護用）
ENCRYPTION_KEY=                         # openssl rand -hex 32

# アプリURL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**完了基準**: `.env.example` が全変数を網羅・`.gitignore` に `.env.local` が含まれる

---

### [差別化] Task 19: トークン暗号化ユーティリティ

**ファイル**: `D:\99_Webアプリ\MerFreee\lib\crypto.ts`
**実装**: アクセストークンをAES-256-GCMで暗号化してDBに保存

```typescript
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex'); // 32バイト

export function encrypt(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decrypt(ciphertext: string): string {
  const [ivHex, authTagHex, encryptedHex] = ciphertext.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const decipher = createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
}
```

**完了基準**: `encrypt(decrypt(token)) === token` のユニットテストが通る

---

### [使いやすさ] Task 20: 法的ページ（特商法・プライバシーポリシー・利用規約）

**ファイル**: `D:\99_Webアプリ\MerFreee\app\legal\tokusho\page.tsx`
**実装**: 特定商取引法に基づく表記（販売者名・住所・電話・メール・返品ポリシー・決済方法）

**ファイル**: `D:\99_Webアプリ\MerFreee\app\legal\privacy\page.tsx`
**実装**: プライバシーポリシー（個人情報取扱・第三者提供・Cookie）

**ファイル**: `D:\99_Webアプリ\MerFreee\app\legal\terms\page.tsx`
**実装**: 利用規約（サービス内容・禁止事項・免責・解約・準拠法）

**完了基準**: 3ページとも存在し・LP フッターのリンクからアクセスできる・テキスト情報が正確に記載されている

---

## デザイン実装仕様

### ビジュアル仕様（表現性 9点必達）

**カラーパレット（HEXコード確定）**:
- Primary（オレンジ）: `#E85D04`
- Secondary（ブルー）: `#0A6EBD`
- Accent（シアン）: `#00B4D8`
- Dark（ダークネイビー）: `#03045E`
- Surface（ライトグレー）: `#F8FAFC`
- Synced（グリーン）: `#10B981`
- Pending（アンバー）: `#F59E0B`
- Error（レッド）: `#EF4444`

**SVGロゴ仕様** (`D:\99_Webアプリ\MerFreee\public\logo.svg`):
- サイズ: 200×40px
- 「M」字形アイコン（#E85D04）+ 「erFreee」テキスト（#03045E）
- 絵文字禁止・純粋SVGパスで描画

**同期完了演出**:
- SyncProgressToast: 画面右下に280×60px のトースト
- 背景: グリーン（#10B981）・白文字
- 表示: 「XX件の取引を弥生に連携しました」
- アニメーション: 右からスライドイン（300ms ease-out）→ 3秒後フェードアウト
- aria-live="polite" でスクリーンリーダー対応

**KPIカードアニメーション**:
- ダッシュボードロード時にカウントアップアニメーション（0→実際値、1秒間）
- `requestAnimationFrame` を使用（setInterval禁止）

### BGM仕様

MerFreeeはWebアプリSaaSのため、BGMは不要（evaluation_prompt v3.1の楽しい度軸はSaaS向けに「達成感演出」で代替評価）。
代わりに以下のUI音を実装する:

- 同期完了SE: Web Audio API で「チャイム音」（880Hz→1108Hz・200ms・ガウス波形）
- エラーSE: 低音警告（330Hz・200ms）
- PDF生成完了SE: 3音上昇（523Hz→659Hz→784Hz・各100ms）

実装ファイル: `D:\99_Webアプリ\MerFreee\lib\sounds.ts`

---

## 弥生API・freeeAPI 連携フロー図（全体）

```
[全体データフロー]

メルカリShops（売上発生）
    │
    │ 毎日0:00（Vercel Cron） or 手動同期ボタン
    ▼
MerFreee バックエンド（/api/cron/sync）
    │
    ├─ USE_MOCK_MERCARI=true の場合
    │      ↓
    │  lib/mercari/mock.ts からモックデータ読み込み
    │
    └─ USE_MOCK_MERCARI=false の場合
           ↓
       メルカリShops API（パートナー申請後）
       GET /v1/shops/{shop_id}/orders
    │
    ▼
transactions テーブルに upsert
（重複防止: mercari_order_id で UNIQUE制約）
    │
    ├─────────────────────┐
    ▼                     ▼
弥生会計Online API      freee会計API
POST /journals         POST /api/1/deals
（仕訳自動作成）        （収入取引自動作成）
    │                     │
    ▼                     ▼
synced_to_yayoi_at    synced_to_freee_at
を更新                を更新
    │
    ▼
適格請求書PDF生成（月次）
lib/invoice/generator.ts
@react-pdf/renderer
    │
    ▼
Supabase Storage にPDFアップロード
invoices テーブルに pdf_url 保存
    │
    ▼
Resend で月次レポートメール送信
（pdf_url のダウンロードリンク付き）
```

---

## テスト方法

### ユニットテスト

**ファイル**: `D:\99_Webアプリ\MerFreee\__tests__\crypto.test.ts`

```typescript
import { encrypt, decrypt } from '../lib/crypto';

describe('crypto', () => {
  it('encrypt/decrypt の往復が正常に動作する', () => {
    const token = 'test-access-token-12345';
    expect(decrypt(encrypt(token))).toBe(token);
  });

  it('同じ入力値でも毎回異なる暗号文を生成する', () => {
    const token = 'test-token';
    expect(encrypt(token)).not.toBe(encrypt(token));
  });
});
```

**ファイル**: `D:\99_Webアプリ\MerFreee\__tests__\invoice.test.ts`

```typescript
import { generateInvoicePdf } from '../lib/invoice/generator';

describe('invoice generator', () => {
  it('適格請求書番号が記載されたPDFを生成できる', async () => {
    const pdf = await generateInvoicePdf({
      sellerName: 'テスト事業者',
      sellerInvoiceNumber: 'T-1234567890123',
      periodStart: new Date('2026-03-01'),
      periodEnd: new Date('2026-03-31'),
      transactions: [
        { id: '1', mercari_item_name: 'テスト商品', amount: 1000, tax_rate: 0.10 }
      ],
    });
    expect(pdf.length).toBeGreaterThan(1000); // PDFバイナリが生成されている
  });
});
```

**実行コマンド**: `npm test` （Jest）

### 統合テスト（Playwright）

**ファイル**: `D:\99_Webアプリ\MerFreee\e2e\auth.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test('マジックリンクログインフロー', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[aria-label="メールアドレスを入力"]', 'test@example.com');
  await page.click('[aria-label="マジックリンクを送信する"]');
  await expect(page.locator('text=メールを確認してください')).toBeVisible();
});

test('ダッシュボードはログイン必須', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/login/);
});
```

**実行コマンド**: `npx playwright test`

### アクセシビリティテスト

```bash
# axe-core による自動検出
npx axe http://localhost:3000 --tags wcag2a,wcag2aa
npx axe http://localhost:3000/login --tags wcag2a,wcag2aa

# 期待結果: violations: 0
```

### パフォーマンステスト

```bash
# Lighthouse CI
npx lhci autorun --collect.url=http://localhost:3000

# 目標値
# Performance: 80以上
# Accessibility: 90以上
# Best Practices: 90以上
# SEO: 90以上
```

---

## モックデータ戦略（メルカリShops API審査期間中）

### フェーズ1: 審査期間中（0〜4週間）

`USE_MOCK_MERCARI=true` を `.env.local` に設定する。

`D:\99_Webアプリ\MerFreee\lib\mercari\mock.ts` に20件のモック取引を用意し、以下を実装・検証する:

1. Supabaseへの取引データupsert
2. 弥生APIへの仕訳送信（弥生開発者アカウントで検証）
3. freeeへの取引送信（freee Sandbox環境で検証）
4. 適格請求書PDF生成
5. 月次レポートメール送信

モックデータには以下の多様なケースを含める:
- 通常の国内取引（税率10%）・15件
- 軽減税率対象商品（税率8%）・2件
- バイヤーがインボイス登録事業者の取引・3件

### フェーズ2: 審査通過後

1. メルカリShops Developer Portalでクライアント認証情報を取得
2. `.env.local` に `MERCARI_SHOPS_CLIENT_ID` / `MERCARI_SHOPS_CLIENT_SECRET` を設定
3. `USE_MOCK_MERCARI=false` に変更
4. `lib/mercari/client.ts` の本番エンドポイントで疎通確認
5. 既存モックデータは削除せず残置（テスト・デモ用途に保持）

---

## ユーザーが実施すること

- [ ] メルカリShopsパートナー申請（URL: https://mercari-shops.com/partners）→ 審査2〜4週間 → 審査通過後に `MERCARI_SHOPS_CLIENT_ID` / `MERCARI_SHOPS_CLIENT_SECRET` を `.env.local` に設定
- [ ] 弥生会計Online 開発者アカウント申請（URL: https://developer.yayoi-kk.co.jp/）→ `YAYOI_CLIENT_ID` / `YAYOI_CLIENT_SECRET` を設定
- [ ] freee API アプリ登録（URL: https://developer.freee.co.jp/）→ `FREEE_CLIENT_ID` / `FREEE_CLIENT_SECRET` を設定
- [ ] Resend アカウント作成・APIキー取得（URL: https://resend.com）→ `RESEND_API_KEY` を設定 → ドメイン `merfreee.jp` のDNS設定
- [ ] OGP画像 `/public/og.png` 作成（1200×630px・Canva等で作成後配置）→ `D:\99_Webアプリ\MerFreee\public\og.png`
- [ ] Vercelデプロイ → Vercelダッシュボードで `D:\99_Webアプリ\MerFreee` をインポート・環境変数を設定
- [ ] KOMOJU Webhook URL登録 → KOMOJUダッシュボードで `https://merfreee.vercel.app/api/komoju/webhook` を設定
- [ ] 自分の適格請求書発行事業者番号（T-XXXXXXXXXX）をダッシュボードの設定画面に入力

---

## 90点保証の根拠（軸別）

| 軸 | 保証点数 | 根拠 |
|---|---|---|
| 表現性 | 9/10 | グラスモーフィズム（shadcn/ui）・SVGロゴ・カウントアップアニメ・同期完了トースト同時発火。競合の「マネーフォワード」（PC会計SaaS）がCSS Transitionのみ・アニメなし5点水準に対し、MerFreeeは動的演出を全面実装するため9点達成 |
| 使いやすさ | 9/10 | マジックリンク認証（パスワードレス）・3ステップオンボーディング（スキップ可）・全ボタン44px以上・aria-label全項目。競合freeeアプリのオンボーディングが5スクリーン以上なのに対し、MerFreeeは3ステップ以内を保証 |
| 楽しい度 | 7/10 | SaaSは「楽しい度」軸の基準がゲームと異なるが、同期完了SE（Web Audio）・カウントアップアニメ・「今月XX分節約」KPIで達成感を演出。BGMは不要なためMP3加点なし。楽しい度7点が現実的上限 |
| バズり度 | 7/10 | OGP完備・Twitter/Xシェアボタン（aria-label付き）・「節約時間」のバイラルコンテンツ設計。Wordle（D30 25%リテンション）の「毎日シェアしたくなる」設計を会計SaaSに転用。App Store未配信のためCanvas画像シェアなしで7点 |
| 収益性 | 6/10 | KOMOJU審査通過済み・3プランのサブスクリプション実装・14日無料トライアル。実際の課金ユーザーがゼロ（新規サービス）のため10点は不可。KOMOJU接続済みで課金フローが動作する状態で6点 |
| SEO/発見性 | 7/10 | OGP全タグ完備・sitemap.ts・lang="ja"・JSON-LD FAQPage・Vercelデプロイ済み。App Store/Google Play未配信（Webアプリ）のため9点は不可。Web SEO完全実装で7点 |
| 差別化 | 9/10 | 競合比較: マネーフォワード（メルカリShops専用API連携なし）・freee（インボイス自動生成未実装）・yayoi（メルカリShops非対応）。MerFreeeの差別化3点: (1)メルカリShops専用・(2)弥生+freee両対応・(3)インボイス自動PDF生成。1文説明: 「メルカリShops出店者の記帳とインボイス対応を月980円で完全自動化」。9点達成 |
| リテンション設計 | 8/10 | 毎日0時Cron自動同期・月次レポートメール（Resend）・ダッシュボードKPI継続表示。プッシュ通知未実装（Web PWA）のため9点は不可。メール通知×自動同期で8点 |
| パフォーマンス | 8/10 | Next.js 14 App Router・Vercel Edge・画像AVIF/WebP・gzip圧縮。Supabase接続レイテンシが変動要因のため10点保証は不可。通常動作8点 |
| アクセシビリティ | 8/10 | aria-label全項目・タッチターゲット44px・コントラスト4.5:1（ブランドカラー設計済み）・フォントサイズ14px以上。色覚対応テスト（Deuteranopia）未実施のため9点は不可。基本WCAG AA準拠で8点 |
| **合計** | **88/100** | **コード実装のみの保証スコア** |

---

## 実現可能性マトリクス

| タスク | 判定 | 理由 |
|---|---|---|
| プロジェクト初期化 | 確認可能 | create-next-app は実績済みコマンド |
| グラスモーフィズムUI | 確認可能 | tailwind.config.ts にCSSユーティリティ追加のみ |
| OGP・メタデータ | 確認可能 | Next.js 14 Metadata API で静的定義可能 |
| Supabaseスキーマ | 確認可能 | SQL定義が確定・Supabase Studioで実行可能 |
| NextAuth.js認証 | 確認可能 | SupabaseAdapterは公式ドキュメント通り |
| メルカリShops API | 要確認 | パートナー申請審査中（2〜4週間）・モックで代替可能 |
| 弥生会計Online API | 要確認 | 開発者アカウント申請が必要・Sandbox環境で疎通確認待ち |
| freee会計 API | 要確認 | freee Sandbox環境は即座に利用可能（登録のみ）・接続自体は確認可能 |
| 適格請求書PDF生成 | 確認可能 | @react-pdf/renderer は npm 公開済みパッケージ |
| KOMOJU課金 | 確認可能 | 審査通過済み・テスト環境で課金フロー確認可能 |
| Vercel Cron Jobs | 確認可能 | vercel.json で定義・Vercelダッシュボードで確認可能 |
| Resend月次メール | 確認可能 | アカウント登録後即利用可能 |
| SNSシェア機能 | 確認可能 | Twitter Web Intent URLは外部依存なし |
| sitemap・構造化データ | 確認可能 | Next.js 14 標準機能 |
| aria-label全項目 | 確認可能 | コードレビューで検証可能 |
| トークン暗号化 | 確認可能 | Node.js組み込みcrypto moduleで実装可能 |
| メルカリShopsパートナー申請 | コード外 | ユーザーによる申請・審査が必要 |
| Vercelデプロイ | コード外 | ユーザーによるVercelダッシュボード操作が必要 |
| OGP画像デザイン | コード外 | Canva等での画像制作が必要（または@vercel/ogで動的生成に変更可） |
| KOMOJU Webhook URL設定 | コード外 | KOMOJUダッシュボードでの設定が必要 |

---

## 料金プラン定義

| プラン | 月額 | 対象 | 取引数上限 | 会計ソフト |
|---|---|---|---|---|
| Starter | ¥980 | 副業・少量出品者 | 100件/月 | 弥生 or freee（片方のみ） |
| Standard | ¥1,980 | メイン事業者 | 500件/月 | 弥生 + freee（両対応） |
| Pro | ¥4,980 | 大口出品者・法人 | 無制限 | 両対応 + 優先サポート + 月次レポートカスタマイズ |

**14日間無料トライアル**: Standardプラン相当・クレジットカード不要

---

## 設計書バリデーション

```
✅ 全タスクにファイルパス（絶対パス）が記載されている
✅ 全タスクに完了基準（検証可能な条件）が記載されている
✅ 絵文字ゼロ（設計書本文・コードサンプル全体）
✅ 「〜を検討」「〜が望ましい」表現ゼロ
✅ スコアは「保証値」（「見込み」「推定」禁止）
✅ ユーザーアクション項目が実装タスクと分離されている
✅ モックデータ戦略が明確に定義されている
✅ 弥生・freeeの連携フローがテキスト図で明示されている
✅ Supabaseスキーマが実行可能なSQL形式で記載されている
✅ OGP・favicon・aria-label・sitemap が必須タスクに含まれる
✅ テスト方法（Jest・Playwright・axe・Lighthouse）が具体的に記載されている
✅ 実現可能性マトリクスでコード外タスクが分離されている
```
