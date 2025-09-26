import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CryptoCard from "../components/CryptoCard";

export default function Home() {
  const [cryptos, setCryptos] = useState([]);
  const [selectedPair, setSelectedPair] = useState(null);
  const [orderBook, setOrderBook] = useState(null);

  // Ambil summary semua pair
  useEffect(() => {
    fetch("http://localhost:8000/indodax-summaries")
      .then(res => res.json())
      .then(data => {
        const pairs = Object.keys(data).map(key => ({
          key,
          price: data[key].last,
          high: data[key].high,
          low: data[key].low
        }));
        setCryptos(pairs);
      });
  }, []);

  // Ambil order book ketika pair diklik
  useEffect(() => {
    if (!selectedPair) return;

    const fetchOrderBook = () => {
      fetch(`http://localhost:8000/indodax-orderbook/${selectedPair}`)
        .then(res => res.json())
        .then(data => setOrderBook(data));
    };

    fetchOrderBook();
    const interval = setInterval(fetchOrderBook, 5000); // refresh setiap 5 detik
    return () => clearInterval(interval);
  }, [selectedPair]);

  return (
    <>
      <Navbar />
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: "20px" }}>
        {cryptos.map((c, i) => (
          <div 
            key={i} 
            style={{ cursor: "pointer", margin: "5px" }}
            onClick={() => setSelectedPair(c.key)}
          >
            <CryptoCard
              name={c.key.toUpperCase()}
              price={c.price}
              prediction={`High: ${c.high} / Low: ${c.low}`}
              isSelected={selectedPair === c.key}
            />
          </div>
        ))}
      </div>

      {selectedPair && orderBook && (
        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <h2>Order Book {selectedPair.toUpperCase()}</h2>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div>
              <h4>Bids</h4>
              {orderBook.bids?.slice(0,5).map((b, i) => <p key={i}>{b[1]} @ {b[0]}</p>)}
            </div>
            <div>
              <h4>Asks</h4>
              {orderBook.asks?.slice(0,5).map((a, i) => <p key={i}>{a[1]} @ {a[0]}</p>)}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
