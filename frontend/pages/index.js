"use client";
import { useEffect, useState, useRef } from "react";
import CandlestickChart from "../components/candlestickchart";

export default function Home() {
  const [selectedPair, setSelectedPair] = useState("");
  const [ticker, setTicker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [candleData, setCandleData] = useState([]);
  const intervalRef = useRef();

  const popularPairs = ["btc_idr", "xrp_idr", "eth_idr"];

  async function fetchTickerAndCandle(pair) {
    setLoading(true);
    try {
      const res = await fetch(`https://indodax.com/api/${pair}/ticker`);
      const data = await res.json();
      setTicker(data.ticker);

      // Pastikan format data candle benar
      const dummyCandles = [];
      let price = parseFloat(data.ticker.last);
      for (let i = 0; i < 30; i++) {
        const open = Number((price - Math.random() * 1000).toFixed(2));
        const close = Number((price + Math.random() * 1000).toFixed(2));
        const high = Number((Math.max(open, close) + Math.random() * 500).toFixed(2));
        const low = Number((Math.min(open, close) - Math.random() * 500).toFixed(2));
        dummyCandles.push({
          time: Math.floor(Date.now() / 1000) - (30 - i) * 86400,
          open,
          high,
          low,
          close,
        });
      }
      setCandleData(dummyCandles);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!selectedPair) {
      setTicker(null);
      setCandleData([]);
      return;
    }
    fetchTickerAndCandle(selectedPair);

    intervalRef.current = setInterval(() => {
      fetchTickerAndCandle(selectedPair);
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [selectedPair]);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", padding: "20px" }}>
      <h1 style={{ color: "#1e1e2f" }}>Tana Ecosystem</h1>
      <p>Website Prediksi Pasar Crypto & Bot Trading</p>

      <div style={{ margin: "20px 0" }}>
        <label>Pilih Ticker: </label>
        <select value={selectedPair} onChange={(e) => setSelectedPair(e.target.value)}>
          <option value="">-- Pilih Pair --</option>
          {popularPairs.map((pair) => (
            <option key={pair} value={pair}>
              {pair.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Memuat data ticker...</p>}

      {ticker && (
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "20px" }}>
          <div
            style={{
              flex: 1,
              minWidth: "300px",
              background: "#fff",
              padding: "16px",
              borderRadius: "12px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            }}
          >
            <h2>TICKER {selectedPair.toUpperCase()}</h2>
            <p>Last: {ticker.last}</p>
            <p>High: {ticker.high}</p>
            <p>Low: {ticker.low}</p>
            <p>Volume: {ticker.vol}</p>
          </div>
        </div>
      )}

      {/* Debug: lihat data candle di browser */}
      {/* <pre>{JSON.stringify(candleData, null, 2)}</pre> */}

      {candleData.length > 0 && <CandlestickChart data={candleData} />}
    </div>
  );
}
