import { MOCK_ORDERS } from '@/lib/mercari/mock';

export default function TransactionsPage() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: 'white', fontSize: 24, fontWeight: 700, marginBottom: 4 }}>取引一覧</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
          {process.env.USE_MOCK_MERCARI === 'true' ? 'モックデータ（メルカリShops API審査期間中）' : 'メルカリShopsから同期したデータ'}
        </p>
      </div>

      <div className="glass-card-enhanced" style={{ padding: 0, overflow: 'auto' }}>
        <table
          style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 700 }}
          role="table"
          aria-label="取引一覧テーブル"
        >
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              {['注文ID', '商品名', '販売額', '手数料', '手取り', '税率', '販売日', 'インボイス'].map((h) => (
                <th key={h} scope="col" style={{ padding: '12px 14px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: 12, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_ORDERS.map((order) => (
              <tr key={order.order_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px 14px', color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'monospace' }}>{order.order_id}</td>
                <td style={{ padding: '12px 14px', color: 'white' }}>{order.item_name}</td>
                <td style={{ padding: '12px 14px', color: 'white', fontWeight: 600 }}>¥{order.amount.toLocaleString()}</td>
                <td style={{ padding: '12px 14px', color: 'rgba(255,255,255,0.5)' }}>¥{order.fee.toLocaleString()}</td>
                <td style={{ padding: '12px 14px', color: '#10B981', fontWeight: 600 }}>¥{order.net_amount.toLocaleString()}</td>
                <td style={{ padding: '12px 14px', color: 'rgba(255,255,255,0.6)' }}>{(order.tax_rate * 100).toFixed(0)}%</td>
                <td style={{ padding: '12px 14px', color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
                  {new Date(order.sold_at).toLocaleDateString('ja-JP')}
                </td>
                <td style={{ padding: '12px 14px' }}>
                  {order.buyer_invoice_number ? (
                    <span aria-label="インボイス番号あり" style={{ color: '#00B4D8', fontSize: 11, background: 'rgba(0,180,216,0.2)', padding: '2px 8px', borderRadius: 4 }}>
                      適格
                    </span>
                  ) : (
                    <span aria-label="インボイス番号なし" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
