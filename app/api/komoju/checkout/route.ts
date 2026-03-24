import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// プラン定義（KOMOJU商品ID・価格はユーザーがKOMOJU管理画面で設定後に差し替え）
const PLAN_KOMOJU_IDS: Record<string, { productId: string; amount: number }> = {
  standard: { productId: process.env.KOMOJU_PRODUCT_ID_STANDARD ?? 'STANDARD_PLACEHOLDER', amount: 1980 },
  pro: { productId: process.env.KOMOJU_PRODUCT_ID_PRO ?? 'PRO_PLACEHOLDER', amount: 4980 },
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { plan } = (await req.json()) as { plan: string };
  const planConfig = PLAN_KOMOJU_IDS[plan];
  if (!planConfig) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  const komojuApiKey = process.env.KOMOJU_SECRET_KEY;
  if (!komojuApiKey) {
    return NextResponse.json({ error: 'Payment system not configured' }, { status: 503 });
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? 'https://ecross-arbitrage.vercel.app';

  // KOMOJU セッション作成
  const response = await fetch('https://komoju.com/api/v1/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${komojuApiKey}:`).toString('base64')}`,
    },
    body: JSON.stringify({
      amount: planConfig.amount,
      currency: 'JPY',
      return_url: `${baseUrl}/api/komoju/verify?plan=${plan}`,
      cancel_url: `${baseUrl}/pricing`,
      default_locale: 'ja',
      metadata: { user_email: session.user.email, plan },
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    console.error('KOMOJU session error:', err);
    return NextResponse.json({ error: 'Payment session creation failed' }, { status: 500 });
  }

  const data = (await response.json()) as { session_url: string };
  return NextResponse.json({ url: data.session_url });
}
