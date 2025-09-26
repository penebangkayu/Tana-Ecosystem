// pages/index.js
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const CandlestickChart = dynamic(() => import("../components/candlestickchart"), {
  ssr: false,
});

export default function Home() {
  const [pair, setPair] = useState("btc_idr");
  const [orderbook, setOrderbook] = useState(null);

  useEffect(() => {
    // Ambil Orderbook langsung dari Indodax API
    fetch(`https://indodax.com/api/order_book/${pair}`)
      .then((res) => res.json())
      .then((data) => setOrderbook(data));
  }, [pair]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Tana Ecosystem</h1>
      <h2>Website Prediksi Pasar Crypto & Bot Trading</h2>

      <label>Pilih Pair: </label>
      <select value={pair} onChange={(e) => setPair(e.target.value)}>
        <option value="btc_idr">BTC/IDR</option>
        <option value="eth_idr">ETH/IDR</option>
        <option value="xrp_idr">XRP/IDR</option>
      </select>

      <h3>Grafik Harga {pair.toUpperCase()} (Candlestick)</h3>
      <CandlestickChart pair={pair} />

      {orderbook && (
        <>
          <h3>Order Book</h3>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <h4>Bids</h4>
              <ul>
                {orderbook.buy.slice(0, 5).map((bid, i) => (
                  <li key={i}>{bid[0]} IDR — {bid[1]} {pair.split("_")[0]}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Asks</h4>
              <ul>
                {orderbook.sell.slice(0, 5).map((ask, i) => (
                  <li key={i}>{ask[0]} IDR — {ask[1]} {pair.split("_")[0]}</li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
