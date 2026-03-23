'use client';

import { useState } from 'react';
import { FileTextIcon, DownloadIcon } from 'lucide-react';

export default function InvoicesPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const periodStart = '2026-03-01T00:00:00Z';
      const periodEnd = '2026-03-31T23:59:59Z';

      const res = await fetch('/api/invoices/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ periodStart, periodEnd }),
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        setError(data.error ?? 'PDF生成に失敗しました');
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'invoice-2026-03.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: 'white', fontSize: 24, fontWeight: 700, marginBottom: 4 }}>適格請求書</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>インボイス制度対応の適格請求書をPDFで発行できます</p>
      </div>

      <div className="glass-card-mid" style={{ padding: 24, marginBottom: 24 }}>
        <h2 style={{ color: 'white', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>請求書を発行する</h2>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            <label htmlFor="period" style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6 }}>
              対象期間
            </label>
            <select
              id="period"
              aria-label="適格請求書の対象期間を選択"
              style={{
                minHeight: 44, padding: '10px 14px', background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, color: 'white', fontSize: 14,
              }}
            >
              <option value="2026-03" style={{ background: '#03045E' }}>2026年3月</option>
              <option value="2026-02" style={{ background: '#03045E' }}>2026年2月</option>
              <option value="2026-01" style={{ background: '#03045E' }}>2026年1月</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <button
              onClick={handleGenerate}
              disabled={loading}
              aria-label="選択した期間の適格請求書PDFを生成してダウンロードする"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                minHeight: 44, padding: '10px 20px',
                background: '#0A6EBD', color: 'white', border: 'none',
                borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              <DownloadIcon aria-hidden="true" style={{ width: 16, height: 16 }} />
              {loading ? '生成中...' : 'PDFをダウンロード'}
            </button>
          </div>
        </div>
        {error && (
          <p role="alert" style={{ color: '#EF4444', fontSize: 13, marginTop: 10 }}>{error}</p>
        )}
      </div>

      <div className="glass-card-mid" style={{ padding: 24 }}>
        <h2 style={{ color: 'white', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>発行済み請求書</h2>
        <div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.3)' }}
          role="status"
          aria-label="発行済み請求書なし"
        >
          <FileTextIcon aria-hidden="true" style={{ width: 40, height: 40, marginBottom: 12 }} />
          <p style={{ fontSize: 14 }}>まだ請求書はありません</p>
          <p style={{ fontSize: 12, marginTop: 4 }}>上のボタンから最初の適格請求書を発行してください</p>
        </div>
      </div>
    </div>
  );
}
