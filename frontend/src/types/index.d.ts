export interface Market {
  symbol: string
  lastPrice: number
  high24h: number
  low24h: number
  volume24h: number
}

export interface Prediction {
  symbol: string
  predictedPrice: number
  confidence: number
  timestamp: number
}

export interface Order {
  symbol: string
  side: 'buy' | 'sell'
  price: number
  amount: number
}
