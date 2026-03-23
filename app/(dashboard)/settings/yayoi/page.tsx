import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';
import { getYayoiOAuthUrl } from '@/lib/yayoi/client';

export default function YayoiSettingsPage() {
  const oauthUrl = getYayoiOAuthUrl(process.env.NEXT_PUBLIC_BASE_URL ?? 'https://merfreee.vercel.app');

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/settings" aria-label="連携設定ページへ戻る" style={{ color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <ArrowLeftIcon aria-hidden="true" style={{ width: 20, height: 20 }} />
        </Link>
        <h1 style={{ color: 'white', fontSize: 22, fontWeight: 700 }}>弥生会計Online連携設定</h1>
      </div>

      <div className="glass-card-enhanced" style={{ padding: 24, marginBottom: 20 }}>
        <h2 style={{ color: 'white', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>連携を設定する</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
          弥生会計OnlineのOAuth認証を行い、売上データを自動で仕訳として登録します。
          連携後はメルカリShopsの売上が毎日0時に自動で弥生に登録されます。
        </p>
        <a
          href={oauthUrl}
          aria-label="弥生会計OnlineとのOAuth認証を開始する"
          className="btn-primary"
          style={{ display: 'inline-flex', fontSize: 14, background: '#0A6EBD' }}
        >
          弥生会計Onlineと連携する
        </a>
      </div>

      <div className="glass-card-enhanced" style={{ padding: 24 }}>
        <h2 style={{ color: 'white', fontSize: 16, fontWeight: 600, marginBottom: 12 }}>仕訳登録フォーマット</h2>
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: 16, fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
          <p style={{ margin: '0 0 4px' }}>借方: 売掛金（1101）</p>
          <p style={{ margin: '0 0 4px' }}>貸方: 売上高（4101）</p>
          <p style={{ margin: '0 0 4px' }}>摘要: メルカリShops [商品名]</p>
          <p style={{ margin: 0 }}>税区分: 課税売上10%（または8%）</p>
        </div>
      </div>
    </div>
  );
}
