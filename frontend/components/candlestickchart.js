import { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

export default function CandlestickChart({ data }) {
  const chartContainerRef = useRef();

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: "#ffffff" },
        textColor: "#333",
      },
      grid: {
        vertLines: { color: "#eee" },
        horzLines: { color: "#eee" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
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

    candleSeries.setData(data);

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data]);

  return <div ref={chartContainerRef} style={{ width: "100%", height: "400px" }} />;
}
