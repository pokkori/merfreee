'use client';

import { useState } from 'react';
import { TreasureItem } from '@/types';

interface AiAnalysisStreamProps {
  item: TreasureItem;
}

export function AiAnalysisStream({ item }: AiAnalysisStreamProps) {
  const [analysisText, setAnalysisText] = useState('');
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const startAnalysis = async () => {
    setLoading(true);
    setStarted(true);
    setAnalysisText('');

    try {
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_name: item.item_name,
          domestic_price_low: item.domestic_price_low,
          domestic_price_high: item.domestic_price_high,
          overseas_price_low: item.overseas_price_low,
          overseas_price_high: item.overseas_price_high,
          roi_pct: item.roi_pct,
        }),
      });

      if (!response.ok || !response.body) {
        setAnalysisText('AI分析を利用できません。');
        setLoading(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        // SSEフォーマット解析
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data) as {
                type?: string;
                delta?: { type?: string; text?: string };
              };
              if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
                accumulated += parsed.delta.text ?? '';
                setAnalysisText(accumulated);
              }
            } catch {
              // JSON parse error は無視
            }
          }
        }
      }
    } catch {
      setAnalysisText('AI分析に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  if (!started) {
    return (
      <button
        onClick={startAnalysis}
        aria-label={`${item.item_name}のAI分析を開始する`}
        style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 6,
          color: '#F59E0B',
          fontSize: 13,
          cursor: 'pointer',
          padding: '6px 12px',
          minHeight: 44,
        }}
      >
        AI分析を見る
      </button>
    );
  }

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(245,158,11,0.15)',
        borderRadius: 8,
        padding: '10px 14px',
        minHeight: 44,
      }}
      aria-label="AI分析コメント"
      aria-live="polite"
    >
      {loading && !analysisText ? (
        <span style={{ color: 'rgba(248,250,252,0.5)', fontSize: 13, fontStyle: 'italic' }}>
          AI分析中...
        </span>
      ) : (
        <p style={{ color: 'rgba(248,250,252,0.7)', fontSize: 14, fontStyle: 'italic', margin: 0 }}>
          {analysisText}
        </p>
      )}
    </div>
  );
}
