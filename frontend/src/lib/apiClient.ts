// src/lib/apiClient.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3', // <-- ini CoinGecko, tidak ada /users
  timeout: 10000,
});

// kalau memang mau ada admin/users, baseURL harus ganti ke backendmu sendiri
export async function getUsers() {
  const response = await apiClient.get('/users');
  return response.data;
}

export async function deleteUser(id: string) {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
}
