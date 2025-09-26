import { useEffect, useState, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function Home() {
  const [summaries, setSummaries] = useState({});
  const [selectedPair, setSelectedPair] = useState(null);
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [highlight, setHighlight] = useState({ bids: {}, asks: {} });
  const [priceHistory, setPriceHistory] = useState([]);

  const prevOrderBook = useRef({ bids: [], asks: [] });

  // ✅ Ambil data summaries (sekali waktu load)
  useEffect(() => {
    fetch("http://127.0.0.1:8000/indodax-summaries")
      .then(res => res.json())
      .then(data => {
        console.log("Summaries:", data);
        setSummaries(data.tickers);
      })
      .catch(err => console.error("Error fetch summaries:", err));
  }, []);

  // ✅ Auto-refresh orderbook & price history tiap 3 detik
  useEffect(() => {
    if (!selectedPair) return;

    const fetchOrderbook = () => {
      fetch(`http://127.0.0.1:8000/indodax-orderbook/${selectedPair}`)
        .then(res => res.json())
        .then(data => {
          const newBids = data.buy || [];
          const newAsks = data.sell || [];
          const lastPrice = summaries[selectedPair]?.last || 0;

          // simpan ke price history (max 20 data)
          setPriceHistory(prev => {
            const newHistory = [...prev, { time: new Date().toLocaleTimeString(), price: Number(lastPrice) }];
            return newHistory.slice(-20);
          });

          // highlight
          const newHighlight = { bids: {}, asks: {} };
          newBids.slice(0, 10).forEach(([price, qty], i) => {
            if (prevOrderBook.current.bids[i] && prevOrderBook.current.bids[i][0] !== price) {
              newHighlight.bids[i] = price > prevOrderBook.current.bids[i][0] ? "up" : "down";
            }
          });

          newAsks.slice(0, 10).forEach(([price, qty], i) => {
            if (prevOrderBook.current.asks[i] && prevOrderBook.current.asks[i][0] !== price) {
              newHighlight.asks[i] = price > prevOrderBook.current.asks[i][0] ? "up" : "down";
            }
          });

          setHighlight(newHighlight);
          setOrderBook({ bids: newBids, asks: newAsks });
          prevOrderBook.current = { bids: newBids, asks: newAsks };

          // Hapus highlight setelah 1 detik
          setTimeout(() => setHighlight({ bids: {}, asks: {} }), 1000);
        })
        .catch(err => console.error("Error fetch orderbook:", err));
    };

    fetchOrderbook();
    const interval = setInterval(fetchOrderbook, 3000);

    return () => clearInterval(interval);
  }, [selectedPair, summaries]);

  const getHighlightStyle = (side, i) => {
    if (highlight[side][i] === "up") {
      return { backgroundColor: "#d4f7d4" }; // hijau muda
    } else if (highlight[side][i] === "down") {
      return { backgroundColor: "#f7d4d4" }; // merah muda
    }
    return {};
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Tana Ecosystem</h1>
      <nav style={{ marginBottom: "20px" }}>
        <a href="#">Home</a> | <a href="#">Prediksi</a> | <a href="#">Bot</a>
      </nav>

      <h2>TICKERS</h2>
      {summaries && Object.keys(summaries).map(pair => (
        <div key={pair} style={{ marginBottom: "15px" }}>
          <button onClick={() => {
            setSelectedPair(pair);
            setPriceHistory([]); // reset grafik tiap ganti pair
          }}>
            {pair.toUpperCase()}
          </button>
          <p>
            High: {summaries[pair].high} / Low: {summaries[pair].low} <br />
            Last: {summaries[pair].last}
          </p>
        </div>
      ))}

      {selectedPair && (
        <div style={{ marginTop: "30px" }}>
          <h2>Order Book ({selectedPair.toUpperCase()})</h2>
          <div style={{ display: "flex", gap: "40px" }}>
            {/* BID TABLE */}
            <div>
              <h3>Bids</h3>
              <table border="1" cellPadding="5" style={{ borderCollapse: "collapse" }}>
                <thead style={{ backgroundColor: "#e6ffe6" }}>
                  <tr>
                    <th>Price (IDR)</th>
                    <th>Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {orderBook.bids.slice(0, 10).map(([price, qty], i) => (
                    <tr key={i} style={{ ...getHighlightStyle("bids", i) }}>
                      <td style={{ color: "green", fontWeight: "bold" }}>{price}</td>
                      <td>{qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ASK TABLE */}
            <div>
              <h3>Asks</h3>
              <table border="1" cellPadding="5" style={{ borderCollapse: "collapse" }}>
                <thead style={{ backgroundColor: "#ffe6e6" }}>
                  <tr>
                    <th>Price (IDR)</th>
                    <th>Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {orderBook.asks.slice(0, 10).map(([price, qty], i) => (
                    <tr key={i} style={{ ...getHighlightStyle("asks", i) }}>
                      <td style={{ color: "red", fontWeight: "bold" }}>{price}</td>
                      <td>{qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 📈 Grafik Harga */}
          <div style={{ marginTop: "40px" }}>
            <h3>Harga {selectedPair.toUpperCase()} (Realtime)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={priceHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
