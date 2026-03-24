// mercari mock - not used in this service
export const MOCK_ORDERS: unknown[] = [];
export function fetchMercariOrdersMock(): Promise<unknown[]> {
  return Promise.resolve([]);
}
