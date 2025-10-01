import { apiClient } from './apiClient';

export async function fetchMarkets() {
  try {
    const response = await apiClient.get('/coins/markets', {
      params: { vs_currency: 'usd', order: 'market_cap_desc', per_page: 10 },
    });
    return response.data;
  } catch (err) {
    console.error('Failed to fetch markets', err);
    return [];
  }
}
