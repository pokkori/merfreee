// eBay Browse API（OAuth 2.0 Client Credentials）でアイテム検索

export interface EbaySearchParams {
  keywords: string; // 例: 'vintage japanese camera Nikon'
  category_id?: string; // eBay categoryId（任意）
  limit?: number; // 最大200
}

export interface EbayItem {
  itemId: string;
  title: string;
  price: { value: string; currency: string };
  condition: string;
  itemWebUrl: string;
}

// トークンキャッシュ（15分有効）
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getEbayAccessToken(): Promise<string | null> {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const clientId = process.env.EBAY_CLIENT_ID;
  const clientSecret = process.env.EBAY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return null;
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },
    body: 'grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope',
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as { access_token: string; expires_in: number };
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000; // 1分前に期限切れ扱い

  return cachedToken;
}

export async function searchEbayItems(params: EbaySearchParams): Promise<EbayItem[]> {
  const token = await getEbayAccessToken();
  if (!token) {
    // APIキー未設定または取得失敗時は空配列を返す（クロンジョブが止まらないよう）
    return [];
  }

  const limit = params.limit ?? 20;
  const queryParams = new URLSearchParams({
    q: params.keywords,
    limit: String(limit),
    filter: 'buyingOptions:{FIXED_PRICE}',
  });

  if (params.category_id) {
    queryParams.set('category_ids', params.category_id);
  }

  try {
    const response = await fetch(
      `https://api.ebay.com/buy/browse/v1/item_summary/search?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as {
      itemSummaries?: Array<{
        itemId: string;
        title: string;
        price?: { value: string; currency: string };
        condition?: string;
        itemWebUrl: string;
      }>;
    };

    return (data.itemSummaries ?? []).map((item) => ({
      itemId: item.itemId,
      title: item.title,
      price: item.price ?? { value: '0', currency: 'USD' },
      condition: item.condition ?? 'Used',
      itemWebUrl: item.itemWebUrl,
    }));
  } catch {
    return [];
  }
}

// USD→JPY換算（固定レート: 150円/USD。Vercel env EXCHANGE_RATE_USD_JPY で上書き可能）
export function usdToJpy(usd: number): number {
  const rate = parseFloat(process.env.EXCHANGE_RATE_USD_JPY ?? '150');
  return Math.round(usd * rate);
}
