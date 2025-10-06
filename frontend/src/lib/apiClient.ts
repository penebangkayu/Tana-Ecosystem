// src/lib/apiClient.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3', // Tetap gunakan CoinGecko sebagai placeholder
  timeout: 10000,
});

// Fungsi dummy untuk getUsers dan deleteUser
export async function getUsers() {
  return []; // Kembalikan array kosong sebagai placeholder
}

export async function deleteUser(id: string) {
  console.log(`Deleting user ${id} - dummy function`);
  return { success: true }; // Kembalikan respons dummy
}