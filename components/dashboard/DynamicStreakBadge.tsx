'use client';

import { useEffect, useState } from 'react';
import { getStreak } from '@/lib/streak';
import { StreakBadge } from './StreakBadge';

export function DynamicStreakBadge() {
  const [streakCount, setStreakCount] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

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
  }, []);

  return <StreakBadge streakCount={streakCount} totalPoints={totalPoints} />;
}
