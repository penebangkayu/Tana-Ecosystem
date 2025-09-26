export default function CryptoCard({ name, price, prediction, isSelected }) {
  return (
    <div style={{
      border: isSelected ? "2px solid #4caf50" : "1px solid #ccc",
      borderRadius: "10px",
      padding: "10px 15px",
      margin: "5px",
      minWidth: "120px",
      textAlign: "center",
      backgroundColor: isSelected ? "#f0fff0" : "#fff",
      transition: "0.2s"
    }}>
      <h4>{name}</h4>
      <p>{price}</p>
      <small>{prediction}</small>
    </div>
  );
}
