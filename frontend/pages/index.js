"use client";
import { useState, useEffect, useRef } from "react";
import CandlestickChart from "../components/candlestickchart";

export default function Home() {
  const [markets, setMarkets] = useState([]);
  const [selectedPair, setSelectedPair] = useState("");
  const [ticker, setTicker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [candleData, setCandleData] = useState([]);
  const intervalRef = useRef();

  // Ambil list coin dari Indodax
  useEffect(() => {
    async function fetchMarkets() {
      try {
        const res = await fetch("https://indodax.com/api/pairs");
        const data = await res.json();
        // Filter hanya pair dengan IDR dan tampilkan 10 market teratas
        const idrMarkets = data.filter((m) => m.pair.endsWith("_idr")).slice(0, 10);
        setMarkets(idrMarkets);
      } catch (err) {
        console.error("Failed fetching markets:", err);
      }
    }
    fetchMarkets();
  }, []);

  // Ambil data chart & ticker dari Indodax API
  async function fetchTickerAndCandle(pair) {
    setLoading(true);
    try {
      // Ticker
      const res = await fetch(`https://indodax.com/api/${pair}/ticker`);
      const tickerData = await res.json();
      setTicker(tickerData.ticker);

      // Candlestick (ambil dari trades, simulasi OHLC)
      const tradesRes = await fetch(`https://indodax.com/api/${pair}/trades`);
      const trades = await tradesRes.json();

      // Simulasi candle: 30 candle harian dari trades
      const dummyCandles = [];
      const now = Math.floor(Date.now() / 1000);
      for (let i = 0; i < 30; i++) {
        // Filter trades untuk hari i
        const dayStart = now - (30 - i) * 86400;
        const dayEnd = dayStart + 86400;
        const dayTrades = trades.filter((t) => t.date >= dayStart && t.date < dayEnd);

        let open, close, high, low;
        if (dayTrades.length) {
          open = parseFloat(dayTrades[0].price);
          close = parseFloat(dayTrades[dayTrades.length - 1].price);
          high = Math.max(...dayTrades.map((t) => parseFloat(t.price)));
          low = Math.min(...dayTrades.map((t) => parseFloat(t.price)));
        } else {
          // Jika tidak ada trades, pakai harga terakhir ticker
          const price = parseFloat(tickerData.ticker.last);
          open = close = high = low = price;
        }
        dummyCandles.push({
          time: dayStart,
          open,
          high,
          low,
          close,
        });
      }
      setCandleData(dummyCandles);
    } catch (err) {
      console.error("Failed fetching ticker or candle:", err);
    } finally {
      setLoading(false);
    }
  }

  // Auto refresh chart tiap 5 detik
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
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "24px" }}>
          {markets.map((m) => (
            <button
              key={m.pair}
              style={{
                padding: "10px 18px",
                borderRadius: "8px",
                border: selectedPair === m.pair ? "2px solid #4caf50" : "1px solid #eaeaea",
                background: selectedPair === m.pair ? "#e6fbe8" : "#fff",
                cursor: "pointer",
                fontWeight: "bold",
                color: "#25254a",
              }}
              onClick={() => setSelectedPair(m.pair)}
            >
              {m.pair.toUpperCase()}
            </button>
          ))}
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Base</th>
              <th>Counter</th>
            </tr>
          </thead>
          <tbody>
            {markets.map((m, i) => (
              <tr key={i}>
                <td>{m.pair.toUpperCase()}</td>
                <td>{m.base_currency.toUpperCase()}</td>
                <td>{m.counter_currency.toUpperCase()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* MARKET PREDICTION & CHART */}
        <section style={{ marginTop: "48px" }}>
          <h2>Prediksi & Chart Market Crypto</h2>
          {selectedPair && (
            <div style={{ margin: "16px 0" }}>
              <b>Pair dipilih: {selectedPair.toUpperCase()}</b>
            </div>
          )}

          {loading && <p>Memuat data ticker & candle...</p>}

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
