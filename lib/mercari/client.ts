import { MercariOrder } from '@/types';
import { fetchMercariOrdersMock } from './mock';

const MERCARI_API_BASE = 'https://api.mercari-shops.com/v1';

export async function fetchMercariOrders(
  accessToken: string,
  shopId: string,
  fromDate: Date,
  toDate: Date
): Promise<MercariOrder[]> {
  if (process.env.USE_MOCK_MERCARI === 'true') {
    return fetchMercariOrdersMock(fromDate, toDate);
  }

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
  const data = await res.json();
  return data.orders as MercariOrder[];
}

export function getMercariOAuthUrl(origin: string): string {
  const url = new URL('https://auth.mercari-shops.com/oauth/authorize');
  url.searchParams.set('client_id', process.env.MERCARI_SHOPS_CLIENT_ID!);
  url.searchParams.set('redirect_uri', `${origin}/api/mercari/callback`);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'shops.orders:read');
  return url.toString();
}

export async function exchangeMercariCode(
  code: string,
  origin: string
): Promise<{ access_token: string; refresh_token: string; expires_in: number }> {
  const res = await fetch('https://auth.mercari-shops.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: process.env.MERCARI_SHOPS_CLIENT_ID,
      client_secret: process.env.MERCARI_SHOPS_CLIENT_SECRET,
      code,
      redirect_uri: `${origin}/api/mercari/callback`,
    }),
  });
  if (!res.ok) throw new Error(`Mercari token exchange failed: ${res.status}`);
  return res.json();
}

export async function getMercariShopId(accessToken: string): Promise<string> {
  const res = await fetch(`${MERCARI_API_BASE}/shops/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`Mercari shop info failed: ${res.status}`);
  const data = await res.json();
  return data.shop.shop_id as string;
}
