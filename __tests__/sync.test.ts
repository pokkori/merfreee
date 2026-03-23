import { MOCK_ORDERS, fetchMercariOrdersMock } from '../lib/mercari/mock';

describe('メルカリShopsモックデータ', () => {
  test('モックデータが20件存在する', () => {
    expect(MOCK_ORDERS).toHaveLength(20);
  });

  test('全モックデータにorder_idが存在する', () => {
    MOCK_ORDERS.forEach((order) => {
      expect(order.order_id).toBeTruthy();
      expect(order.order_id).toMatch(/^mock-\d+$/);
    });
  });

  test('全モックデータにitem_nameが存在する', () => {
    MOCK_ORDERS.forEach((order) => {
      expect(order.item_name).toBeTruthy();
      expect(order.item_name.length).toBeGreaterThan(0);
    });
  });

  test('全モックデータのamountが正の整数', () => {
    MOCK_ORDERS.forEach((order) => {
      expect(order.amount).toBeGreaterThan(0);
      expect(Number.isInteger(order.amount)).toBe(true);
    });
  });

  test('全モックデータでnet_amount = amount - feeが成立する', () => {
    MOCK_ORDERS.forEach((order) => {
      expect(order.net_amount).toBe(order.amount - order.fee);
    });
  });

  test('全モックデータのtax_rateが0.10', () => {
    MOCK_ORDERS.forEach((order) => {
      expect(order.tax_rate).toBe(0.10);
    });
  });

  test('fetchMercariOrdersMockが日付範囲でフィルタリングする', async () => {
    const from = new Date('2026-03-01T00:00:00Z');
    const to = new Date('2026-03-10T23:59:59Z');
    const filtered = await fetchMercariOrdersMock(from, to);
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach((order) => {
      const soldAt = new Date(order.sold_at);
      expect(soldAt >= from).toBe(true);
      expect(soldAt <= to).toBe(true);
    });
  });

  test('fetchMercariOrdersMockが範囲外データを除外する', async () => {
    const from = new Date('2025-01-01T00:00:00Z');
    const to = new Date('2025-01-31T23:59:59Z');
    const filtered = await fetchMercariOrdersMock(from, to);
    expect(filtered).toHaveLength(0);
  });

  test('buyer_invoice_numberがT-で始まるか null', () => {
    MOCK_ORDERS.forEach((order) => {
      if (order.buyer_invoice_number !== null) {
        expect(order.buyer_invoice_number).toMatch(/^T-\d+$/);
      }
    });
  });
});
