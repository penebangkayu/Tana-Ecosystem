"use client";

import { useState, useEffect } from "react";
import CandlestickChart from "../components/CandlestickChart";

export default function Home() {
  const [summaries, setSummaries] = useState({});
  const [selectedPair, setSelectedPair] = useState("btc_idr");
  const [priceHistory, setPriceHistory] = useState([]);

  // ✅ Fetch summaries dari backend (Indodax summaries)
  useEffect(() => {
    fetch("http://127.0.0.1:8000/indodax-summaries")
      .then((res) => res.json())
      .then((data) => {
        setSummaries(data.tickers || {});
      })
      .catch((err) => console.error("Error fetch summaries:", err));
  }, []);

  // ✅ Update candlestick chart setiap kali pair dipilih
  useEffect(() => {
    if (!selectedPair) return;

    const fetchOrderBook = () => {
      fetch(`http://127.0.0.1:8000/indodax-orderbook/${selectedPair}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.buy && data.sell) {
            const lastPrice =
              (Number(data.buy[0][0]) + Number(data.sell[0][0])) / 2;

            const newCandle = {
              time: Math.floor(Date.now() / 1000), // timestamp
              open: lastPrice,
              high: lastPrice * 1.01,
              low: lastPrice * 0.99,
              close: lastPrice,
            };

            setPriceHistory((prev) => [...prev.slice(-50), newCandle]); // simpan max 50 candle
          }
        })
        .catch((err) =>
          console.error(`Error fetch orderbook ${selectedPair}:`, err)
        );
    };

    fetchOrderBook();
    const interval = setInterval(fetchOrderBook, 5000); // update tiap 5 detik

    return () => clearInterval(interval);
  }, [selectedPair]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Tana Ecosystem</h1>
      <p>Website Prediksi Pasar Crypto & Bot Trading</p>

      {/* Dropdown Pair */}
      <div style={{ margin: "20px 0" }}>
        <label style={{ marginRight: "10px" }}>Pilih Pair: </label>
        <select
          value={selectedPair}
          onChange={(e) => setSelectedPair(e.target.value)}
        >
          {Object.keys(summaries).map((pair) => (
            <option key={pair} value={pair}>
              {pair.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Info harga */}
      {summaries[selectedPair] && (
        <div style={{ marginBottom: "20px" }}>
          <h3>Harga {selectedPair.toUpperCase()}</h3>
          <p>
            High 24h: {summaries[selectedPair].high} / Low 24h:{" "}
            {summaries[selectedPair].low}
          </p>
          <p>Last Price: {summaries[selectedPair].last}</p>
        </div>
      )}

      {/* 📊 Candlestick Chart */}
      <div style={{ marginTop: "40px" }}>
        <h3>Grafik Harga {selectedPair.toUpperCase()} (Candlestick)</h3>
        <CandlestickChart data={priceHistory} />
      </div>
    </div>
  );
}
