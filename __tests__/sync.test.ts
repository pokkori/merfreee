// 越境アービトラージ: eBay APIユーティリティテスト
import { usdToJpy } from '../lib/ebay/search';
import { CATEGORY_EBAY_KEYWORDS, DOMESTIC_PRICE_MOCK } from '../lib/ebay/categories';

describe('eBay カテゴリデータ', () => {
  test('8カテゴリのキーワードが定義されている', () => {
    expect(Object.keys(CATEGORY_EBAY_KEYWORDS)).toHaveLength(8);
  });

  test('全カテゴリに1件以上のキーワードが存在する', () => {
    Object.entries(CATEGORY_EBAY_KEYWORDS).forEach(([category, keywords]) => {
      expect(keywords.length).toBeGreaterThan(0);
      expect(typeof keywords[0]).toBe('string');
      expect(keywords[0].length).toBeGreaterThan(0);
      void category;
    });
  });

  test('国内価格モックデータが8カテゴリ分存在する', () => {
    expect(Object.keys(DOMESTIC_PRICE_MOCK)).toHaveLength(8);
  });

  test('全カテゴリのモック価格がlow < highの関係になっている', () => {
    Object.entries(DOMESTIC_PRICE_MOCK).forEach(([category, mock]) => {
      expect(mock.low).toBeLessThan(mock.high);
      expect(mock.low).toBeGreaterThan(0);
      void category;
    });
  });
});

describe('usdToJpy 換算', () => {
  beforeEach(() => {
    process.env.EXCHANGE_RATE_USD_JPY = '150';
  });

  test('$100 → ¥15,000', () => {
    expect(usdToJpy(100)).toBe(15000);
  });

  test('$0 → ¥0', () => {
    expect(usdToJpy(0)).toBe(0);
  });

  test('小数点以下は四捨五入される', () => {
    process.env.EXCHANGE_RATE_USD_JPY = '149';
    // 1.5 * 149 = 223.5 → 224
    expect(usdToJpy(1.5)).toBe(224);
  });
});
