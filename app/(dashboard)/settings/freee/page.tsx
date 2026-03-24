'use client';

import { useState } from 'react';

interface JournalEntry {
  id: string;
  date: string;
  amount: string;
  description: string;
}

function generateFreeeCSV(entries: JournalEntry[]): string {
  const header = [
    '管理番号',
    '取引日',
    '借方勘定科目',
    '借方補助科目',
    '借方税区分',
    '借方金額',
    '借方税額',
    '貸方勘定科目',
    '貸方補助科目',
    '貸方税区分',
    '貸方金額',
    '貸方税額',
    '摘要',
  ].join(',');

  const rows = entries
    .filter((e) => e.date && e.amount && e.description)
    .map((e, i) => {
      const amount = parseInt(e.amount.replace(/[^0-9]/g, ''), 10) || 0;
      return [
        i + 1,
        e.date,
        '売上高',
        '',
        '課税売上10%',
        amount,
        Math.floor(amount * 0.1),
        '売掛金',
        '',
        '',
        amount,
        '',
        e.description,
      ].join(',');
    });

  return [header, ...rows].join('\n');
}

export default function FreeeSettingsPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([
    { id: '1', date: '', amount: '', description: '' },
  ]);
  const [downloaded, setDownloaded] = useState(false);

  const addEntry = () => {
    setEntries((prev) => [
      ...prev,
      { id: String(Date.now()), date: '', amount: '', description: '' },
    ]);
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const updateEntry = (id: string, field: keyof Omit<JournalEntry, 'id'>, value: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const handleDownload = () => {
    const validEntries = entries.filter((e) => e.date && e.amount && e.description);
    if (validEntries.length === 0) return;

    const csv = generateFreeeCSV(validEntries);
    const bom = '\uFEFF';
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `freee_journal_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const hasValidEntry = entries.some((e) => e.date && e.amount && e.description);

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(245,158,11,0.3)',
    borderRadius: 8,
    padding: '10px 12px',
    color: 'white',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    minHeight: 44,
    width: '100%',
  };

  return (
    <div>
      {/* ヘッダー */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            color: 'white',
            fontSize: 24,
            fontWeight: 800,
            marginBottom: 8,
          }}
        >
          freee 仕訳CSV出力
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>
          取引データを入力してfreee形式のCSVをダウンロードできます
        </p>
      </div>

      {/* 説明カード */}
      <div
        style={{
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: 12,
          padding: '14px 18px',
          marginBottom: 24,
        }}
        aria-label="freee CSV出力の説明"
      >
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: 0, lineHeight: 1.7 }}>
          freeeの「取引インポート」機能でCSVをアップロードすることで、仕訳を一括登録できます。
          借方は「売上高」、貸方は「売掛金」として出力されます。必要に応じてfreee上で編集してください。
        </p>
      </div>

      {/* 入力フォーム */}
      <div
        style={{
          background: 'rgba(15,23,42,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(245,158,11,0.25)',
          borderRadius: 16,
          padding: 28,
          marginBottom: 24,
        }}
        aria-label="仕訳入力フォーム"
      >
        {/* カラムヘッダー */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '160px 1fr 2fr 44px',
            gap: 12,
            marginBottom: 12,
          }}
        >
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, margin: 0 }}>取引日</p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, margin: 0 }}>金額（円）</p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, margin: 0 }}>摘要</p>
          <div />
        </div>

        {/* エントリ行 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {entries.map((entry) => (
            <div
              key={entry.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '160px 1fr 2fr 44px',
                gap: 12,
                alignItems: 'center',
              }}
            >
              <input
                type="date"
                value={entry.date}
                onChange={(e) => updateEntry(entry.id, 'date', e.target.value)}
                aria-label="取引日を入力"
                style={inputStyle}
              />
              <input
                type="number"
                value={entry.amount}
                onChange={(e) => updateEntry(entry.id, 'amount', e.target.value)}
                aria-label="金額を入力（円）"
                placeholder="10000"
                min="0"
                style={inputStyle}
              />
              <input
                type="text"
                value={entry.description}
                onChange={(e) => updateEntry(entry.id, 'description', e.target.value)}
                aria-label="摘要を入力"
                placeholder="eBay出品売上 - ドラゴンボールフィギュア"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => removeEntry(entry.id)}
                disabled={entries.length === 1}
                aria-label="この行を削除する"
                style={{
                  background: 'rgba(239,68,68,0.15)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 8,
                  color: entries.length === 1 ? 'rgba(255,255,255,0.2)' : '#EF4444',
                  cursor: entries.length === 1 ? 'not-allowed' : 'pointer',
                  minHeight: 44,
                  width: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* 行追加ボタン */}
        <button
          type="button"
          onClick={addEntry}
          aria-label="取引行を追加する"
          style={{
            marginTop: 16,
            background: 'rgba(245,158,11,0.1)',
            border: '1px dashed rgba(245,158,11,0.4)',
            borderRadius: 8,
            color: '#F59E0B',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            minHeight: 44,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          行を追加する
        </button>
      </div>

      {/* ダウンロードボタン */}
      <button
        type="button"
        onClick={handleDownload}
        disabled={!hasValidEntry}
        aria-label="freee形式のCSVをダウンロードする"
        style={{
          background: downloaded ? '#059669' : hasValidEntry ? '#10B981' : 'rgba(255,255,255,0.1)',
          color: hasValidEntry ? 'white' : 'rgba(255,255,255,0.3)',
          border: 'none',
          borderRadius: 8,
          padding: '12px 28px',
          fontSize: 15,
          fontWeight: 700,
          minHeight: 44,
          cursor: hasValidEntry ? 'pointer' : 'not-allowed',
          transition: 'background 0.3s',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {downloaded ? 'ダウンロードしました' : 'CSVをダウンロード'}
      </button>

      {/* 注意事項 */}
      <div
        style={{
          marginTop: 20,
          background: 'rgba(15,23,42,0.6)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
          padding: '14px 18px',
        }}
      >
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0, lineHeight: 1.8 }}>
          出力されるCSVはfreeeの仕訳インポート形式に準拠しています。
          正式な会計処理については税理士にご相談ください。消費税率は10%で計算されています。
        </p>
      </div>
    </div>
  );
}
