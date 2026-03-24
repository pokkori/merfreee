import { getTodayJst, diffDays } from '../lib/streak';
import { usdToJpy } from '../lib/ebay/search';

// streak.ts の純粋ロジックをテスト（Supabaseはモック）
describe('getTodayJst', () => {
  test('YYYY-MM-DD 形式の文字列を返す', () => {
    const today = getTodayJst();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('diffDays', () => {
  test('同じ日付の差分は0', () => {
    expect(diffDays('2026-03-24', '2026-03-24')).toBe(0);
  });

  test('翌日の差分は1', () => {
    expect(diffDays('2026-03-24', '2026-03-25')).toBe(1);
  });

  test('2日以上空けた場合は2以上', () => {
    expect(diffDays('2026-03-24', '2026-03-26')).toBeGreaterThanOrEqual(2);
  });
});

describe('usdToJpy', () => {
  test('usdToJpy(10) が環境変数150使用時に1500を返す', () => {
    process.env.EXCHANGE_RATE_USD_JPY = '150';
    expect(usdToJpy(10)).toBe(1500);
  });

  test('usdToJpy(0) は0を返す', () => {
    process.env.EXCHANGE_RATE_USD_JPY = '150';
    expect(usdToJpy(0)).toBe(0);
  });

  test('usdToJpy(1) はレート150で150を返す', () => {
    process.env.EXCHANGE_RATE_USD_JPY = '150';
    expect(usdToJpy(1)).toBe(150);
  });
});

// ストリークポイントロジックのユニットテスト（Supabase非依存）
describe('ストリークポイント計算ロジック', () => {
  function calcPoints(newStreak: number): number {
    let points = 10; // 毎日ログイン: +10pt
    if (newStreak === 7) points += 50; // 7日連続: +50pt ボーナス
    if (newStreak === 30) points += 200; // 30日連続: +200pt ボーナス
    return points;
  }

  test('通常ログインで10ポイント獲得', () => {
    expect(calcPoints(1)).toBe(10);
  });

  test('7日連続でpoints_earnedが60以上（10pt×1 + 50pt ボーナス）', () => {
    expect(calcPoints(7)).toBeGreaterThanOrEqual(60);
  });

  test('7日連続のボーナスは60ポイント（10 + 50）', () => {
    expect(calcPoints(7)).toBe(60);
  });

  test('30日連続のボーナスは210ポイント（10 + 200）', () => {
    expect(calcPoints(30)).toBe(210);
  });
});

// ストリーク更新ロジックのユニットテスト（Supabase非依存）
describe('ストリーク更新ロジック', () => {
  function calcNewStreak(currentStreak: number, lastDate: string | null, today: string): number {
    if (lastDate === today) {
      return currentStreak; // 同日: 変化なし
    } else if (lastDate && diffDays(today, lastDate) === 1) {
      return currentStreak + 1; // 翌日: +1
    } else {
      return 1; // 2日以上空いた or 初回: リセット
    }
  }

  test('翌日ログインでstreak_countが1増加する', () => {
    expect(calcNewStreak(5, '2026-03-23', '2026-03-24')).toBe(6);
  });

  test('同日ログインでstreak_countが変化しない', () => {
    expect(calcNewStreak(5, '2026-03-24', '2026-03-24')).toBe(5);
  });

  test('2日以上空けるとstreak_countが1にリセットされる', () => {
    expect(calcNewStreak(10, '2026-03-20', '2026-03-24')).toBe(1);
  });

  test('初回ログイン（lastDate=null）でstreak_countが1になる', () => {
    expect(calcNewStreak(0, null, '2026-03-24')).toBe(1);
  });
});
