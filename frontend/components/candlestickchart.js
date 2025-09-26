"use client";
import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

export default function CandlestickChart({ symbol = "BTCUSDT" }) {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // ✅ Buat chart baru
    chartRef.current = createChart(chartContainerRef.current, {
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

    // ✅ Tambah candlestick series
    candleSeriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: "#4caf50",
      borderUpColor: "#4caf50",
      wickUpColor: "#4caf50",
      downColor: "#f44336",
      borderDownColor: "#f44336",
      wickDownColor: "#f44336",
    });

    // ✅ Ambil data awal (200 candle terakhir dari Binance)
    fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=200`
    )
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((d) => ({
          time: d[0] / 1000,
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
        }));
        console.log("Candlestick data:", formatted); // ✅ Debug
        candleSeriesRef.current.setData(formatted);
      })
      .catch((err) => console.error("Error fetch Binance data:", err));

    // ✅ Resize otomatis
    const handleResize = () => {
      chartRef.current.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [symbol]);

  return (
    <div
      ref={chartContainerRef}
      style={{ width: "100%", height: "400px", minHeight: "400px" }}
    />
  );
}
