"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [markets, setMarkets] = useState([]);
  const [selectedPair, setSelectedPair] = useState("btc_idr");

  useEffect(() => {
    async function fetchMarkets() {
      const res = await fetch("https://indodax.com/api/summaries");
      const data = await res.json();
      setMarkets(data);
    }
    fetchMarkets();
  }, []);

  const marketData = markets.find((market) => market.pair === selectedPair);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", padding: "20px" }}>
      <h1 style={{ color: "#1e1e2f" }}>Tana Ecosystem</h1>
      <p>Website Prediksi Pasar Crypto & Bot Trading</p>

      <div style={{ margin: "20px 0" }}>
        <label>Pilih Pair: </label>
        <select value={selectedPair} onChange={(e) => setSelectedPair(e.target.value)}>
          {markets.map((market) => (
            <option key={market.pair} value={market.pair}>
              {market.pair.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {marketData ? (
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "300px", background: "#fff", padding: "16px", borderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <h2>TICKERS</h2>
            <p>Last: {marketData.last}</p>
            <p>High: {marketData.high}</p>
            <p>Low: {marketData.low}</p>
            <p>Volume: {marketData.vol}</p>
          </div>
        </div>
      ) : (
        <p>Memuat data...</p>
      )}
    </div>
  );
}
