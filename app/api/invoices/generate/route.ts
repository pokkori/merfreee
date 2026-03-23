import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { createServerClient } from '@/lib/supabase/server';
import { generateInvoicePdf } from '@/lib/invoice/generator';
import { Transaction } from '@/types';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { periodStart, periodEnd } = await req.json() as { periodStart: string; periodEnd: string };
  if (!periodStart || !periodEnd) {
    return Response.json({ error: 'periodStart and periodEnd are required' }, { status: 400 });
  }

  const supabase = createServerClient();
  const userId = session.user.id as string;

  const { data: user } = await supabase
    .from('users')
    .select('name, invoice_number')
    .eq('id', userId)
    .single();

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .gte('sold_at', periodStart)
    .lte('sold_at', periodEnd)
    .order('sold_at', { ascending: true });

  if (!transactions?.length) {
    return Response.json({ error: '対象期間の取引データがありません' }, { status: 400 });
  }

  try {
    const pdfBuffer = await generateInvoicePdf({
      sellerName: user?.name ?? 'MerFreeeユーザー',
      sellerInvoiceNumber: user?.invoice_number ?? 'T-未登録',
      periodStart: new Date(periodStart),
      periodEnd: new Date(periodEnd),
      transactions: transactions as Transaction[],
    });

    const totalAmount = (transactions as Transaction[]).reduce((s, t) => s + t.amount, 0);
    const tax10Amount = (transactions as Transaction[])
      .filter((t) => t.tax_rate === 0.1)
      .reduce((s, t) => s + t.tax_amount, 0);
    const tax8Amount = (transactions as Transaction[])
      .filter((t) => t.tax_rate === 0.08)
      .reduce((s, t) => s + t.tax_amount, 0);

    // シーケンス番号を取得
    const { data: lastInvoice } = await supabase
      .from('invoices')
      .select('invoice_number_seq')
      .eq('user_id', userId)
      .order('invoice_number_seq', { ascending: false })
      .limit(1)
      .single();

    const seq = (lastInvoice?.invoice_number_seq ?? 0) + 1;

    const { data: invoiceRecord } = await supabase
      .from('invoices')
      .insert({
        user_id: userId,
        invoice_number_seq: seq,
        period_start: periodStart.split('T')[0],
        period_end: periodEnd.split('T')[0],
        total_amount: totalAmount,
        tax_8_amount: tax8Amount,
        tax_10_amount: tax10Amount,
      })
      .select('id')
      .single();

    return new Response(pdfBuffer.buffer as ArrayBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoiceRecord?.id ?? 'download'}.pdf"`,
      },
    });
  } catch (err) {
    console.error('PDF generation error:', err);
    return Response.json({ error: 'PDF生成に失敗しました' }, { status: 500 });
  }
}
