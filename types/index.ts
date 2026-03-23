export type Plan = 'trial' | 'starter' | 'standard' | 'pro';

export interface User {
  id: string;
  email: string;
  name: string | null;
  plan: Plan;
  plan_started_at: string | null;
  plan_expires_at: string | null;
  komoju_customer_id: string | null;
  invoice_number: string | null;
  created_at: string;
  updated_at: string;
}

export type IntegrationProvider = 'mercari_shops' | 'yayoi' | 'freee';

export interface Integration {
  id: string;
  user_id: string;
  provider: IntegrationProvider;
  access_token: string | null;
  refresh_token: string | null;
  token_expires_at: string | null;
  shop_id: string | null;
  company_id: string | null;
  is_active: boolean;
  last_synced_at: string | null;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  mercari_order_id: string;
  mercari_item_name: string;
  amount: number;
  fee: number;
  net_amount: number;
  tax_amount: number;
  tax_rate: number;
  invoice_eligible: boolean;
  sold_at: string;
  synced_to_yayoi_at: string | null;
  synced_to_freee_at: string | null;
  yayoi_journal_id: string | null;
  freee_deal_id: string | null;
  created_at: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  invoice_number_seq: number;
  period_start: string;
  period_end: string;
  total_amount: number;
  tax_8_amount: number;
  tax_10_amount: number;
  pdf_url: string | null;
  issued_at: string;
  created_at: string;
}

export interface MonthlyReport {
  id: string;
  user_id: string;
  year: number;
  month: number;
  total_sales: number;
  total_transactions: number;
  total_fee: number;
  sent_at: string | null;
  created_at: string;
}

export interface MercariOrder {
  order_id: string;
  item_name: string;
  amount: number;
  fee: number;
  net_amount: number;
  tax_rate: number;
  sold_at: string;
  buyer_invoice_number: string | null;
}

export interface KpiData {
  totalSales: number;
  totalTransactions: number;
  totalFee: number;
  syncedToYayoi: number;
  syncedToFreee: number;
  savedMinutes: number;
}
