export default function CryptoCard({ name, price, prediction }) {
  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "15px",
      margin: "10px",
      width: "200px",
      backgroundColor: "white",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
    }}>
      <h2>{name}</h2>
      <p>Price: {price}</p>
      <p>Prediction: {prediction}</p>
    </div>
  )
}
