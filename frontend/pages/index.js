import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const CandlestickChart = dynamic(() => import("../components/candlestickchart"), {
  ssr: false, // ⬅️ penting biar ga error di server
});

export default function Home() {
  const [pair, setPair] = useState("BTCUSDT");
  const [orderbook, setOrderbook] = useState(null);

  useEffect(() => {
    async function fetchOrderbook() {
      try {
        const res = await fetch(
          `https://api.binance.com/api/v3/depth?symbol=${pair}&limit=10`
        );
        const data = await res.json();
        setOrderbook(data);
      } catch (err) {
        console.error("Gagal ambil orderbook:", err);
      }
    }

    fetchOrderbook();
    const interval = setInterval(fetchOrderbook, 5000);
    return () => clearInterval(interval);
  }, [pair]);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Tana Ecosystem</h1>
      <h2>Website Prediksi Pasar Crypto & Bot Trading</h2>

      <label>
        Pilih Pair:{" "}
        <select value={pair} onChange={(e) => setPair(e.target.value)}>
          <option value="BTCUSDT">BTC/USDT</option>
          <option value="ETHUSDT">ETH/USDT</option>
          <option value="BNBUSDT">BNB/USDT</option>
        </select>
      </label>

      <h3>Grafik Harga {pair} (Candlestick)</h3>
      <CandlestickChart pair={pair} />

      {orderbook && orderbook.bids && orderbook.asks && (
        <>
          <h3>Order Book</h3>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <h4>Bids</h4>
              <ul>
                {orderbook.bids.slice(0, 5).map((bid, i) => (
                  <li key={i}>
                    {bid[0]} USDT — {bid[1]} {pair.replace("USDT", "")}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Asks</h4>
              <ul>
                {orderbook.asks.slice(0, 5).map((ask, i) => (
                  <li key={i}>
                    {ask[0]} USDT — {ask[1]} {pair.replace("USDT", "")}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
