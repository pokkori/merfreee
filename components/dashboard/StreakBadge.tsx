'use client';

import { useEffect, useState } from 'react';
import { updateStreak, getStreakMilestoneMessage, StreakData } from '@/lib/streak';

const STREAK_KEY = 'merfreee';

export function StreakBadge() {
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [milestone, setMilestone] = useState<string | null>(null);

  useEffect(() => {
    const updated = updateStreak(STREAK_KEY);
    setStreak(updated);
    setMilestone(getStreakMilestoneMessage(updated.count));
  }, []);

  if (!streak) return null;

  return (
    <div
      aria-label={`連続利用${streak.count}日ストリークバッジ`}
      role="status"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 14px',
        borderRadius: 20,
        background: 'rgba(0,180,216,0.15)',
        border: '1px solid rgba(0,180,216,0.4)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width={16}
        height={16}
        fill="none"
        stroke="#00B4D8"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
      <span style={{ color: '#00B4D8', fontWeight: 700, fontSize: 14 }}>
        {streak.count}日連続
      </span>
      {milestone && (
        <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginLeft: 4 }}>
          {milestone}
        </span>
      )}
    </div>
  );
}
