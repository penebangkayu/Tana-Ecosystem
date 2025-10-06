// src/lib/apiClient.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3', // Placeholder aman
  timeout: 10000,
});

// Ekspor dummy untuk menghindari error impor
export async function getUsers() {
  return []; // Array kosong sebagai placeholder
}

export async function deleteUser(id: string) {
  console.log(`Dummy delete for id: ${id}`);
  return { success: true };
}

export async function fetchMarketHistory() {
  return []; // Placeholder untuk markets/[symbol]
}

export async function fetchIndodaxMarket() {
  return []; // Placeholder untuk indodax
}