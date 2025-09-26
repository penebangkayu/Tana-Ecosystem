import { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

export default function CandlestickChart({ pair }) {
  const chartContainerRef = useRef();

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: "#ffffff" },
        textColor: "#000",
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

    async function fetchCandles() {
      const res = await fetch(
        `https://indodax.com/tradingview/history?symbol=${pair}&resolution=60&from=${Math.floor(Date.now()/1000 - 86400)}&to=${Math.floor(Date.now()/1000)}`
      );
      const data = await res.json();

      if (data && data.t) {
        const candles = data.t.map((t, i) => ({
          time: t,
          open: data.o[i],
          high: data.h[i],
          low: data.l[i],
          close: data.c[i],
        }));
        candleSeries.setData(candles);
      }
    }

    fetchCandles();

    return () => chart.remove();
  }, [pair]);

  return <div ref={chartContainerRef} style={{ width: "100%", height: "100%" }} />;
}
