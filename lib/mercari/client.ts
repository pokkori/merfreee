// mercari client - not used in this service
export function fetchMercariOrders(_accessToken: string): Promise<unknown[]> {
  return Promise.resolve([]);
}
export function exchangeMercariCode(_code: string): Promise<void> {
  return Promise.resolve();
}
export function getMercariShopId(_accessToken: string): Promise<string> {
  return Promise.resolve('');
}
