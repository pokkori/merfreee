'use client';

import { useEffect, useState } from 'react';
import { getStreak } from '@/lib/streak';
import { StreakBadge } from './StreakBadge';

export function DynamicStreakBadge() {
  const [streakCount, setStreakCount] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [celebration, setCelebration] = useState<{ message: string; points: number } | null>(null);

  useEffect(() => {
    const streak = getStreak();
    setStreakCount(streak);

    // ポイントをlocalStorageから取得
    try {
      const raw = localStorage.getItem('ecross_streak');
      if (raw) {
        const data = JSON.parse(raw);
        setTotalPoints(data.points ?? streak * 10);
      } else {
        setTotalPoints(streak * 10);
      }
    } catch {
      setTotalPoints(streak * 10);
    }

    // ストリーク達成アニメーション: 7日または30日達成時
    const today = new Date().toDateString();
    const lastCelebrated = localStorage.getItem('ecross_lastCelebrated');

    if (lastCelebrated !== today && (streak === 7 || streak === 30)) {
      const bonusPoints = streak === 30 ? 200 : 50;
      const message = streak === 30 ? `30日連続達成！ボーナス+${bonusPoints}pt` : `7日連続達成！ボーナス+${bonusPoints}pt`;
      setCelebration({ message, points: bonusPoints });
      localStorage.setItem('ecross_lastCelebrated', today);

      // 3秒後に自動消去
      setTimeout(() => setCelebration(null), 3000);
    }
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <StreakBadge streakCount={streakCount} totalPoints={totalPoints} />
      {celebration && (
        <div
          role="status"
          aria-live="assertive"
          aria-label={celebration.message}
          style={{
            position: 'absolute',
            top: -60,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            color: 'white',
            fontWeight: 800,
            fontSize: 14,
            padding: '8px 18px',
            borderRadius: 10,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 20px rgba(245,158,11,0.5)',
            animation: 'streakPopup 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
            zIndex: 100,
          }}
        >
          {celebration.message}
          <div
            style={{
              position: 'absolute',
              bottom: -6,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #D97706',
            }}
          />
        </div>
      )}
      <style>{`
        @keyframes streakPopup {
          0% { opacity: 0; transform: translateX(-50%) scale(0.7) translateY(10px); }
          60% { opacity: 1; transform: translateX(-50%) scale(1.05) translateY(-2px); }
          100% { opacity: 1; transform: translateX(-50%) scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
