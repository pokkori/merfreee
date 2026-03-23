import { Transaction } from '@/types';

const FREEE_API_BASE = 'https://api.freee.co.jp/api/1';
const FREEE_AUTH_BASE = 'https://accounts.secure.freee.co.jp';

export async function pushDeal(
  accessToken: string,
  companyId: string,
  transaction: Transaction,
  sellerInvoiceNumber: string
): Promise<{ dealId: string }> {
  const body = {
    company_id: parseInt(companyId, 10),
    issue_date: transaction.sold_at.split('T')[0],
    type: 'income',
    amount: transaction.amount,
    due_amount: transaction.amount,
    details: [
      {
        tax_code: 1,
        account_item_id: 80000,
        amount: transaction.amount,
        description: `メルカリShops ${transaction.mercari_item_name}`,
        invoice_registration_number: sellerInvoiceNumber,
      },
    ],
  };

  const res = await fetch(`${FREEE_API_BASE}/deals`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`freee API error: ${res.status}`);
  const data = await res.json();
  return { dealId: String(data.deal.id) };
}

export function getFreeeOAuthUrl(origin: string): string {
  const url = new URL(`${FREEE_AUTH_BASE}/public_api/authorize`);
  url.searchParams.set('client_id', process.env.FREEE_CLIENT_ID!);
  url.searchParams.set('redirect_uri', `${origin}/api/freee/callback`);
  url.searchParams.set('response_type', 'code');
  return url.toString();
}

export async function exchangeFreeeCode(
  code: string,
  origin: string
): Promise<{ access_token: string; refresh_token: string; expires_in: number }> {
  const res = await fetch(`${FREEE_AUTH_BASE}/public_api/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: process.env.FREEE_CLIENT_ID,
      client_secret: process.env.FREEE_CLIENT_SECRET,
      code,
      redirect_uri: `${origin}/api/freee/callback`,
    }),
  });
  if (!res.ok) throw new Error(`freee token exchange failed: ${res.status}`);
  return res.json();
}

export async function getFreeeCompanyId(accessToken: string): Promise<string> {
  const res = await fetch(`${FREEE_API_BASE}/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`freee user info failed: ${res.status}`);
  const data = await res.json();
  return String(data.user.companies[0].id);
}
