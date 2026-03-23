import { createServerClient } from '@/lib/supabase/server';
import { verifyKomojuWebhook } from '@/lib/komoju/client';
import { Plan } from '@/types';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('x-komoju-signature') ?? '';

  // Webhook署名検証
  if (process.env.KOMOJU_WEBHOOK_SECRET && !verifyKomojuWebhook(body, signature)) {
    return new Response('Invalid signature', { status: 401 });
  }

  const event = JSON.parse(body) as {
    type: string;
    data: {
      metadata?: { plan?: string; user_id?: string };
      status?: string;
    };
  };

  if (event.type !== 'payment.captured') {
    return Response.json({ received: true });
  }

  const { metadata } = event.data;
  const plan = metadata?.plan as Plan;
  const userId = metadata?.user_id;

  if (!plan || !userId) {
    return Response.json({ error: 'Missing plan or user_id' }, { status: 400 });
  }

  const supabase = createServerClient();

  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setMonth(expiresAt.getMonth() + 1);

  const { error } = await supabase
    .from('users')
    .update({
      plan,
      plan_started_at: now.toISOString(),
      plan_expires_at: expiresAt.toISOString(),
      updated_at: now.toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('Plan update error:', error);
    return Response.json({ error: 'Plan update failed' }, { status: 500 });
  }

  return Response.json({ success: true });
}
