import { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

export default function CandlestickChart({ pair }) {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        textColor: "#000",
        background: { type: "solid", color: "#fff" },
      },
      grid: {
        vertLines: { color: "#eee" },
        horzLines: { color: "#eee" },
      },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#4caf50",
      borderUpColor: "#4caf50",
      wickUpColor: "#4caf50",
      downColor: "#f44336",
      borderDownColor: "#f44336",
      wickDownColor: "#f44336",
    });

    async function fetchData() {
      try {
        const res = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${pair}&interval=1h&limit=50`
        );
        const data = await res.json();

        const formatted = data.map((d) => ({
          time: d[0] / 1000, // Binance kasih timestamp ms → convert ke detik
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
        }));

        candleSeries.setData(formatted);
      } catch (err) {
        console.error("Gagal ambil data Binance:", err);
      }
    }

    fetchData();

    return () => chart.remove();
  }, [pair]);

  return <div ref={chartContainerRef} style={{ width: "100%", height: "400px" }} />;
}
