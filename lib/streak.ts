import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// JSTの今日の日付を 'YYYY-MM-DD' 形式で返す
export function getTodayJst(): string {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return jst.toISOString().slice(0, 10);
}

// 日付差分を日数で返す（JST基準）
export function diffDays(dateA: string, dateB: string): number {
  const msA = new Date(dateA).getTime();
  const msB = new Date(dateB).getTime();
  return Math.round(Math.abs(msA - msB) / (1000 * 60 * 60 * 24));
}

// ストリーク更新ロジック
export async function updateStreak(userId: string): Promise<{ streak_count: number; points_earned: number }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { streak_count: 0, points_earned: 0 };
  }

  // 1. users テーブルから streak_count・streak_last_date を取得
  const { data: user, error } = await supabase
    .from('users')
    .select('streak_count, streak_last_date, total_points')
    .eq('id', userId)
    .single();

  if (error || !user) {
    return { streak_count: 0, points_earned: 0 };
  }

  const today = getTodayJst();
  const lastDate = user.streak_last_date as string | null;
  const currentStreak = user.streak_count as number;

  let newStreak = currentStreak;
  let pointsEarned = 0;

  if (lastDate === today) {
    // 同日: 変化なし
    return { streak_count: currentStreak, points_earned: 0 };
  } else if (lastDate && diffDays(today, lastDate) === 1) {
    // 翌日ログイン: streak_count + 1
    newStreak = currentStreak + 1;
  } else {
    // 2日以上空いた: streak_count = 1
    newStreak = 1;
  }

  // 3. ポイント計算:
  pointsEarned += 10; // 毎日ログイン: +10pt
  if (newStreak === 7) pointsEarned += 50; // 7日連続: +50pt ボーナス
  if (newStreak === 30) pointsEarned += 200; // 30日連続: +200pt ボーナス

  const newTotalPoints = (user.total_points as number) + pointsEarned;

  // 4. users テーブルを更新
  await supabase
    .from('users')
    .update({
      streak_count: newStreak,
      streak_last_date: today,
      total_points: newTotalPoints,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  // 5. { streak_count, points_earned } を返す
  return { streak_count: newStreak, points_earned: pointsEarned };
}

// ストリーク取得（表示用）
export async function getStreakStatus(
  userId: string
): Promise<{ streak_count: number; total_points: number; next_bonus_at: number }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { streak_count: 0, total_points: 0, next_bonus_at: 7 };
  }

  const { data: user } = await supabase
    .from('users')
    .select('streak_count, total_points')
    .eq('id', userId)
    .single();

  const streakCount = (user?.streak_count as number) ?? 0;
  const totalPoints = (user?.total_points as number) ?? 0;

  // next_bonus_at: 次のボーナス付与まで何日か
  let nextBonusAt = 7;
  if (streakCount >= 30) {
    nextBonusAt = 30;
  } else if (streakCount >= 7) {
    nextBonusAt = 30 - streakCount;
  } else {
    nextBonusAt = 7 - streakCount;
  }

  return { streak_count: streakCount, total_points: totalPoints, next_bonus_at: nextBonusAt };
}
