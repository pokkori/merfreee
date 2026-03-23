import Link from 'next/link';
import { Settings2Icon, ExternalLinkIcon } from 'lucide-react';

const integrationLinks = [
  {
    href: '/settings/mercari',
    title: 'メルカリShops連携',
    description: 'メルカリShopsの売上データを自動取得するための連携設定',
    status: 'モック動作中',
    statusColor: '#F59E0B',
  },
  {
    href: '/settings/yayoi',
    title: '弥生会計Online連携',
    description: 'メルカリShopsの売上を弥生の仕訳に自動連携する設定',
    status: '未連携',
    statusColor: 'rgba(255,255,255,0.4)',
  },
  {
    href: '/settings/freee',
    title: 'freee会計連携',
    description: 'メルカリShopsの売上をfreeeの取引に自動連携する設定',
    status: '未連携',
    statusColor: 'rgba(255,255,255,0.4)',
  },
];

export default function SettingsPage() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: 'white', fontSize: 24, fontWeight: 700, marginBottom: 4 }}>連携設定</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>外部サービスとの連携を設定します</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {integrationLinks.map((item) => (
          <div key={item.href} className="glass-card-enhanced" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, background: 'rgba(0,180,216,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Settings2Icon aria-hidden="true" style={{ width: 22, height: 22, color: '#00B4D8' }} />
                </div>
                <div>
                  <h2 style={{ color: 'white', fontSize: 15, fontWeight: 600, marginBottom: 2 }}>{item.title}</h2>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{item.description}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: item.statusColor, fontSize: 12, fontWeight: 600 }}>{item.status}</span>
                <Link
                  href={item.href}
                  aria-label={`${item.title}の設定ページへ移動`}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    minHeight: 44, padding: '8px 16px',
                    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 8, color: 'white', textDecoration: 'none', fontSize: 13,
                  }}
                >
                  設定する
                  <ExternalLinkIcon aria-hidden="true" style={{ width: 14, height: 14 }} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
