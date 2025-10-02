import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 10000,
});

// contoh fungsi getUsers
export async function getUsers() {
  const response = await apiClient.get('/users'); 
  return response.data;
}

// contoh fungsi deleteUser
export async function deleteUser(id: string) {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
}
