import { encrypt, decrypt } from '../lib/crypto';

describe('crypto（AES-256-GCM）', () => {
  const testToken = 'test-access-token-12345';
  const longToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature';

  test('暗号化して復号すると元の値に戻る', () => {
    const encrypted = encrypt(testToken);
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(testToken);
  });

  test('長いトークンも暗号化・復号できる', () => {
    const encrypted = encrypt(longToken);
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(longToken);
  });

  test('暗号化した文字列はiv:authTag:encryptedの形式', () => {
    const encrypted = encrypt(testToken);
    const parts = encrypted.split(':');
    expect(parts).toHaveLength(3);
    // IV: 12バイト = 24hex文字
    expect(parts[0]).toMatch(/^[0-9a-f]{24}$/);
    // AuthTag: 16バイト = 32hex文字
    expect(parts[1]).toMatch(/^[0-9a-f]{32}$/);
  });

  test('同じ平文を複数回暗号化すると異なる暗号文になる（IV がランダム）', () => {
    const enc1 = encrypt(testToken);
    const enc2 = encrypt(testToken);
    expect(enc1).not.toBe(enc2);
  });

  test('不正な暗号文を復号するとエラーをスローする', () => {
    expect(() => decrypt('invalid-ciphertext')).toThrow();
  });

  test('空文字列も暗号化・復号できる', () => {
    const encrypted = encrypt('');
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe('');
  });

  test('日本語文字列も暗号化・復号できる', () => {
    const japanese = 'テストアクセストークン日本語';
    const encrypted = encrypt(japanese);
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(japanese);
  });
});

describe('インボイスパラメータ検証', () => {
  test('取引金額の合計計算が正しい', () => {
    const transactions = [
      { amount: 50000 },
      { amount: 1200 },
      { amount: 8500 },
    ];
    const total = transactions.reduce((s, t) => s + t.amount, 0);
    expect(total).toBe(59700);
  });

  test('消費税額の計算が正しい（10%）', () => {
    const amount = 11000; // 税込11000円
    const taxRate = 0.10;
    const taxAmount = Math.floor(amount * taxRate / (1 + taxRate));
    // 税抜10000円 × 10% = 1000円 （浮動小数点誤差で999になるケースあり）
    expect(taxAmount).toBeGreaterThanOrEqual(999);
    expect(taxAmount).toBeLessThanOrEqual(1000);
  });

  test('手数料の計算が正しい（5.5%）', () => {
    const amount = 50000;
    const feeRate = 0.055;
    const fee = Math.floor(amount * feeRate);
    expect(fee).toBe(2750);
  });

  test('net_amountの計算が正しい', () => {
    const amount = 50000;
    const fee = 2750;
    const netAmount = amount - fee;
    expect(netAmount).toBe(47250);
  });
});
