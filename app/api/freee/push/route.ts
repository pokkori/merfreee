import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { createServerClient } from '@/lib/supabase/server';
import { pushDeal } from '@/lib/freee/client';
import { decrypt } from '@/lib/crypto';
import { Transaction } from '@/types';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServerClient();
  const userId = session.user.id as string;

  const { data: integration } = await supabase
    .from('integrations')
    .select('*')
    .eq('user_id', userId)
    .eq('provider', 'freee')
    .eq('is_active', true)
    .single();

  if (!integration?.access_token) {
    return Response.json({ error: 'freee連携が設定されていません' }, { status: 400 });
  }

  const { data: user } = await supabase
    .from('users')
    .select('invoice_number')
    .eq('id', userId)
    .single();

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .is('synced_to_freee_at', null);

  if (!transactions?.length) {
    return Response.json({ success: true, pushed: 0 });
  }

  let accessToken: string;
  try {
    accessToken = decrypt(integration.access_token);
  } catch {
    return Response.json({ error: 'トークン復号エラー' }, { status: 500 });
  }

  let pushedCount = 0;
  const errors: string[] = [];

  for (const tx of transactions as Transaction[]) {
    try {
      const { dealId } = await pushDeal(
        accessToken,
        integration.company_id ?? '',
        tx,
        user?.invoice_number ?? ''
      );

      await supabase
        .from('transactions')
        .update({
          synced_to_freee_at: new Date().toISOString(),
          freee_deal_id: dealId,
        })
        .eq('id', tx.id);

      pushedCount++;
    } catch (err) {
      errors.push(`${tx.mercari_order_id}: ${String(err)}`);
    }
  }

  return Response.json({ success: true, pushed: pushedCount, errors });
}
