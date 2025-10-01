import { useState, useEffect } from 'react'
import axios from 'axios'

export function usePrediction(symbol: string) {
  const [data, setData] = useState<{ time: string; prediction: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    axios.get(`/api/prediction/${symbol}`).then((res) => {
      setData(res.data)
      setLoading(false)
    })
  }, [symbol])

  return { data, loading }
}
