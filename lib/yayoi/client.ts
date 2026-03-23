import { Transaction } from '@/types';

const YAYOI_API_BASE = 'https://api.yayoi-kk.co.jp/v1';

export async function pushJournal(
  accessToken: string,
  companyId: string,
  transaction: Transaction,
  sellerInvoiceNumber: string
): Promise<{ journalId: string }> {
  const body = {
    date: transaction.sold_at.split('T')[0],
    debit_account_code: '1101',
    credit_account_code: '4101',
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
  const data = await res.json();
  return { journalId: data.journal_id as string };
}

export function getYayoiOAuthUrl(origin: string): string {
  const url = new URL('https://yayoi-kk.co.jp/oauth/authorize');
  url.searchParams.set('client_id', process.env.YAYOI_CLIENT_ID!);
  url.searchParams.set('redirect_uri', `${origin}/api/yayoi/callback`);
  url.searchParams.set('scope', 'accounting.journals:write accounting.journals:read');
  url.searchParams.set('response_type', 'code');
  return url.toString();
}

export async function exchangeYayoiCode(
  code: string,
  origin: string
): Promise<{ access_token: string; refresh_token: string; expires_in: number }> {
  const res = await fetch('https://yayoi-kk.co.jp/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: process.env.YAYOI_CLIENT_ID,
      client_secret: process.env.YAYOI_CLIENT_SECRET,
      code,
      redirect_uri: `${origin}/api/yayoi/callback`,
    }),
  });
  if (!res.ok) throw new Error(`Yayoi token exchange failed: ${res.status}`);
  return res.json();
}
