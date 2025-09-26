import { useState, useEffect } from "react";

export default function Home() {
  const [summaries, setSummaries] = useState({});
  const [selectedPair, setSelectedPair] = useState("btc_idr");
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });

  // Fetch summary semua pair
  useEffect(() => {
    fetch("http://localhost:8000/indodax-summaries")
      .then(res => res.json())
      .then(data => setSummaries(data));
  }, []);

  // Fetch order book saat pair berubah
  useEffect(() => {
    if (!selectedPair) return;
    fetch(`http://localhost:8000/indodax-orderbook/${selectedPair}`)
      .then(res => res.json())
      .then(data => setOrderBook({
        bids: data["bids"] || [],
        asks: data["asks"] || []
      }));
  }, [selectedPair]);

  return (
    <div>
      <h1>Tana Ecosystem</h1>
      <div>
        <h2>Summary</h2>
        {Object.keys(summaries).map(pair => (
          <div key={pair}>
            <button onClick={() => setSelectedPair(pair)}>
              {pair.toUpperCase()}
            </button>
            <p>
              High: {summaries[pair].high} / Low: {summaries[pair].low} <br/>
              Last: {summaries[pair].last}
            </p>
          </div>
        ))}
      </div>

      <div>
        <h2>Order Book ({selectedPair.toUpperCase()})</h2>
        <div style={{ display: "flex", gap: "50px" }}>
          <div>
            <h3>Bids</h3>
            {orderBook.bids.map(([price, qty], i) => (
              <p key={i}>{price} / {qty}</p>
            ))}
          </div>
          <div>
            <h3>Asks</h3>
            {orderBook.asks.map(([price, qty], i) => (
              <p key={i}>{price} / {qty}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
