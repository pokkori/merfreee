'use client';

import { useEffect, useState } from 'react';

export function DailyMission() {
  const today = new Date().toISOString().slice(0, 10);
  const storageKey = `ecross_mission_${today}`;

  const [completed, setCompleted] = useState(false);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const data: { completed: boolean; points: number } = JSON.parse(raw);
        setCompleted(data.completed ?? false);
        setPoints(data.points ?? 0);
      }
    } catch {
      // localStorage 利用不可時は無視
    }
  }, [storageKey]);

  const handleComplete = () => {
    const newPoints = points + 10;
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ completed: true, points: newPoints })
      );
      // ストリークポイントにも加算
      const streakRaw = localStorage.getItem('ecross_streak');
      const streak = streakRaw
        ? (JSON.parse(streakRaw) as { count: number; lastDate: string; points: number })
        : { count: 1, lastDate: today, points: 0 };
      streak.points = (streak.points ?? 0) + 10;
      streak.lastDate = today;
      localStorage.setItem('ecross_streak', JSON.stringify(streak));
    } catch {
      // 無視
    }
    setCompleted(true);
    setPoints(newPoints);
  };

  return (
    <div
      style={{
        background: 'rgba(15,23,42,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${completed ? 'rgba(16,185,129,0.4)' : 'rgba(245,158,11,0.3)'}`,
        borderRadius: 16,
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 20,
        flexWrap: 'wrap',
      }}
      role="region"
      aria-label="今日のミッション"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* アイコン: ターゲットSVG */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: completed ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          {completed ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          )}
        </div>
        <div>
          <p
            style={{
              color: completed ? '#10B981' : 'white',
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 2,
            }}
          >
            {completed ? 'ミッション完了！' : '今日のミッション'}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>
            {completed
              ? `+10pt を獲得しました（合計 ${points}pt）`
              : '新着商品を1件チェックしよう (+10pt)'}
          </p>
        </div>
      </div>
      {!completed && (
        <button
          onClick={handleComplete}
          aria-label="今日のミッションを完了する"
          style={{
            background: '#F59E0B',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '8px 18px',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            minHeight: 44,
            whiteSpace: 'nowrap',
          }}
        >
          完了
        </button>
      )}
    </div>
  );
}
