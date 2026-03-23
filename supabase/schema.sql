-- ユーザーテーブル
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  plan TEXT NOT NULL DEFAULT 'trial' CHECK (plan IN ('trial', 'starter', 'standard', 'pro')),
  plan_started_at TIMESTAMPTZ,
  plan_expires_at TIMESTAMPTZ,
  komoju_customer_id TEXT,
  invoice_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 外部連携設定テーブル
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('mercari_shops', 'yayoi', 'freee')),
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  shop_id TEXT,
  company_id TEXT,
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
  amount INTEGER NOT NULL,
  fee INTEGER NOT NULL DEFAULT 0,
  net_amount INTEGER NOT NULL,
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
  invoice_number_seq INTEGER NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_amount INTEGER NOT NULL,
  tax_8_amount INTEGER NOT NULL DEFAULT 0,
  tax_10_amount INTEGER NOT NULL DEFAULT 0,
  pdf_url TEXT,
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
