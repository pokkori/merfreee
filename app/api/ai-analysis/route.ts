import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response('Unauthorized', { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response('AI service not configured', { status: 503 });
  }

  const { item_name, domestic_price_low, domestic_price_high, overseas_price_low, overseas_price_high, roi_pct } =
    (await req.json()) as {
      item_name: string;
      domestic_price_low: number;
      domestic_price_high: number;
      overseas_price_low: number;
      overseas_price_high: number;
      roi_pct: number;
    };

  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  const anthropic = new Anthropic({ apiKey });

  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 200,
    messages: [
      {
        role: 'user',
        content: `以下の商品の仕入れ・出品アドバイスを50字以内で日本語で答えてください。
商品: ${item_name}
国内価格: ¥${domestic_price_low}〜¥${domestic_price_high}
海外価格: ¥${overseas_price_low}〜¥${overseas_price_high}
推定ROI: ${roi_pct}%`,
      },
    ],
  });

  return new Response(stream.toReadableStream(), {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
  });
}
