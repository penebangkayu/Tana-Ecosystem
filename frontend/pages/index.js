import Navbar from "../components/Navbar";
import CryptoCard from "../components/CryptoCard";

export default function Home() {
  const cryptos = [
    { name: "Bitcoin", price: "$27,000", prediction: "Up 2%" },
    { name: "Ethereum", price: "$1,800", prediction: "Down 1%" },
    { name: "Solana", price: "$25", prediction: "Up 5%" },
    { name: "Cardano", price: "$0.50", prediction: "Up 3%" },
  ];

  return (
    <>
      <Navbar />
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: "20px" }}>
        {cryptos.map((c, i) => <CryptoCard key={i} {...c} />)}
      </div>
    </>
  )
}
