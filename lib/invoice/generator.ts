import { Transaction } from '@/types';

export interface InvoiceParams {
  sellerName: string;
  sellerInvoiceNumber: string;
  periodStart: Date;
  periodEnd: Date;
  transactions: Transaction[];
}

export async function generateInvoicePdf(params: InvoiceParams): Promise<Uint8Array> {
  const { Document, Page, Text, View, StyleSheet, pdf } = await import('@react-pdf/renderer');
  const React = await import('react');

  const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'Helvetica' },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#03045E' },
    section: { marginBottom: 16 },
    label: { fontSize: 9, color: '#666', marginBottom: 2 },
    value: { fontSize: 11, marginBottom: 12 },
    table: { borderWidth: 1, borderColor: '#ddd' },
    tableHeader: { flexDirection: 'row', backgroundColor: '#f0f0f0', borderBottomWidth: 1, borderColor: '#ddd' },
    tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ddd' },
    tableCell: { padding: 6, fontSize: 9 },
    total: { fontSize: 14, fontWeight: 'bold', textAlign: 'right', marginTop: 16, color: '#E85D04' },
  });

  const formatDate = (d: Date) => d.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
  const totalAmount = params.transactions.reduce((s, t) => s + t.amount, 0);

  const doc = React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: 'A4', style: styles.page },
      React.createElement(Text, { style: styles.title }, '適格請求書（売上明細）'),
      React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.label }, '登録番号'),
        React.createElement(Text, { style: styles.value }, params.sellerInvoiceNumber),
        React.createElement(Text, { style: styles.label }, '販売者名'),
        React.createElement(Text, { style: styles.value }, params.sellerName),
        React.createElement(Text, { style: styles.label }, '対象期間'),
        React.createElement(Text, { style: styles.value }, `${formatDate(params.periodStart)} ~ ${formatDate(params.periodEnd)}`)
      ),
      React.createElement(View, { style: styles.table },
        React.createElement(View, { style: styles.tableHeader },
          React.createElement(Text, { style: [styles.tableCell, { flex: 3 }] }, '商品名'),
          React.createElement(Text, { style: [styles.tableCell, { flex: 1.5, textAlign: 'right' }] }, '金額'),
          React.createElement(Text, { style: [styles.tableCell, { flex: 0.8, textAlign: 'right' }] }, '税率'),
          React.createElement(Text, { style: [styles.tableCell, { flex: 1.5, textAlign: 'right' }] }, '販売日')
        ),
        ...params.transactions.map((t) =>
          React.createElement(View, { key: t.id, style: styles.tableRow },
            React.createElement(Text, { style: [styles.tableCell, { flex: 3 }] }, t.mercari_item_name),
            React.createElement(Text, { style: [styles.tableCell, { flex: 1.5, textAlign: 'right' }] }, `¥${t.amount.toLocaleString()}`),
            React.createElement(Text, { style: [styles.tableCell, { flex: 0.8, textAlign: 'right' }] }, `${(t.tax_rate * 100).toFixed(0)}%`),
            React.createElement(Text, { style: [styles.tableCell, { flex: 1.5, textAlign: 'right' }] }, new Date(t.sold_at).toLocaleDateString('ja-JP'))
          )
        )
      ),
      React.createElement(Text, { style: styles.total }, `合計: ¥${totalAmount.toLocaleString()}（税込）`)
    )
  );

  const pdfInstance = pdf(doc as Parameters<typeof pdf>[0]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer: Buffer = await (pdfInstance.toBuffer() as any);
  return new Uint8Array(buffer);
}
