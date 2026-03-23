import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { createServerClient } from '@/lib/supabase/server';
import { fetchMercariOrders } from '@/lib/mercari/client';
import { decrypt } from '@/lib/crypto';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServerClient();
  const userId = session.user.id as string;

  try {
    // メルカリShops連携情報を取得
    const { data: integration } = await supabase
      .from('integrations')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', 'mercari_shops')
      .eq('is_active', true)
      .single();

    const fromDate = new Date();
    fromDate.setDate(1);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date();

    let accessToken = 'mock';
    let shopId = 'mock';

    if (integration?.access_token) {
      try {
        accessToken = decrypt(integration.access_token);
      } catch {
        accessToken = 'mock';
      }
      shopId = integration.shop_id ?? 'mock';
    }

    const orders = await fetchMercariOrders(accessToken, shopId, fromDate, toDate);

    let upsertCount = 0;
    for (const order of orders) {
      const { error } = await supabase.from('transactions').upsert(
        {
          user_id: userId,
          mercari_order_id: order.order_id,
          mercari_item_name: order.item_name,
          amount: order.amount,
          fee: order.fee,
          net_amount: order.net_amount,
          tax_amount: Math.floor(order.amount * order.tax_rate / (1 + order.tax_rate)),
          tax_rate: order.tax_rate,
          invoice_eligible: order.buyer_invoice_number !== null,
          sold_at: order.sold_at,
        },
        { onConflict: 'user_id,mercari_order_id', ignoreDuplicates: false }
      );
      if (!error) upsertCount++;
    }

    // last_synced_at を更新
    if (integration) {
      await supabase
        .from('integrations')
        .update({ last_synced_at: new Date().toISOString() })
        .eq('id', integration.id);
    }

    return Response.json({ success: true, synced: upsertCount, total: orders.length });
  } catch (error) {
    console.error('Sync error:', error);
    return Response.json({ error: 'Sync failed' }, { status: 500 });
  }
}
