"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [selectedPair, setSelectedPair] = useState(""); // awalnya kosong
  const [ticker, setTicker] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch ticker saat user pilih pair
  useEffect(() => {
    if (!selectedPair) return; // jika belum pilih, jangan fetch
    setLoading(true);
    async function fetchTicker() {
      try {
        const res = await fetch(`https://indodax.com/api/${selectedPair}/ticker`);
        const data = await res.json();
        setTicker(data.ticker);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTicker();
  }, [selectedPair]);

  const handleSelect = (pair) => {
    setSelectedPair(pair);
    setTicker(null);
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif", padding: "20px" }}>
      <h1 style={{ color: "#1e1e2f" }}>Tana Ecosystem</h1>
      <p>Website Prediksi Pasar Crypto & Bot Trading</p>

      <div style={{ margin: "20px 0" }}>
        <label>Pilih Ticker: </label>
        <select value={selectedPair} onChange={(e) => handleSelect(e.target.value)}>
          <option value="">-- Pilih Pair --</option>
          <option value="btc_idr">BTC/IDR</option>
          <option value="xrp_idr">XRP/IDR</option>
          <option value="eth_idr">ETH/IDR</option>
        </select>
      </div>

      {loading && <p>Memuat data ticker...</p>}

      {ticker && (
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
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
    </div>
  );
}
