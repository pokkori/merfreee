'use client';

import { useEffect, useState } from 'react';
import { KpiCard } from './KpiCard';
import { DashboardStats } from '@/types';

interface DashboardKpiClientProps {
  serverStats: Omit<DashboardStats, 'saved_items_count' | 'streak_count' | 'total_points'>;
}

export function DashboardKpiClient({ serverStats }: DashboardKpiClientProps) {
  const [savedCount, setSavedCount] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    // 保存済み件数
    try {
      const raw = localStorage.getItem('ecross_saved_items') || '[]';
      const saved: unknown[] = JSON.parse(raw);
      setSavedCount(Array.isArray(saved) ? saved.length : 0);
    } catch {
      setSavedCount(0);
    }

    // ストリーク
    try {
      const streakRaw = localStorage.getItem('ecross_streak');
      if (streakRaw) {
        const streakData: { count: number; lastDate: string; points: number } =
          JSON.parse(streakRaw);
        const today = new Date().toISOString().slice(0, 10);
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        if (
          streakData.lastDate === today ||
          streakData.lastDate === yesterday
        ) {
          setStreakCount(streakData.count ?? 0);
          setTotalPoints(streakData.points ?? 0);
        }
      }
    } catch {
      setStreakCount(0);
    }
  }, []);

  const stats: DashboardStats = {
    ...serverStats,
    saved_items_count: savedCount,
    streak_count: streakCount,
    total_points: totalPoints,
  };

  return <KpiCard stats={stats} />;
}
