import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const CandlestickChart = dynamic(() => import("../components/candlestickchart"), {
  ssr: false,
});

export default function Home() {
  const [summaries, setSummaries] = useState({});
  const [orderbook, setOrderbook] = useState(null);
  const [selectedPair, setSelectedPair] = useState("btc_idr");

  // URL backend kamu (ubah ke URL Render/Railway kalau sudah deploy backend)
  const API_BASE = "https://tana-backend.onrender.com";

  // ambil summaries
  useEffect(() => {
    async function fetchSummaries() {
      const res = await fetch(`${API_BASE}/summaries`);
      const data = await res.json();
      setSummaries(data.tickers || {});
    }
    fetchSummaries();
  }, []);

  // ambil orderbook sesuai pair
  useEffect(() => {
    async function fetchOrderbook() {
      if (!selectedPair) return;
      const res = await fetch(`${API_BASE}/orderbook/${selectedPair}`);
      const data = await res.json();
      setOrderbook(data);
    }
    fetchOrderbook();
  }, [selectedPair]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Tana Ecosystem</h1>
      <p>Website Prediksi Pasar Crypto & Bot Trading</p>

      {/* pilih pair */}
      <div>
        <label>Pilih Pair: </label>
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

      {/* grafik */}
      <div style={{ height: "500px", marginTop: "20px" }}>
        <h2>Grafik Harga {selectedPair.toUpperCase()} (Candlestick)</h2>
        <CandlestickChart pair={selectedPair} />
      </div>

      {/* orderbook */}
      <div style={{ marginTop: "20px" }}>
        <h2>Order Book {selectedPair.toUpperCase()}</h2>
        {orderbook ? (
          <div style={{ display: "flex", gap: "40px" }}>
            <div>
              <h3>Bids</h3>
              <ul>
                {orderbook.buy.slice(0, 10).map((bid, idx) => (
                  <li key={idx}>{bid.join(" | ")}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Asks</h3>
              <ul>
                {orderbook.sell.slice(0, 10).map((ask, idx) => (
                  <li key={idx}>{ask.join(" | ")}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p>Loading orderbook...</p>
        )}
      </div>
    </div>
  );
}
