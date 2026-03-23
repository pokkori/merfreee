export type PlanKey = 'starter' | 'standard' | 'pro';

export const PLAN_PRICES: Record<PlanKey, { amount: number; currency: string; description: string }> = {
  starter:  { amount: 980,  currency: 'JPY', description: 'MerFreee Starter プラン（月額）' },
  standard: { amount: 1980, currency: 'JPY', description: 'MerFreee Standard プラン（月額）' },
  pro:      { amount: 4980, currency: 'JPY', description: 'MerFreee Pro プラン（月額）' },
};

export async function createKomojuSession(params: {
  plan: PlanKey;
  userId: string;
  baseUrl: string;
}): Promise<{ session_url: string }> {
  const price = PLAN_PRICES[params.plan];

  const res = await fetch('https://komoju.com/api/v1/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.KOMOJU_SECRET_KEY}:`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: price.amount,
      currency: price.currency,
      payment_types: ['credit_card'],
      default_locale: 'ja',
      return_url: `${params.baseUrl}/billing?success=true`,
      cancel_url: `${params.baseUrl}/billing`,
      metadata: { plan: params.plan, user_id: params.userId },
    }),
  });

  if (!res.ok) throw new Error(`KOMOJU session creation failed: ${res.status}`);
  return res.json();
}

export function verifyKomojuWebhook(body: string, signature: string): boolean {
  const crypto = require('crypto');
  const secret = process.env.KOMOJU_WEBHOOK_SECRET!;
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  return signature === expectedSig;
}
