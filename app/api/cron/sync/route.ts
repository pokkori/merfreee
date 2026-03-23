import { createServerClient } from '@/lib/supabase/server';
import { fetchMercariOrders } from '@/lib/mercari/client';
import { decrypt } from '@/lib/crypto';

export async function GET(req: Request) {
  // Vercel Cronからのリクエストのみ許可
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = createServerClient();

  const { data: activeUsers } = await supabase
    .from('users')
    .select('id, plan')
    .in('plan', ['starter', 'standard', 'pro']);

  let syncedCount = 0;

  for (const user of activeUsers ?? []) {
    try {
      const { data: integration } = await supabase
        .from('integrations')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', 'mercari_shops')
        .eq('is_active', true)
        .single();

      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 1);
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

      for (const order of orders) {
        await supabase.from('transactions').upsert(
          {
            user_id: user.id,
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
          { onConflict: 'user_id,mercari_order_id', ignoreDuplicates: true }
        );
      }

      if (integration) {
        await supabase
          .from('integrations')
          .update({ last_synced_at: new Date().toISOString() })
          .eq('id', integration.id);
      }

      syncedCount++;
    } catch (err) {
      console.error(`Sync failed for user ${user.id}:`, err);
    }
  }

  return Response.json({ synced: syncedCount, total: activeUsers?.length ?? 0 });
}
