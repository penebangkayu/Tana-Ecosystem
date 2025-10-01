import { apiClient } from './apiClient'

export const getPrediction = async (symbol: string) => {
  const res = await apiClient.get(`/prediction/${symbol}`)
  return res.data
}
