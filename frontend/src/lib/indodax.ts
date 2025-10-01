import axios from 'axios'

const BASE_URL = 'https://indodax.com/api'

export const getTicker = async (pair: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/ticker/${pair}`)
    return response.data.ticker
  } catch (error) {
    console.error('Error fetching Indodax ticker:', error)
    throw error
  }
}

export const getMarketInfo = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/summary`)
    return response.data
  } catch (error) {
    console.error('Error fetching Indodax market info:', error)
    throw error
  }
}
