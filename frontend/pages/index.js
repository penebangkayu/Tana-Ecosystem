"use client";
import { useState, useEffect, useRef } from "react";
import CandlestickChart from "../components/candlestickchart";

// Dummy data market crypto untuk body list market
const marketList = [
  { symbol: "BTC/IDR", last: "900,000,000", vol: "200" },
  { symbol: "ETH/IDR", last: "55,000,000", vol: "150" },
  { symbol: "XRP/IDR", last: "8,000", vol: "5000" },
];

export default function Home() {
  const [selectedPair, setSelectedPair] = useState("");
  const [ticker, setTicker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [candleData, setCandleData] = useState([]);
  const intervalRef = useRef();
  const [markets, setMarkets] = useState(marketList);

  const popularPairs = ["btc_idr", "xrp_idr", "eth_idr"];

  // Fetch ticker dan dummy candle untuk chart
  async function fetchTickerAndCandle(pair) {
    setLoading(true);
    try {
      const res = await fetch(`https://indodax.com/api/${pair}/ticker`);
      const data = await res.json();
      setTicker(data.ticker);

      // Dummy candlestick data, format harus sesuai lightweight-charts
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

  // Update chart tiap 5 detik jika pair dipilih
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
    <div>
      {/* HEADER */}
      <header className="header">
        <div className="logo">Tana Ecosystem</div>
        <nav>
          <ul>
            <li><a href="#">Login</a></li>
            <li><a href="#">Market</a></li>
            <li><a href="#">Team</a></li>
            <li><a href="#">Tentang Kami</a></li>
            <li><a href="#">Trade Engine</a></li>
          </ul>
        </nav>
      </header>

      {/* BODY: List Market Crypto */}
      <main className="main">
        <h1>List Market Crypto</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Last Price</th>
              <th>Volume</th>
            </tr>
          </thead>
          <tbody>
            {markets.map((m, i) => (
              <tr key={i}>
                <td>{m.symbol}</td>
                <td>{m.last}</td>
                <td>{m.vol}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* MARKET PREDICTION & CHART */}
        <section style={{ marginTop: "48px" }}>
          <h2>Prediksi & Chart Market Crypto</h2>
          <div style={{ margin: "20px 0" }}>
            <label>Pilih Ticker: </label>
            <select
              value={selectedPair}
              onChange={(e) => setSelectedPair(e.target.value)}
            >
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

          {candleData.length > 0 && (
            <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <CandlestickChart data={candleData} />
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div>
          <b>Contact:</b> info@tanaecosystem.com
        </div>
        <div>
          <b>Links:</b> Login | Market | Team | Tentang Kami | Trade Engine
        </div>
        <div>
          &copy; {new Date().getFullYear()} Tana Ecosystem. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
